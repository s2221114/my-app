const express = require('express');
const router = express.Router();
const db = require('../database.js');
const bcrypt = require('bcryptjs');

// すべてのAPIレスポンスでキャッシュを無効にするミドルウェア
router.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    next();
});

// ユーザー登録
router.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: "EmailとPasswordは必須です。" });
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    db.run('INSERT INTO users (username, password) VALUES (?,?)', [username, hash], function(err) {
        if (err) {
            return res.status(400).json({ error: "このEmailは既に使用されています。" });
        }
        res.status(201).json({ message: "登録成功", userId: this.lastID });
    });
});

// ログイン
router.post("/login", (req, res) => {
    const { username, password } = req.body;
    db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
        if (err || !user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ error: "EmailまたはPasswordが違います。" });
        }
        const { password: _, ...userData } = user;
        res.json({ message: "ログイン成功", user: userData });
    });
});

// クイズ取得 (分野別)
router.get("/quizzes", (req, res) => {
    const { category, field, subfield, detail, userId } = req.query;
    if (!userId) {
        return res.status(400).json({ "error": "User ID is required" });
    }

    let sql = `
        SELECT q.* FROM quizzes q
        LEFT JOIN user_answers ua ON q.id = ua.quiz_id AND ua.user_id = ? AND ua.is_correct = 1
        WHERE ua.user_id IS NULL
    `;
    const params = [userId];

    if (category) { sql += " AND q.category = ?"; params.push(category); }
    if (field) { sql += " AND q.field = ?"; params.push(field); }
    if (subfield) { sql += " AND q.subfield = ?"; params.push(subfield); }
    if (detail) { sql += " AND q.detail = ?"; params.push(detail); }

    sql += " ORDER BY RANDOM()"; // ランダムな順序での取得のみ

    db.all(sql, params, (err, rows) => {
        if (err) {
            // return res.status(500).json({ "error": err.message });
            // エラーログを改善
            console.error("クイズ取得APIエラー:", err.message); 
            console.error("SQL:", sql);
            console.error("Params:", params);
            return res.status(500).json({ "error": "データベースクエリに失敗しました。" });
        }
        rows.forEach(row => {
            if (row.choices) {
                // row.choices = JSON.parse(row.choices);
                try { // JSON.parseのエラーハンドリング追加
                    row.choices = JSON.parse(row.choices);
                } catch (parseError) {
                    console.error(`ChoicesのJSONパースエラー (Quiz ID: ${row.id}):`, parseError);
                    row.choices = []; // パース失敗時は空配列にする
                }
            }
        });
        // quizzesというキーでラップして返す
        res.json({ quizzes: rows });
    });
});

// クイズ取得（年度別）
router.get("/quizzes-by-year", (req, res) => {
    const { year, category } = req.query; // userId を使わないように変更
    if (!year || !category) {
        return res.status(400).json({ "error": "Year and Category are required" });
    }

    // 正解履歴をチェックしない、シンプルなSQL文に戻す
    const sql = `
        SELECT * FROM quizzes
        WHERE year = ? AND category = ?
        ORDER BY RANDOM()
    `;
    
    db.all(sql, [year, category], (err, rows) => {
        if (err) {
            return res.status(500).json({ "error": err.message });
        }
        rows.forEach(row => {
            if (row.choices) {
                row.choices = JSON.parse(row.choices);
            }
        });
        res.json({ quizzes: rows });
    });
});

// 指定された条件の問題数をカウントするAPI
router.get("/quizzes/count", (req, res) => {
    const { category, field, subfield, detail } = req.query;
    let sql = "SELECT COUNT(*) as count FROM quizzes WHERE 1=1";
    const params = [];

    if (category) { sql += " AND category = ?"; params.push(category); }
    if (field) { sql += " AND field = ?"; params.push(field); }
    if (subfield) { sql += " AND subfield = ?"; params.push(subfield); }
    if (detail) { sql += " AND detail = ?"; params.push(detail); }

    db.get(sql, params, (err, row) => {
        if (err) {
            return res.status(500).json({ "error": err.message });
        }
        res.json({ count: row.count });
    });
});

