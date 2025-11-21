const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const { parse } = require('csv-parse/sync');
const DBSOURCE = process.env.DB_PATH || path.join(__dirname, 'main.db');

const csvDir = path.join(__dirname, 'csv_data'); 
let records = []; // データを全部ここに貯める配列

// --- ステップ1: フォルダ内の全CSVファイルを読み込む ---
try {
    console.log(`[ステップ1] "${csvDir}" フォルダ内のCSVファイルを読み込みます...`);

    // フォルダが存在するか確認
    if (!fs.existsSync(csvDir)) {
        throw new Error(`フォルダが見つかりません: ${csvDir}`);
    }

    // フォルダ内のファイル一覧を取得し、.csv だけに絞り込む
    const files = fs.readdirSync(csvDir).filter(file => file.endsWith('.csv'));

    if (files.length === 0) {
        throw new Error("指定されたフォルダに .csv ファイルがありません。");
    }

    // 見つかったCSVファイルを1つずつ順番に処理する
    files.forEach(file => {
        const filePath = path.join(csvDir, file);
        console.log(`  > 読み込み中: ${file}`);

        const fileContent = fs.readFileSync(filePath, 'utf8');

        // BOM除去
        const cleanFileContent = fileContent.replace(/^\uFEFF/, "");

        // 解析して、records 配列に追加 (結合) していく
        // const fileRecords = parse(cleanFileContent, { columns: true, skip_empty_lines: true, trim: true });

        const fileRecords = parse(cleanFileContent, { 
            // CSVファイルの1行目（ヘッダー）を使わず、以下のリストをキーとして使います
            columns: [
                'category', 'field', 'subfield', 'detail', 'year', 
                'question', 'answer', 'choice1', 'choice2', 'choice3', 'choice4', 
                'time_limit', 'commentary'
            ],
            from_line: 2, // 1行目はヘッダーなので読み飛ばす（ここ重要）
            skip_empty_lines: true,
            trim: true
        });

        records = records.concat(fileRecords);
    });

    if (records.length === 0) {
        throw new Error("CSVファイルの中身が空です。");
    }

    // ★★★ デバッグログ ★★★
    if (records.length > 0 && records[0]) {
        console.log("[デバッグ] 結合後の最初のレコードのキー:", Object.keys(records[0]));
    }

    console.log(`[ステップ2] 全ファイル合計 ${records.length} 件のデータを読み込み完了。データベース処理を開始します。`);

} catch (err) {
    console.error("CSV処理中にエラーが発生しました:", err.message);
    return;
}

const db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        return console.error("DB接続エラー:", err.message);
    }
    console.log("[ステップ3] データベースに接続しました。");

    const createTablesSql = `
        /* DROP TABLE IF EXISTS users; */
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            level INTEGER DEFAULT 1,
            xp INTEGER DEFAULT 0,
            max_hp INTEGER DEFAULT 100,
            total_study_time_seconds INTEGER DEFAULT 0,
            potion_count INTEGER DEFAULT 10
        );

        /* DROP TABLE IF EXISTS quizzes; */
        CREATE TABLE IF NOT EXISTS quizzes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category TEXT NOT NULL,
            field TEXT NOT NULL,
            subfield TEXT NOT NULL,
            detail TEXT NOT NULL,
            year INTEGER,
            question TEXT NOT NULL,
            answer TEXT NOT NULL,
            choices TEXT NOT NULL,
            time_limit INTEGER DEFAULT 60,
            commentary TEXT,
            UNIQUE(category, question)
        );

        /* DROP TABLE IF EXISTS user_answers; */
        CREATE TABLE IF NOT EXISTS user_answers (
            /* id INTEGER PRIMARY KEY AUTOINCREMENT, */
            user_id INTEGER,
            quiz_id INTEGER,
            is_correct BOOLEAN,
            answered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            is_unsure BOOLEAN DEFAULT 0,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (quiz_id) REFERENCES quizzes(id),
            PRIMARY KEY (user_id, quiz_id)
        );

        /* DROP TABLE IF EXISTS user_titles; */
        CREATE TABLE IF NOT EXISTS user_titles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            title_name TEXT NOT NULL,
            earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id),
            UNIQUE(user_id, title_name)
        );

        /* DROP TABLE IF EXISTS yearly_results; */
        CREATE TABLE IF NOT EXISTS yearly_results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            category TEXT NOT NULL,
            year INTEGER NOT NULL,
            total_score_percent REAL NOT NULL,
            strategy_percent REAL NOT NULL,
            management_percent REAL NOT NULL,
            technology_percent REAL NOT NULL,
            completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );
    `;

    db.exec(createTablesSql, function(err) {
        if (err) {
            console.error("テーブル作成エラー:", err.message);
            db.close();
            return;
        }
        console.log("[ステップ4] テーブルの準備が完了しました。");

        const insertSql = `
            INSERT INTO quizzes (category, field, subfield, detail, year, question, answer, choices, time_limit, commentary) 
            VALUES (?,?,?,?,?,?,?,?,?,?)
            ON CONFLICT(category, question)
            DO UPDATE SET
                commentary = excluded.commentary,
                subfield = excluded.subfield,
                detail = excluded.detail,
                answer = excluded.answer,
                choices = excluded.choices,
                time_limit = excluded.time_limit
        `;

        db.serialize(() => {
            db.run('BEGIN TRANSACTION;');
            const stmt = db.prepare(insertSql);

            records.forEach(row => {
                const choices = [row.choice1, row.choice2, row.choice3, row.choice4];
                stmt.run(row.category, row.field, row.subfield, row.detail, row.year, row.question, row.answer, JSON.stringify(choices), row.time_limit || 60, row.commentary);
            });

            stmt.finalize((err) => {
                if(err) {
                    console.error("ステートメント終了エラー:", err.message);
                    db.run('ROLLBACK;', () => db.close());
                    return;
                }

                db.run('COMMIT;', (commitErr) => {
                    if (commitErr) {
                        console.error("コミットエラー:", commitErr.message);
                        db.run('ROLLBACK;');
                    } else {
                        console.log(`[ステップ5] ${records.length}件のクイズが正常に登録されました。`);
                    }

                    db.close((closeErr) => {
                        if (closeErr) return console.error("DBクローズエラー:", closeErr.message);
                        console.log("[ステップ6] データベース接続をクローズしました。");
                    });
                });
            });
        });
    });
});