// ユーザーの進捗更新
router.patch("/users/:id/progress", (req, res) => {
    const userId = req.params.id;
    const { level, xp, max_hp } = req.body;

    // 1. まず、DBから現在のレベルを取得する
    db.get("SELECT level FROM users WHERE id = ?", [userId], (err, currentUser) => {
        if (err || !currentUser) {
            return res.status(404).json({ error: "ユーザーが見つかりません。" });
        }

        // 2. 送られてきたレベル(req.body.level)がDBのレベルより高いかチェック
        // (script.js側でレベルアップ判定した結果、新しいレベルが送られてくるため)
        const didLevelUp = level > currentUser.level;
        
        let sql;
        let params;
        
        if (didLevelUp) {
            // 3a. レベルアップした場合：ポーションを+1するSQL
            console.log(`User ${userId} レベルアップ検知。ポーション+1`);
            sql = 'UPDATE users SET level = ?, xp = ?, max_hp = ?, potion_count = potion_count + 1 WHERE id = ?';
            params = [level, xp, max_hp, userId];
        } else {
            // 3b. レベルアップしなかった場合：ポーションを増やさないSQL (potion_count を除外)
            sql = 'UPDATE users SET level = ?, xp = ?, max_hp = ? WHERE id = ?';
            params = [level, xp, max_hp, userId];
        }

        // 4. 決定したSQLを実行
        db.run(sql, params, function (runErr) { //
            if (runErr) {
                console.error("進捗更新APIエラー:", runErr.message);
                return res.status(500).json({ error: "進捗の保存に失敗しました。" });
            }

            // 5. 更新後の最新データを返す (potion_count を含む)
            db.get("SELECT id, username, level, xp, max_hp, potion_count FROM users WHERE id = ?", [userId], (getErr, user) => { //
                if (getErr || !user) {
                    return res.status(404).json({ error: "ユーザーが見つかりません。" });
                }
                res.json({ message: "進捗を更新しました。", user: user });
            });
        });
    });

    /*
    db.run('UPDATE users SET level = ?, xp = ? WHERE id = ?', [level, xp, userId], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        // 更新後に、最新のユーザー情報を取得して返す
        db.get("SELECT id, username, level, xp FROM users WHERE id = ?", [userId], (err, user) => {
            if (err || !user) {
                return res.status(404).json({ error: "ユーザーが見つかりません。" });
            }
            res.json({ message: "進捗を更新しました。", user: user });
        });
    });
    */
});

/*
// 解答履歴の保存
router.post("/users/:id/answer", (req, res) => {
    const userId = req.params.id;
    const { quiz_id, is_correct } = req.body;

    // ★★★ 称号獲得チェックのロジックをここから削除 ★★★
    db.run(`INSERT INTO user_answers (user_id, quiz_id, is_correct) VALUES (?, ?, ?)`, [userId, quiz_id, is_correct], function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.status(201).json({ message: "解答を記録しました。" });
    });
});
*/
// 解答履歴の保存
router.post("/users/:id/answer", (req, res) => {
    const userId = req.params.id;
    // ★ script.js から is_unsure も受け取る
    const { quiz_id, is_correct, is_unsure } = req.body;
    // ★ 回答日時も保存する
    const answered_at = new Date().toISOString();

    // ★ seed.js の定義に合わせたSQL文 (ON CONFLICT を含む)
    const sql = `
        INSERT INTO user_answers (user_id, quiz_id, is_correct, answered_at, is_unsure) 
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(user_id, quiz_id) DO UPDATE SET
            is_correct = COALESCE(excluded.is_correct, user_answers.is_correct),
            answered_at = excluded.answered_at,
            is_unsure = excluded.is_unsure
    `;

    // is_unsure (undefined の可能性あり) をそのまま渡す
    db.run(sql, [userId, quiz_id, is_correct, answered_at, is_unsure], function(err) {
        if (err) {
            console.error('回答履歴の保存エラー:', err.message);
            return res.status(500).json({ error: '回答履歴の保存に失敗しました。' });
        }
        res.status(201).json({ message: "解答を記録しました。" });
    });
});

// モンスター討伐による称号獲得APIを新設
router.post("/users/:id/defeat", (req, res) => {
    const userId = req.params.id;
    const { detail_name } = req.body; // 倒したモンスターの分野名

    if (!detail_name) {
        return res.status(400).json({ error: "称号名(detail_name)がありません。" });
    }

    const title = `${detail_name}の覇者`;

    // INSERT OR IGNORE を、より標準的な ON CONFLICT 構文に修正
    // (seed.js の UNIQUE(user_id, title_name) 制約に対応)
    const sql = `
        INSERT INTO user_titles (user_id, title_name)
        VALUES (?, ?)
        ON CONFLICT(user_id, title_name) DO NOTHING
    `;

    db.run(sql, [userId, title], function(err) {
        if (err) {
            console.error("称号獲得APIエラー:", err.message); // エラーログを追加
            return res.status(500).json({ error: "称号の保存に失敗しました。" });
        }

        if (this.changes > 0) { // 新しい称号が実際に登録された場合
            console.log(`User ${userId} が新しい称号【${title}】を獲得しました。`); // サーバーログ

            // 新しい称号が登録されたので、ポーションを10個追加する
            const updatePotionSql = "UPDATE users SET potion_count = potion_count + 10 WHERE id = ?";

            db.run(updatePotionSql, [userId], function(updateErr) {
                if (updateErr) {
                    console.error("称号獲得時のポーション追加エラー:", updateErr.message);
                    // ポーション追加に失敗しても、称号獲得自体は成功している
                }

                // ポーション追加後、最新のユーザー情報を取得してクライアントに返す
                // (potion_count を含む最新情報を取得する)
                const selectUserSql = "SELECT id, username, level, xp, max_hp, potion_count FROM users WHERE id = ?";

                db.get(selectUserSql, [userId], (selectErr, user) => {
                    if (selectErr || !user) {
                        console.error("ポーション追加後のユーザー情報取得エラー:", selectErr ? selectErr.message : "ユーザーが見つかりません");
                        // ユーザー情報が取れなくても、称号獲得は成功したことを伝える
                        return res.status(201).json({ 
                            message: "称号を獲得しました！", 
                            new_title_unlocked: title,
                            user: null // ユーザー情報の更新は失敗
                        });
                    }

                    // 称号・メッセージ・最新のユーザー情報をすべて返す
                    res.status(201).json({ 
                        message: "称号を獲得しました！", 
                        new_title_unlocked: title,
                        user: user // 最新のユーザー情報を返す
                    });
                });
            });
            // res.status(201).json({ message: "称号を獲得しました！", new_title_unlocked: title });
        } else {
            res.status(200).json({ message: "この称号は既に獲得済みです。" });
        }
    });

    /*
    db.run("INSERT OR IGNORE INTO user_titles (user_id, title_name) VALUES (?, ?)", [userId, title], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        // this.changes > 0 は、新しい称号が実際に登録された場合
        if (this.changes > 0) {
            res.status(201).json({ message: "称号を獲得しました！", new_title_unlocked: title });
        } else {
            res.status(200).json({ message: "この称号は既に獲得済みです。" });
        }
    });
    */
});

// 称号リストを取得するAPI
router.get("/users/:id/titles", (req, res) => {
    const userId = req.params.id;
    db.all("SELECT title_name FROM user_titles WHERE user_id = ?", [userId], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        const titles = rows.map(row => row.title_name);
        res.json({ titles });
    });
});

// 分野別成績の取得 (レーダーチャート用)
router.get("/users/:id/stats", (req, res) => {
    const userId = req.params.id;
    const sql = `
        SELECT
            q.category,
            q.field,
            COUNT(DISTINCT q.id) as total_questions,
            COUNT(DISTINCT CASE WHEN ua.is_correct = 1 THEN q.id END) as correct_answers
        FROM quizzes q
        LEFT JOIN user_answers ua ON q.id = ua.quiz_id AND ua.user_id = ?
        GROUP BY q.category, q.field
    `;

    db.all(sql, [userId], (err, rows) => {
        if (err) {
            res.status(500).json({ "error": err.message });
            return;
        }

        // データを整形して返す
        const stats = {};
        rows.forEach(row => {
            if (!stats[row.category]) {
                stats[row.category] = {};
            }
            stats[row.category][row.field] = {
                total: row.total_questions,
                correct: row.correct_answers
            };
        });
        res.json(stats);
    });
});

// カテゴリ別進捗率 (例: ITパスポート試験)
router.get("/users/:id/progress-by-category", async (req, res) => {
    const userId = req.params.id;
    try {
        const totalsQuery = `SELECT category, COUNT(id) as total_count FROM quizzes GROUP BY category`;
        const totals = await new Promise((resolve, reject) => {
            db.all(totalsQuery, [], (err, rows) => (err ? reject(err) : resolve(rows)));
        });

        const correctsQuery = `
            SELECT q.category, COUNT(DISTINCT q.id) as correct_count FROM user_answers ua
            JOIN quizzes q ON ua.quiz_id = q.id
            WHERE ua.user_id = ? AND ua.is_correct = 1
            GROUP BY q.category`;
        const corrects = await new Promise((resolve, reject) => {
            db.all(correctsQuery, [userId], (err, rows) => (err ? reject(err) : resolve(rows)));
        });

        const progress = {};
        totals.forEach(totalRow => {
            const correctRow = corrects.find(c => c.category === totalRow.category);
            const correctCount = correctRow ? correctRow.correct_count : 0;
            progress[totalRow.category] = (totalRow.total_count > 0) ? (correctCount / totalRow.total_count) * 100 : 0;
        });
        res.json(progress);
    } catch (err) {
        res.status(500).json({ "error": err.message });
    }
});

// 分野別進捗率 (例: ストラテジ系)
router.get("/users/:id/progress-by-field", async (req, res) => {
    const { id: userId } = req.params;
    const { category } = req.query;
    try {
        const totalsQuery = `SELECT field, COUNT(id) as total_count FROM quizzes WHERE category = ? GROUP BY field`;
        const totals = await new Promise((resolve, reject) => {
            db.all(totalsQuery, [category], (err, rows) => (err ? reject(err) : resolve(rows)));
        });

        const correctsQuery = `
            SELECT q.field, COUNT(DISTINCT q.id) as correct_count FROM user_answers ua
            JOIN quizzes q ON ua.quiz_id = q.id
            WHERE ua.user_id = ? AND ua.is_correct = 1 AND q.category = ?
            GROUP BY q.field`;
        const corrects = await new Promise((resolve, reject) => {
            db.all(correctsQuery, [userId, category], (err, rows) => (err ? reject(err) : resolve(rows)));
        });

        const progress = {};
        totals.forEach(totalRow => {
            const correctRow = corrects.find(c => c.field === totalRow.field);
            const correctCount = correctRow ? correctRow.correct_count : 0;
            progress[totalRow.field] = (totalRow.total_count > 0) ? (correctCount / totalRow.total_count) * 100 : 0;
        });
        res.json(progress);
    } catch (err) {
        res.status(500).json({ "error": err.message });
    }
});

// 大分類別進捗率 (例: 企業と法務)
router.get("/users/:id/progress-by-subfield", async (req, res) => {
    const { id: userId } = req.params;
    const { category, field } = req.query;
    try {
        const totalsQuery = `SELECT subfield, COUNT(id) as total_count FROM quizzes WHERE category = ? AND field = ? GROUP BY subfield`;
        const totals = await new Promise((resolve, reject) => {
            db.all(totalsQuery, [category, field], (err, rows) => (err ? reject(err) : resolve(rows)));
        });

        const correctsQuery = `
            SELECT q.subfield, COUNT(DISTINCT q.id) as correct_count FROM user_answers ua
            JOIN quizzes q ON ua.quiz_id = q.id
            WHERE ua.user_id = ? AND ua.is_correct = 1 AND q.category = ? AND q.field = ?
            GROUP BY q.subfield`;
        const corrects = await new Promise((resolve, reject) => {
            db.all(correctsQuery, [userId, category, field], (err, rows) => (err ? reject(err) : resolve(rows)));
        });

        const progress = {};
        totals.forEach(totalRow => {
            const correctRow = corrects.find(c => c.subfield === totalRow.subfield);
            const correctCount = correctRow ? correctRow.correct_count : 0;
            progress[totalRow.subfield] = (totalRow.total_count > 0) ? (correctCount / totalRow.total_count) * 100 : 0;
        });
        res.json(progress);
    } catch (err) {
        res.status(500).json({ "error": err.message });
    }
});

// 小分類別進捗率 (例: 法務)
router.get("/users/:id/progress-by-detail", async (req, res) => {
    const { id: userId } = req.params;
    const { category, field, subfield } = req.query;
    try {
        const totalsQuery = `SELECT detail, COUNT(id) as total_count FROM quizzes WHERE category = ? AND field = ? AND subfield = ? GROUP BY detail`;
        const totals = await new Promise((resolve, reject) => {
            db.all(totalsQuery, [category, field, subfield], (err, rows) => (err ? reject(err) : resolve(rows)));
        });

        const correctsQuery = `
            SELECT q.detail, COUNT(DISTINCT q.id) as correct_count FROM user_answers ua
            JOIN quizzes q ON ua.quiz_id = q.id
            WHERE ua.user_id = ? AND ua.is_correct = 1 AND q.category = ? AND q.field = ? AND q.subfield = ?
            GROUP BY q.detail`;
        const corrects = await new Promise((resolve, reject) => {
            db.all(correctsQuery, [userId, category, field, subfield], (err, rows) => (err ? reject(err) : resolve(rows)));
        });

        const progress = {};
        totals.forEach(totalRow => {
            const correctRow = corrects.find(c => c.detail === totalRow.detail);
            const correctCount = correctRow ? correctRow.correct_count : 0;
            progress[totalRow.detail] = (totalRow.total_count > 0) ? (correctCount / totalRow.total_count) * 100 : 0;
        });
        res.json(progress);
    } catch (err) {
        res.status(500).json({ "error": err.message });
    }
});

// 年度ごとの進捗率を取得するAPI
router.get("/users/:id/progress-by-year", async (req, res) => {
    const userId = req.params.id;
    try {
        const totalQuestionsQuery = `SELECT year, COUNT(id) as total_count FROM quizzes WHERE year IS NOT NULL GROUP BY year`;
        const totals = await new Promise((resolve, reject) => {
            db.all(totalQuestionsQuery, [], (err, rows) => (err ? reject(err) : resolve(rows)));
        });

        const correctAnswersQuery = `
            SELECT q.year, COUNT(DISTINCT q.id) as correct_count
            FROM user_answers ua JOIN quizzes q ON ua.quiz_id = q.id
            WHERE ua.user_id = ? AND ua.is_correct = 1 AND q.year IS NOT NULL
            GROUP BY q.year`;
        const corrects = await new Promise((resolve, reject) => {
            db.all(correctAnswersQuery, [userId], (err, rows) => (err ? reject(err) : resolve(rows)));
        });

        const progress = {};
        totals.forEach(totalRow => {
            if (totalRow.year) {
                const correctRow = corrects.find(c => c.year === totalRow.year);
                const correctCount = correctRow ? correctRow.correct_count : 0;
                progress[totalRow.year] = (totalRow.total_count > 0) ? (correctCount / totalRow.total_count) * 100 : 0;
            }
        });
        res.json(progress);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 修練の間（年度別）の結果を保存するAPI
router.post("/users/:id/save-yearly-result", (req, res) => {
    const userId = req.params.id;
    const { category, year, totalScorePercent, strategyPercent, managementPercent, technologyPercent } = req.body;

    if (!category || !year || totalScorePercent === undefined) {
        return res.status(400).json({ error: "必要なデータが不足しています。" });
    }

    const sql = `
        INSERT INTO yearly_results 
        (user_id, category, year, total_score_percent, strategy_percent, management_percent, technology_percent) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [userId, category, year, totalScorePercent, strategyPercent, managementPercent, technologyPercent];

    db.run(sql, params, function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: "修練の結果を保存しました。" });
    });
});

// 過去の修練の間（年度別）の結果リストを取得するAPI
router.get("/users/:id/yearly-results", (req, res) => {
    const userId = req.params.id;
    const sql = `
        SELECT id, category, year, total_score_percent, strategy_percent, management_percent, technology_percent, completed_at 
        FROM yearly_results 
        WHERE user_id = ? 
        ORDER BY completed_at DESC
    `;
    db.all(sql, [userId], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ results: rows });
    });
});

// POST /api/users/:userId/log-time
// (script.js の logStudyTime 関数から呼び出される)
router.post('/users/:userId/log-time', (req, res) => {
    const { userId } = req.params;
    const { duration } = req.body; // { duration: 120 } という形式でデータが送られてくる

    // duration が数字で、0より大きいかチェック
    if (typeof duration !== 'number' || duration <= 0) {
        return res.status(400).json({ error: '無効な時間データです。' });
    }

    // データベースの total_study_time_seconds カラムに加算する
    const sql = `
        UPDATE users 
        SET total_study_time_seconds = total_study_time_seconds + ? 
        WHERE id = ?
    `;

    // (注: 'db' の部分は、api.js の上部で require('./database.js') している変数名です)
    db.run(sql, [duration, userId], function(err) {
        if (err) {
            console.error('学習時間の更新エラー:', err.message);
            return res.status(500).json({ error: '学習時間の記録に失敗しました。' });
        }
        console.log(`User ${userId} の学習時間を ${duration} 秒追加しました。`);
        res.status(200).json({ message: '学習時間を記録しました。' });
    });
});

// ユーザーが 'is_unsure = 1' で回答した問題を取得 (ランダム順)
router.get('/quizzes/unsure/:userId', (req, res) => {
    const { userId } = req.params;

    const sql = `
        SELECT q.* FROM quizzes q
        JOIN user_answers ua ON q.id = ua.quiz_id
        WHERE ua.user_id = ? AND ua.is_unsure = 1
        ORDER BY RANDOM()
    `;

    db.all(sql, [userId], (err, rows) => {
        if (err) {
            console.error("チェック問題 取得APIエラー:", err.message);
            return res.status(500).json({ error: 'データベースクエリに失敗しました。' });
        }
        
        // 選択肢をJSONパースする (他のクイズAPIと同様)
        rows.forEach(row => {
            if (row.choices) {
                try {
                    row.choices = JSON.parse(row.choices);
                } catch (parseError) {
                    row.choices = []; 
                }
            }
        });
        res.json({ quizzes: rows });
    });
});

router.post('/users/:id/use-potion', (req, res) => {
    const userId = req.params.id;

    // 1. まずポーションがあるか確認
    db.get("SELECT potion_count FROM users WHERE id = ?", [userId], (err, user) => {
        if (err || !user) return res.status(404).json({ error: "ユーザーが見つかりません" });
        if (user.potion_count <= 0) {
            return res.status(400).json({ error: "ポーションがありません。" });
        }

        // 2. ポーションを1つ減らす
        db.run("UPDATE users SET potion_count = potion_count - 1 WHERE id = ?", [userId], function(updateErr) {
            if (updateErr) return res.status(500).json({ error: "データベースエラー" });

            // 3. 最新のユーザー情報を返す
            db.get("SELECT id, username, level, xp, max_hp, potion_count FROM users WHERE id = ?", [userId], (err, updatedUser) => {
                if (err || !updatedUser) return res.status(500).json({ error: "ユーザー情報の取得エラー" });
                res.status(200).json({ message: "HPが回復した！", user: updatedUser });
            });
        });
    });
});

// 管理者用：全ユーザーのステータス・学習時間を確認するAPI
router.get('/admin/all-users', (req, res) => {
    const secretKey = "admin123";
    if (req.query.key !== secretKey) {
        return res.status(403).send("⛔ アクセス拒否: 正しいキーを入力してください。");
    }

    const sql = `
        SELECT
            u.id,
            u.username,
            u.level,
            u.max_hp,
            u.potion_count,
            u.total_study_time_seconds,
            /* 最後に問題を解いた日時 (UTC) */
            (SELECT MAX(answered_at) FROM user_answers WHERE user_id = u.id) as last_played_utc,
            /* 正解数 (is_correct = 1) */
            (SELECT COUNT(*) FROM user_answers WHERE user_id = u.id AND is_correct = 1) as solved_count,
            /* 総回答数 (すべて) */
            (SELECT COUNT(*) FROM user_answers WHERE user_id = u.id) as total_answer_count
        FROM users u
        ORDER BY u.id ASC
    `;

    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

        let html = `
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: sans-serif; padding: 20px; }
                    table { border-collapse: collapse; width: 100%; max-width: 1200px; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; font-weight: bold; text-align: center; }
                    tr:nth-child(even) { background-color: #f9f9f9; }
                    tr:hover { background-color: #f1f1f1; }
                    h2 { color: #333; }
                    .num { text-align: right; }
                    .center { text-align: center; }
                </style>
            </head>
            <body>
                <h2>👑 ユーザー管理データ一覧</h2>
                <p>現在の登録ユーザー数: <strong>${rows.length}</strong> 人</p>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>ユーザー名</th>
                            <th>Lv</th>
                            <th>HP</th>
                            <th>ポーション</th>
                            <th>総回答数</th>
                            <th>正解数</th>
                            <th>学習時間 (秒)</th>
                            <th>最終プレイ日時</th> </tr>
                    </thead>
                    <tbody>
        `;

        rows.forEach(user => {
            // 日時の整形 (UTC -> 日本時間)
            let lastPlayedStr = "---";
            if (user.last_played_utc) {
                // 文字列として取得
                let dateStr = user.last_played_utc;

                // もし末尾に "Z" がなければ追加する
                if (!dateStr.endsWith("Z")) {
                    dateStr += "Z";
                }

                // 日付オブジェクトに変換
                const date = new Date(dateStr);

                // 有効な日付かチェックしてから変換
                if (!isNaN(date.getTime())) {
                    lastPlayedStr = date.toLocaleString('ja-JP', {
                        timeZone: 'Asia/Tokyo',
                        year: 'numeric', month: '2-digit', day: '2-digit',
                        hour: '2-digit', minute: '2-digit', second: '2-digit'
                    });
                } else {
                    lastPlayedStr = "日時データ破損";
                }
            }

            html += `
                <tr>
                    <td class="center">${user.id}</td>
                    <td><strong>${user.username}</strong></td>
                    <td class="num">${user.level}</td>
                    <td class="num">${user.max_hp}</td>
                    <td class="num">${user.potion_count}</td>
                    <td class="num">${user.total_answer_count}</td>
                    <td class="num" style="color: blue; font-weight:bold;">${user.solved_count}</td>
                    <td class="num">${user.total_study_time_seconds}</td>
                    <td class="center">${lastPlayedStr}</td> </tr>
            `;
        });

        html += `
                    </tbody>
                </table>
            </body>
            </html>
        `;

        res.send(html);
    });
});

// ポーション生成 (身を削って生成)
router.post('/users/:id/exchange-potion', (req, res) => {
    const userId = req.params.id;
    const COST = 50; // コスト

    db.get("SELECT level, xp, max_hp, potion_count FROM users WHERE id = ?", [userId], (err, user) => {
        if (err || !user) return res.status(404).json({ error: "ユーザーが見つかりません" });

        // 1. 現在のレベル・XPから「トータルXP」を逆算する
        // (Lv 1->2 には 20xp, 2->3 には 40xp... という計算の逆)
        // 公式: 10 * level * (level - 1) + current_xp
        let totalXP = (10 * user.level * (user.level - 1)) + user.xp;

        // 2. トータルXPがコストに足りているか確認
        if (totalXP < COST) {
            return res.status(400).json({ error: `経験値が足りません！(トータル ${totalXP} XP / 必要 ${COST} XP)` });
        }

        // 3. コストを支払う
        totalXP -= COST;

        // 4. 新しいトータルXPから「レベル」と「現在XP」を再計算する
        let newLevel = 1;
        let newXP = totalXP;

        while (true) {
            let xpNeededForNext = newLevel * 20; // 次のレベルに必要なXP
            if (newXP < xpNeededForNext) {
                break; // 足りなくなったらそこが今のレベル
            }
            newXP -= xpNeededForNext;
            newLevel++;
        }

        // 5. レベルに合わせて最大HPも再計算 (Lv1=100, +10ずつ)
        const newMaxHP = 100 + (newLevel - 1) * 10;

        // 6. データベースを更新 (レベル、XP、最大HP、ポーション)
        const sql = "UPDATE users SET level = ?, xp = ?, max_hp = ?, potion_count = potion_count + 1 WHERE id = ?";
        db.run(sql, [newLevel, newXP, newMaxHP, userId], function(updateErr) {
            if (updateErr) return res.status(500).json({ error: "交換に失敗しました" });

            // 最新情報を返す
            db.get("SELECT * FROM users WHERE id = ?", [userId], (getErr, updatedUser) => {
                res.status(200).json({
                    message: "ポーションを生成しました！(レベル変動あり)",
                    user: updatedUser
                });
            });
        });
    });
});

module.exports = router;