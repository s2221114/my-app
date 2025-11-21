document.addEventListener('DOMContentLoaded', () => {
    const quizHierarchy = {
        "ITパスポート試験": {
            'ストラテジ系': {
                '企業と法務': ['企業活動', '法務'],
                '経営戦略': ['経営戦略マネジメント', '技術戦略マネジメント', 'ビジネスインダストリ'],
                'システム戦略': ['システム戦略', 'システム企画']
            },
            'マネジメント系': {
                '開発技術': ['システム開発技術', 'ソフトウェア開発管理技術'],
                'プロジェクトマネジメント': ['プロジェクトマネジメント'],
                'サービスマネジメント': ['サービスマネジメント', 'システム監査']
            },
            'テクノロジ系': {
                '基礎理論': ['基礎理論', 'アルゴリズムとプログラミング'],
                'コンピュータシステム': ['コンピュータ構成要素', 'システム構成要素', 'ソフトウェア', 'ハードウェア'],
                '技術要素': ['情報デザイン', '情報メディア', 'データベース', 'ネットワーク', 'セキュリティ']
            }
        },
        "基本情報技術者試験": {
            'ストラテジ系': {
                'システム戦略': ['システム戦略', 'システム企画'],
                '経営戦略': ['経営戦略マネジメント', '技術戦略マネジメント', 'ビジネスインダストリ'],
                '企業と法務': ['企業活動', '法務']
            },
            'マネジメント系': {
                'プロジェクトマネジメント': ['プロジェクトマネジメント'],
                'サービスマネジメント': ['サービスマネジメント', 'システム監査']
            },
            'テクノロジ系': {
                '基礎理論': ['基礎理論', 'アルゴリズムとプログラミング'],
                'コンピュータシステム': ['コンピュータ構成要素', 'システム構成要素', 'ソフトウェア', 'ハードウェア'],
                '技術要素': ['ユーザーインターフェース', '情報メディア', 'データベース', 'ネットワーク', 'セキュリティ'],
                '開発技術': ['システム開発技術', 'ソフトウェア開発管理技術']
            }
        },
        "応用情報技術者試験": {
            'ストラテジ系': {
                'システム戦略': ['システム戦略', 'システム企画'],
                '経営戦略': ['経営戦略マネジメント', '技術戦略マネジメント', 'ビジネスインダストリ'],
                '企業と法務': ['企業活動', '法務']
            },
            'マネジメント系': {
                'プロジェクトマネジメント': ['プロジェクトマネジメント'],
                'サービスマネジメント': ['サービスマネジメント', 'システム監査']
            },
            'テクノロジ系': {
                '基礎理論': ['基礎理論', 'アルゴリズムとプログラミング'],
                'コンピュータシステム': ['コンピュータ構成要素', 'システム構成要素', 'ソフトウェア', 'ハードウェア'],
                '技術要素': ['ユーザーインターフェース', '情報メディア', 'データベース', 'ネットワーク', 'セキュリティ'],
                '開発技術': ['システム開発技術', 'ソフトウェア開発管理技術']
            }
        }
    };

    const displayNameMap = {
        // 試験名
        "ITパスポート試験": "ITパスポートの塔",
        "基本情報技術者試験": "基本情報の神殿",
        "応用情報技術者試験": "応用情報の頂",
        // 分野
        "ストラテジ系": "ストラテジの間",
        "マネジメント系": "マネジメントの間",
        "テクノロジ系": "テクノロジの間",
        // 大分類
        "企業と法務": "企業と法務の層",
        "経営戦略": "経営戦略の層",
        "システム戦略": "システム戦略の層",
        "開発技術": "開発技術の層",
        "プロジェクトマネジメント": "プロジェクトマネジメントの層",
        "サービスマネジメント": "サービスマネジメントの層",
        "基礎理論": "基礎理論の層",
        "コンピュータシステム": "コンピュータシステムの層",
        "技術要素": "技術要素の層",
    };

    const monsterData = {
        // ストラテジ系
        '企業活動': { name: '企業活動の王 ゴブリンキング', image: '/images/ゴブリンキング.png', hp: 80 },
        '法務': { name: '法務の番人 ガーゴイル', image: '/images/ガーゴイル.png', hp: 100 },
        '経営戦略マネジメント': { name: '経営戦略の大魔王 アークデーモン', image: '/images/アークデーモン.png', hp: 120 },
        '技術戦略マネジメント': { name: '技術戦略の飛竜 ワイバーン', image: '/images/ワイバーン.png', hp: 110 },
        'ビジネスインダストリ': { name: 'ビジネスを喰らう魔狼 フェンリル', image: '/images/フェンリル.png', hp: 90 },
        'システム戦略': { name: 'システム戦略の巨兵 ゴーレム', image: '/images/ゴーレム.png', hp: 150 },
        'システム企画': { name: 'システム企画の死霊術師 ネクロマンサー', image: '/images/ネクロマンサー.png', hp: 130 },

        // マネジメント系
        'システム開発技術': { name: '開発技術の鬼 茨木童子', image: '/images/茨木童子.png', hp: 140 },
        'ソフトウェア開発管理技術': { name: 'ソフトウェア管理の君主 オークモナーク', image: '/images/オークモナーク.png', hp: 130 },
        'プロジェクトマネジメント': { name: 'プロジェクトを束ねる鬼 酒呑童子', image: '/images/酒呑童子.png', hp: 160 },
        'サービスマネジメント': { name: 'サービスの海蛇 シーサーペント', image: '/images/シーサーペント.png', hp: 140 },
        'システム監査': { name: 'システム監査の亡霊 ファントム', image: '/images/ファントム.png', hp: 150 },

        // テクノロジ系
        '基礎理論': { name: '基礎理論の鬼神 大嶽丸', image: '/images/大嶽丸.png', hp: 200 },
        'アルゴリズムとプログラミング': { name: 'アルゴリズムを操る不死王 リッチ', image: '/images/リッチ.png', hp: 180 },
        'コンピュータ構成要素': { name: 'コンピュータ構成の骸骨兵 スケルトン', image: '/images/スケルトン.png', hp: 160 },
        'システム構成要素': { name: 'システム構成の腐敗者 ゾンビ', image: '/images/ゾンビ.png', hp: 170 },
        'ソフトウェア': { name: 'ソフトウェアに潜む吸血鬼 ヴァンパイア', image: '/images/ヴァンパイア.png', hp: 150 },
        'ハードウェア': { name: 'ハードウェアを蝕む魔虫 ワーム', image: '/images/ワーム.png', hp: 160 },
        '情報デザイン': { name: '情報デザインの幻惑者 ジャックランタン', image: '/images/ジャックランタン.png', hp: 120 },
        '情報メディア': { name: '情報メディアを操る妖狐 九尾の狐', image: '/images/九尾の狐.png', hp: 130 },
        'データベース': { name: 'データベースに巣食う大蜘蛛 土蜘蛛', image: '/images/土蜘蛛.png', hp: 190 },
        'ネットワーク': { name: 'ネットワークの騎士 エルフナイト', image: '/images/エルフナイト.png', hp: 170 },
        'セキュリティ': { name: 'セキュリティの竜騎士 リザードロード', image: '/images/リザードロード.png', hp: 200 },
        'ユーザーインターフェース': { name: 'ユーザーインターフェースの全知 ヨグ=ソトース', image: '/images/ヨグ=ソトース.png', hp: 200},
    };

    const App = {
        state: {
            currentUser: null, quizzes: [], currentQuizIndex: 0,
            selectedCategory: '', selectedField: '', selectedSubfield: '', selectedDetail: '', selectedYear: null,
            gameMode: 'standard', timer: null, timeLeft: 60, statsChart: null,
            playerHP: 100, playerMaxHP: 100, monsterHP: 100, monsterMaxHP: 100,
            monsterHPCache: {},
            selectedDetailQuestionCount: 0,
            yearlySessionResults: [],
            sessionStartTime: null,
            lastAnswerWasCorrect: null, // 前回の回答が正しかったか (null, true, false, undefined)
            lastQuizId: null            // 前回回答した問題ID (null, または数値)
        },
        elements: {},
        init() {
            this.cacheElements();
            this.loadLottieAnimations();
            this.bindEvents();
            const savedUser = localStorage.getItem('currentUser');
            const savedPlayerHP = localStorage.getItem('currentPlayerHP');
            if (savedUser) {
                this.state.currentUser = JSON.parse(savedUser);
                // 1. 最大HP (max_hp) を currentUser から読み込む
                if (this.state.currentUser.max_hp) {
                    this.state.playerMaxHP = this.state.currentUser.max_hp;
                }

                // 2. 現在のHP (playerHP) を localStorage から別途読み込む
                // const savedPlayerHP = localStorage.getItem('currentPlayerHP');

                if (savedPlayerHP !== null) {
                    // 保存された「現在のHP」がある場合
                    this.state.playerHP = parseInt(savedPlayerHP, 10);
                    if (this.state.playerHP <= 0) {
                        this.state.playerHP = 0; // 0に固定
                    }
                } else {
                    // 何も保存されていない場合 (初回起動時など)
                    this.state.playerHP = this.state.playerMaxHP;
                }

                // 3. 安全装置 (もし現在のHPが最大HPを超えていたら丸める)
                if (this.state.playerHP > this.state.playerMaxHP) {
                    this.state.playerHP = this.state.playerMaxHP;
                }

                /*
                // 4. もし保存されたHPが0以下だったら、全回復させる
                if (this.state.playerHP <= 0) {
                    this.state.playerHP = this.state.playerMaxHP;
                }
                */

                this.state.selectedCategory = localStorage.getItem('selectedCategory') || '';
                this.state.selectedField = localStorage.getItem('selectedField') || '';
                this.state.selectedSubfield = localStorage.getItem('selectedSubfield') || '';
                const lastScreen = localStorage.getItem('lastActiveScreen');
                this.showScreen(lastScreen || 'status');
            } else {
                if (savedPlayerHP !== null) {
                    this.state.playerHP = parseInt(savedPlayerHP, 10);
                    if (this.state.playerHP <= 0) {
                        this.state.playerHP = 0; // 0に固定
                    }
                }

                this.showScreen('auth');
            }
        },

        /**
         * HPの割合(%)に応じて、バーの色を返す
         * @param {number} ratio - HPの割合 (0-100)
         * @returns {string} - CSSの色コード
         */
        getHPColor(ratio) {
            if (ratio > 50) return '#28a745'; // 50%超: 緑 (回復ボタンの色)
            if (ratio > 20) return '#ffc107'; // 20%超: 黄色
            return '#dc3545'; // 20%以下: 赤
        },

        cacheElements() {
            const D = document;
            this.elements = {
                authScreen: D.getElementById('auth-screen'), statusScreen: D.getElementById('status-screen'),
                categoryScreen: D.getElementById('category-screen'), fieldScreen: D.getElementById('field-screen'),
                subfieldScreen: D.getElementById('subfield-screen'), detailScreen: D.getElementById('detail-screen'),
                yearScreen: D.getElementById('year-screen'), gameScreen: D.getElementById('game-screen'),
                loginForm: D.getElementById('login-form'), registerForm: D.getElementById('register-form'),
                authMessage: D.getElementById('auth-message'), showRegisterLink: D.getElementById('show-register'),
                showLoginLink: D.getElementById('show-login'), loginBtn: D.getElementById('login-btn'),
                registerBtn: D.getElementById('register-btn'), logoutBtnStatus: D.getElementById('logout-btn-status'),
                usernameDisplayStatus: D.getElementById('username-display-status'), levelDisplayStatus: D.getElementById('level-display-status'),
                statsChartCanvas: D.getElementById('stats-chart-status'), goToCategoryBtn: D.getElementById('go-to-category-btn'),
                backToStatusBtn: D.getElementById('back-to-status-btn'), categoryList: D.getElementById('category-list'),
                fieldScreenTitle: D.getElementById('field-screen-title'), backToCategoryBtn: D.getElementById('back-to-category-btn'),
                fieldList: D.getElementById('field-list'), yearlyQuestionsBtn: D.getElementById('yearly-questions-btn'),
                subfieldScreenTitle: D.getElementById('subfield-screen-title'), backToFieldBtn: D.getElementById('back-to-field-btn'),
                subfieldList: D.getElementById('subfield-list'), detailScreenTitle: D.getElementById('detail-screen-title'),
                backToSubfieldBtn: D.getElementById('back-to-subfield-btn'), detailList: D.getElementById('detail-list'),
                backToCategoryFromYearBtn: D.getElementById('back-to-category-from-year-btn'), yearList: D.getElementById('year-list'),
                usernameDisplayGame: D.getElementById('username-display-game'),
                levelDisplayGame: D.getElementById('level-display-game'),
                xpDisplay: D.getElementById('xp-display'),
                xpToNext: D.getElementById('xp-to-next'),
                xpBarFill: D.getElementById('xp-bar-fill'),
                timerDisplay: D.getElementById('timer-display'),
                questionText: D.getElementById('question-text'), choicesContainer: D.getElementById('choices-container'),
                feedbackArea: D.getElementById('feedback-area'),
                // monsterDamageEffect: D.querySelector('.character-enemy .damage-effect'),
                // playerDamageEffect: D.querySelector('.character-player .damage-effect'),
                monsterDamageEffect: D.getElementById('attack-effect-lottie'), // ★★★ 変更 ★★★
                playerDamageEffect: D.getElementById('player-damage-lottie'),   // ★★★ 変更 ★★★
                playerHPBarFill: D.getElementById('player-hp-bar-fill'), playerHPText: D.getElementById('player-hp-text'),
                monsterHPBarFill: D.getElementById('monster-hp-bar-fill'), monsterHPText: D.getElementById('monster-hp-text'),
                // ★★★ ここから2行追加 ★★★
                playerHPContainer: D.querySelector('.character-player .hp-bar-container'),
                monsterHPContainer: D.querySelector('.character-enemy .hp-bar-container'),
                // ★★★ ここまで追加 ★★★
                xpBarFillStatus: D.getElementById('xp-bar-fill-status'),
                xpDisplayStatus: D.getElementById('xp-display-status'),
                xpToNextStatus: D.getElementById('xp-to-next-status'),

                //monsterImage: D.querySelector('.character-enemy .monster-image'),
                // ★★★ monsterImageのidセレクタを修正し、playerImageを追加 ★★★
                monsterImage: D.getElementById('monster-image'),
                playerImage: D.getElementById('player-image'),

                monsterName: D.getElementById('monster-name'),
                pauseBtn: D.getElementById('pause-btn'),
                pauseOverlay: D.getElementById('pause-overlay'),
                resumeBtn: D.getElementById('resume-btn'),
                quitBtn: D.getElementById('quit-btn'),
                // ★★★ ここに追加 ★★★
                // earnedTitlesList: D.getElementById('earned-titles-list'),
                
                // ★★★ ここが抜けていました ★★★
                loginUser: D.getElementById('login-user'),
                loginPass: D.getElementById('login-pass'),
                registerUser: D.getElementById('register-user'),
                registerPass: D.getElementById('register-pass'),
                toggleLoginPass: D.getElementById('toggle-login-pass'),
                toggleRegisterPass: D.getElementById('toggle-register-pass'),
                // ★★★ ここまで ★★★

                // ★★★ ここから追加 ★★★
                resultsScreen: D.getElementById('results-screen'),
                totalScoreDisplay: D.getElementById('total-score-display'),
                strategyScoreDisplay: D.getElementById('strategy-score-display'),
                managementScoreDisplay: D.getElementById('management-score-display'),
                technologyScoreDisplay: D.getElementById('technology-score-display'),
                // resultsHistoryList: D.getElementById('results-history-list'),
                backToStatusFromResultsBtn: D.getElementById('back-to-status-from-results-btn'),
                // ★★★ ここまで追加 ★★★

                // ★★★ ここから追加 ★★★
                historyScreen: D.getElementById('history-screen'),
                historyList: D.getElementById('history-list'),
                backToStatusFromHistoryBtn: D.getElementById('back-to-status-from-history-btn'),
                viewHistoryBtn: D.getElementById('view-history-btn'),
                // ★★★ ここまで追加 ★★★

                // ★★★ この1行を追加 ★★★
                unsureCheckbox: D.getElementById('unsure-checkbox'),

                commentaryArea: D.getElementById('commentary-area'),
                commentaryText: D.getElementById('commentary-text'),

                // ★★★ ここから3行追加 ★★★
                commentaryOverlay: D.getElementById('commentary-overlay'),
                modalCommentaryText: D.getElementById('modal-commentary-text'),
                nextQuestionBtn: D.getElementById('next-question-btn'),

                startUnsureQuizBtn: D.getElementById('start-unsure-quiz-btn'),

                titlesScreen: D.getElementById('titles-screen'),
                viewTitlesBtn: D.getElementById('view-titles-btn'),
                backToStatusFromTitlesBtn: D.getElementById('back-to-status-from-titles-btn'),
                titlesListLarge: D.getElementById('titles-list-large'),

                rewardNotificationArea: D.getElementById('reward-notification-area'),

                playerHPBarFillStatus: D.getElementById('player-hp-bar-fill-status'),
                playerHPTextStatus: D.getElementById('player-hp-text-status'),

                potionCountDisplay: D.getElementById('potion-count-display'),
                usePotionBtn: D.getElementById('use-potion-btn'),

                // // ★★★ ここから追加 ★★★
                // historyChoiceScreen: D.getElementById('history-choice-screen'),
                // unsureHistoryScreen: D.getElementById('unsure-history-screen'),
                // backToStatusFromChoiceBtn: D.getElementById('back-to-status-from-choice-btn'),
                // viewYearlyHistoryBtn: D.getElementById('view-yearly-history-btn'),
                // viewUnsureHistoryBtn: D.getElementById('view-unsure-history-btn'),
                // backToChoiceFromUnsureBtn: D.getElementById('back-to-choice-from-unsure-btn'),
                // unsureHistoryList: D.getElementById('unsure-history-list'),
                // // ★ 既存のhistory画面の戻るボタンIDを変更
                // backToChoiceFromHistoryBtn: D.getElementById('back-to-choice-from-history-btn'),
                // // ★★★ ここまで追加 ★★★
            };
        },
        // ★★★ この関数全体を置き換える ★★★
        loadLottieAnimations() {
            try {
                // lottie オブジェクトが存在するか確認
                if (typeof lottie === 'undefined') {
                    console.error("Lottieライブラリが読み込まれていません。");
                    return; // ライブラリがなければ処理を中断
                }

                // player-damage アニメーションの読み込み
                if (this.elements.playerDamageEffect) { // 要素が存在するか確認
                    this.elements.playerDamageAnim = lottie.loadAnimation({
                        container: this.elements.playerDamageEffect, 
                        renderer: 'svg',
                        loop: false,
                        autoplay: false,
                        path: '/lottie/player-damage.json' // 実際のパス
                    });
                    this.elements.playerDamageAnim.addEventListener('complete', () => {
                        this.elements.playerDamageEffect.style.opacity = '0';
                    });
                } else {
                    console.error("playerDamageEffect 要素が見つかりません。");
                }
                
                // monster-damage アニメーションの読み込み
                if (this.elements.monsterDamageEffect) { // 要素が存在するか確認
                    this.elements.monsterDamageAnim = lottie.loadAnimation({
                        container: this.elements.monsterDamageEffect, 
                        renderer: 'svg',
                        loop: false,
                        autoplay: false,
                        path: '/lottie/attack-effect.json' // 実際のパス
                    });
                    this.elements.monsterDamageAnim.addEventListener('complete', () => {
                        this.elements.monsterDamageEffect.style.opacity = '0';
                    });
                } else {
                    console.error("monsterDamageEffect 要素が見つかりません。");
                }

            } catch (err) {
                console.error("Lottieアニメーションの読み込み中にエラーが発生しました:", err);
                // ★重要★ エラーが起きても、以降の処理を停止させない
            }
        },
        // ★★★ 置き換えここまで ★★★
        bindEvents() {
            this.elements.showRegisterLink.addEventListener('click', () => this.toggleAuthForm(true));
            this.elements.showLoginLink.addEventListener('click', () => this.toggleAuthForm(false));
            this.elements.loginBtn.addEventListener('click', (e) => this.handleLogin(e));
            this.elements.registerBtn.addEventListener('click', (e) => this.handleRegister(e));
            // ★★★ ここから2つのイベントリスナーを追加 ★★★
            // ログイン画面のパスワード表示切り替え
            this.elements.toggleLoginPass.addEventListener('click', () => {
                const input = this.elements.loginPass;
                const icon = this.elements.toggleLoginPass;
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    input.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            });

            // 新規登録画面のパスワード表示切り替え
            this.elements.toggleRegisterPass.addEventListener('click', () => {
                const input = this.elements.registerPass;
                const icon = this.elements.toggleRegisterPass;
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    input.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            });
            // ★★★ ここまで追加 ★★★
            this.elements.logoutBtnStatus.addEventListener('click', () => this.handleLogout());
            this.elements.goToCategoryBtn.addEventListener('click', () => this.showScreen('category'));
            this.elements.backToStatusBtn.addEventListener('click', () => this.showScreen('status'));
            this.elements.backToCategoryBtn.addEventListener('click', () => this.showScreen('category'));
            this.elements.backToFieldBtn.addEventListener('click', () => this.showScreen('field'));
            this.elements.backToSubfieldBtn.addEventListener('click', () => this.showScreen('subfield'));
            this.elements.backToCategoryFromYearBtn.addEventListener('click', () => this.showScreen('field'));
            this.elements.quitBtn.addEventListener('click', () => this.quitGame());
            this.elements.resumeBtn.addEventListener('click', () => this.resumeGame());
            this.elements.pauseBtn.addEventListener('click', () => this.pauseGame());
            // ★★★ 結果画面の戻るボタンイベントを追加 ★★★
            this.elements.backToStatusFromResultsBtn.addEventListener('click', () => this.showScreen('status'));

            // ★★★ ここから追加 ★★★
            this.elements.backToStatusFromHistoryBtn.addEventListener('click', () => this.showScreen('status'));
            this.elements.viewHistoryBtn.addEventListener('click', () => this.loadAndDisplayHistory());
            // ★★★ ここまで追加 ★★★

            /*
            // ★ 既存の履歴ボタンの動作を変更 (選択画面へ)
            this.elements.viewHistoryBtn.addEventListener('click', () => this.showScreen('history-choice'));

            // ★ 既存の修練履歴画面の戻るボタンの動作を変更 (選択画面へ)
            // this.elements.backToStatusFromHistoryBtn.addEventListener('click', () => this.showScreen('status')); // ← この行を削除
            this.elements.backToChoiceFromHistoryBtn.addEventListener('click', () => this.showScreen('history-choice')); // ← この行を追加

            // ★★★ ここから新しいボタンのイベントを追加 ★★★
            // 選択画面 -> ステータス画面
            this.elements.backToStatusFromChoiceBtn.addEventListener('click', () => this.showScreen('status'));
            // 選択画面 -> 修練履歴画面
            this.elements.viewYearlyHistoryBtn.addEventListener('click', () => this.loadAndDisplayHistory()); // 既存の関数を呼ぶ
            // 選択画面 -> チェック履歴画面
            this.elements.viewUnsureHistoryBtn.addEventListener('click', () => this.loadAndDisplayUnsureHistory()); // 新しい関数を呼ぶ
            // チェック履歴画面 -> 選択画面
            this.elements.backToChoiceFromUnsureBtn.addEventListener('click', () => this.showScreen('history-choice'));
            // ★★★ ここまで追加 ★★★
            */

            this.elements.categoryList.addEventListener('click', (e) => {
                const button = e.target.closest('.category-btn');
                if (button) {
                    this.state.selectedCategory = button.dataset.category;
                    this.showScreen('field');
                }
            });
            this.elements.yearlyQuestionsBtn.addEventListener('click', () => this.showScreen('year'));
            this.elements.fieldList.addEventListener('click', (e) => {
                const button = e.target.closest('.field-btn');
                if (button && !button.disabled) {
                    this.state.selectedField = button.dataset.field;
                    this.showScreen('subfield');
                }
            });
            this.elements.subfieldList.addEventListener('click', (e) => {
                const button = e.target.closest('.subfield-btn');
                if (button && !button.disabled) {
                    this.state.selectedSubfield = button.dataset.subfield;
                    this.showScreen('detail');
                }
            });
            
            this.elements.detailList.addEventListener('click', (e) => {
                const button = e.target.closest('.detail-btn');
                if (button && !button.disabled) {
                    this.state.gameMode = 'standard';
                    this.state.selectedDetail = button.dataset.detail;
                    // 問題数をstateに保存
                    this.state.selectedDetailQuestionCount = parseInt(button.dataset.questionCount, 10);
                    this.startGame();
                }
            });

            this.elements.yearList.addEventListener('click', (e) => {
                const button = e.target.closest('.year-btn');
                if (button && !button.disabled) {
                    this.state.gameMode = 'yearly';
                    this.state.selectedYear = button.dataset.year;
                    this.startGame();
                }
            });

            if (this.elements.nextQuestionBtn) {
                this.elements.nextQuestionBtn.addEventListener('click', () => this.handleNextQuestionClick());
            }

            if (this.elements.startUnsureQuizBtn) {
                this.elements.startUnsureQuizBtn.addEventListener('click', () => {
                    this.state.gameMode = 'unsure'; // 新しいゲームモードを設定
                    this.startGame();
                });
            }

            if (this.elements.viewTitlesBtn) {
                this.elements.viewTitlesBtn.addEventListener('click', () => this.showScreen('titles'));
            }
            if (this.elements.backToStatusFromTitlesBtn) {
                this.elements.backToStatusFromTitlesBtn.addEventListener('click', () => this.showScreen('status'));
            }

            this.elements.usePotionBtn.addEventListener('click', () => this.handleUsePotion());
        },
        async api(endpoint, method = 'GET', body = null) {
            try {
                const options = { method, headers: { 'Content-Type': 'application/json' } };
                if (body) options.body = JSON.stringify(body);
                const response = await fetch(endpoint, options);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'API request failed');
                }
                const text = await response.text();
                return text ? JSON.parse(text) : {};
            } catch (err) {
                console.error(`API Error: ${err.message}`);
                this.showMessage(this.elements.authMessage, err.message);
                throw err;
            }
        },
        // ★★★ ここから関数を丸ごと追加 ★★★
        /**
         * 学習時間を計測し、サーバーに送信する
         */
        async logStudyTime() {
            if (!this.state.sessionStartTime) return; // 計測が開始されていなければ何もしない

            const endTime = Date.now();
            const durationInSeconds = Math.round((endTime - this.state.sessionStartTime) / 1000);
            
            // 0秒より大きい場合のみ記録
            if (durationInSeconds > 0) {
                try {
                    await this.api(`/api/users/${this.state.currentUser.id}/log-time`, 'POST', { 
                        duration: durationInSeconds 
                    });
                } catch (error) {
                    console.error("学習時間の記録に失敗しました:", error);
                }
            }
            this.state.sessionStartTime = null; // タイマーをリセット
        },
        // ★★★ ここまで追加 ★★★
        // ★★★ この関数が欠けている ★★★
        showMessage(element, message, isSuccess = false) {
            if (element) {
                element.textContent = message;
                element.className = isSuccess ? 'message-area success' : 'message-area';
            }
        },
        // ★★★ ここまで ★★★
        toggleAuthForm(showRegister) {
            this.elements.loginForm.classList.toggle('hidden', showRegister);
            this.elements.registerForm.classList.toggle('hidden', !showRegister);
            this.showMessage(this.elements.authMessage, '');
        },
        showScreen(screenName) {
            document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
            if (this.elements[`${screenName}Screen`]) {
                this.elements[`${screenName}Screen`].classList.add('active');
            }
            localStorage.setItem('lastActiveScreen', screenName);
            if (screenName === 'status') {
                this.updateUserInfo();
                this.loadStats();
                // this.loadAndDisplayTitles(); // ★★★ 称号表示関数を呼び出し ★★★
            }
            if (screenName === 'category') { this.loadAndDisplayCategoryProgress(); }
            if (screenName === 'field') { this.populateFields(); }
            if (screenName === 'subfield') { this.populateSubfields(); }
            if (screenName === 'detail') { this.populateDetails(); }
            if (screenName === 'year') { this.loadAndDisplayYearProgress(); }
            // ★★★ ここから追加 ★★★
            // if (screenName === 'history-choice') { /* 特に追加処理なし */ }
            // if (screenName === 'unsure-history') { /* loadAndDisplayUnsureHistoryで読み込む */ }
            // ★★★ ここまで追加 ★★★
            if (screenName === 'game') { this.updateUserInfo(); }

            else if (screenName === 'titles') {
                this.loadAndDisplayTitles(); // 称号画面を開くときに称号を読み込む
            }
        },
        async populateFields() {
            // ★★★ タイトル表示を修正 ★★★
            this.elements.fieldScreenTitle.textContent = displayNameMap[this.state.selectedCategory] || this.state.selectedCategory;
            const fields = Object.keys(quizHierarchy[this.state.selectedCategory] || {});
            this.elements.fieldList.innerHTML = '';
            for (const field of fields) {
                const countData = await this.api(`/api/quizzes/count?category=${encodeURIComponent(this.state.selectedCategory)}&field=${encodeURIComponent(field)}`);
                const buttonHtml = this.createProgressButton('field', field, countData.count);
                this.elements.fieldList.insertAdjacentHTML('beforeend', buttonHtml);
            }
            this.loadAndDisplayFieldProgress();
        },
        async populateSubfields() {
            // ★★★ タイトル表示を修正 ★★★
            const categoryName = displayNameMap[this.state.selectedCategory] || this.state.selectedCategory;
            const fieldName = displayNameMap[this.state.selectedField] || this.state.selectedField;
            this.elements.subfieldScreenTitle.textContent = `${categoryName} / ${fieldName}`;
            
            const subfields = Object.keys(quizHierarchy[this.state.selectedCategory]?.[this.state.selectedField] || {});
            this.elements.subfieldList.innerHTML = '';
            for (const subfield of subfields) {
                const countData = await this.api(`/api/quizzes/count?category=${encodeURIComponent(this.state.selectedCategory)}&field=${encodeURIComponent(this.state.selectedField)}&subfield=${encodeURIComponent(subfield)}`);
                const buttonHtml = this.createProgressButton('subfield', subfield, countData.count);
                this.elements.subfieldList.insertAdjacentHTML('beforeend', buttonHtml);
            }
            this.loadAndDisplaySubfieldProgress();
        },
        async populateDetails() {
            // ★★★ タイトル表示を修正 ★★★
            const fieldName = displayNameMap[this.state.selectedField] || this.state.selectedField;
            const subfieldName = displayNameMap[this.state.selectedSubfield] || this.state.selectedSubfield;
            this.elements.detailScreenTitle.textContent = `${fieldName} / ${subfieldName}`;

            const details = quizHierarchy[this.state.selectedCategory]?.[this.state.selectedField]?.[this.state.selectedSubfield] || [];
            this.elements.detailList.innerHTML = '';
            for (const detail of details) {
                const countData = await this.api(`/api/quizzes/count?category=${encodeURIComponent(this.state.selectedCategory)}&field=${encodeURIComponent(this.state.selectedField)}&subfield=${encodeURIComponent(this.state.selectedSubfield)}&detail=${encodeURIComponent(detail)}`);
                const monster = monsterData[detail] || { name: detail, image: 'https://via.placeholder.com/60' };
                const buttonHtml = this.createMonsterButton(detail, monster, countData.count);
                this.elements.detailList.insertAdjacentHTML('beforeend', buttonHtml);
            }
            this.loadAndDisplayDetailProgress();
        },
        createProgressButton(type, text, count = -1) {
            const className = `${type}-btn`;
            const textClassName = `${type}-btn-text`;
            const isDisabled = count === 0;
            
            // ★★★ 表示名をあだ名リストから取得 ★★★
            const displayName = displayNameMap[text] || text;
            const buttonText = displayName;

            const progressHtml = (type !== 'year') ? `
                <div class="progress-container">
                    <div class="progress-gauge"><div class="progress-gauge-fill"></div></div>
                    <span class="progress-percentage">0%</span>
                </div>` : '';

            return `
                <button class="${className}" data-${type}="${text}" ${isDisabled ? 'disabled' : ''}>
                    <span class="${textClassName}">${buttonText}</span>
                    ${progressHtml}
                </button>
            `;
        },
        createMonsterButton(detail, monster, count) {
            const isDisabled = count === 0;
            // モンスター名はdisplayNameMapを使わないので変更なし
            const buttonText = monster.name; 

            // ボタンに data-question-count 属性を追加
            return `
                <button class="detail-btn" data-detail="${detail}" data-question-count="${count}" ${isDisabled ? 'disabled' : ''}>
                    <div class="monster-info">
                        <img src="${monster.image}" alt="${monster.name}">
                        <span class="monster-name">${buttonText}</span>
                    </div>
                    <div class="progress-container">
                        <div class="progress-gauge"><div class="progress-gauge-fill"></div></div>
                        <span class="progress-percentage">0%</span>
                    </div>
                </button>
            `;
        },
        async handleRegister(e) {
            e.preventDefault();
            const username = this.elements.registerUser.value;
            const password = this.elements.registerPass.value;
            if (!username || !password) return this.showMessage(this.elements.authMessage, '全ての項目を入力してください');
            const result = await this.api('/api/register', 'POST', { username, password });
            if (result) {
                this.showMessage(this.elements.authMessage, '登録成功！ログインしてください。', true);
                this.toggleAuthForm(false);
            }
        },
        async handleLogin(e) {
            e.preventDefault();
            const username = this.elements.loginUser.value;
            const password = this.elements.loginPass.value;
            if (!username || !password) return this.showMessage(this.elements.authMessage, '全ての項目を入力してください');
            const result = await this.api('/api/login', 'POST', { username, password });
            if (result && result.user) {
                this.state.currentUser = result.user;
                localStorage.setItem('currentUser', JSON.stringify(result.user));
                this.showScreen('status');
            }
        },
        handleLogout() {
            if (this.state.statsChart) this.state.statsChart.destroy();
            clearInterval(this.state.timer);

            // 1. ログアウト前のHPと最大HPを一時的に保持する
            const currentHP = this.state.playerHP;
            const currentMaxHP = this.state.playerMaxHP;
            
            // 2. localStorage.clear() をやめて、HP以外を個別に削除する
            localStorage.removeItem('currentUser');
            // localStorage.removeItem('currentPlayerHP'); // ← HPは削除しない
            localStorage.removeItem('lastActiveScreen');
            localStorage.removeItem('selectedCategory');
            localStorage.removeItem('selectedField');
            localStorage.removeItem('selectedSubfield');

            // 3. stateを初期化する際、HPだけは保持した値を再設定する
            const initialState = {
                currentUser: null, quizzes: [], currentQuizIndex: 0,
                selectedCategory: '', selectedField: '', selectedSubfield: '', selectedDetail: '', selectedYear: null,
                gameMode: 'standard', timer: null, timeLeft: 60, statsChart: null,
                playerHP: currentHP, playerMaxHP: currentMaxHP, monsterHP: 100, monsterMaxHP: 100,
                monsterHPCache: {}
            };
            this.state = initialState; // stateを初期値に戻す
            // localStorage.clear();
            this.showScreen('auth');
            this.elements.loginForm.reset();
            this.elements.registerForm.reset();
            this.showMessage(this.elements.authMessage, '');
        },

        // ★★★ ここに新しい関数を追加 ★★★
        async loadAndDisplayTitles() {
            // ★★★ 表示先を titlesListLarge に変更 ★★★
            const targetList = this.elements.titlesListLarge;
            
            if (!targetList) return; // 要素がなければ中断

            targetList.innerHTML = '<p>称号はありません</p>'; // デフォルトテキスト
            try {
                const data = await this.api(`/api/users/${this.state.currentUser.id}/titles`);
                if (data.titles && data.titles.length > 0) {
                    targetList.innerHTML = ''; // クリア
                    data.titles.forEach(title => {
                        // 新しいアチーブメント項目の div を作成
                        const achievement = document.createElement('div');
                        achievement.className = 'achievement-item';
                        
                        // トロフィーアイコン (Font Awesome)
                        const icon = document.createElement('i');
                        icon.className = 'fas fa-trophy achievement-icon'; // トロフィーアイコン
                        
                        // 称号テキスト
                        const titleText = document.createElement('span');
                        titleText.className = 'achievement-title';
                        titleText.textContent = title;

                        // 組み立て
                        achievement.appendChild(icon);
                        achievement.appendChild(titleText);
                        targetList.appendChild(achievement);
                    });
                }
            } catch (error) {
                console.error("称号の読み込みに失敗:", error);
                targetList.innerHTML = '称号の読み込みに失敗しました。';
            }
        },

        async loadStats() {
            const stats = await this.api(`/api/users/${this.state.currentUser.id}/stats`);
            if (stats && Object.keys(stats).length > 0) this.renderStatsChart(stats);
        },
        renderStatsChart(stats) {
            const ctx = this.elements.statsChartCanvas.getContext('2d');
            if (this.state.statsChart) this.state.statsChart.destroy();
            const labels = ['ストラテジ系', 'マネジメント系', 'テクノロジ系'];
            const colorMap = {
                "ITパスポート試験": { background: 'rgba(255, 99, 132, 0.2)', border: 'rgba(255, 99, 132, 1)' },
                "基本情報技術者試験": { background: 'rgba(54, 162, 235, 0.2)', border: 'rgba(54, 162, 235, 1)' },
                "応用情報技術者試験": { background: 'rgba(255, 206, 86, 0.2)', border: 'rgba(255, 206, 86, 1)' }
            };
            const datasets = Object.keys(stats).map(categoryName => {
                const categoryData = stats[categoryName];
                const data = labels.map(label => {
                    const fieldData = categoryData[label];
                    return (fieldData && fieldData.total > 0) ? (fieldData.correct / fieldData.total) * 100 : 0;
                });
                return {
                    label: categoryName, data,
                    backgroundColor: colorMap[categoryName]?.background || 'rgba(201, 203, 207, 0.2)',
                    borderColor: colorMap[categoryName]?.border || 'rgba(201, 203, 207, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: colorMap[categoryName]?.border || 'rgba(201, 203, 207, 1)',
                };
            });
            this.state.statsChart = new Chart(ctx, {
                type: 'radar', data: { labels, datasets },
                options: {
                    responsive: true, maintainAspectRatio: true,
                    scales: { r: { angleLines: { display: true }, suggestedMin: 0, suggestedMax: 100, pointLabels: { font: { size: 12, weight: 'bold' } }, ticks: { display: false } } },
                    plugins: { legend: { display: true, position: 'top' } }
                }
            });
        },
        async loadAndDisplayCategoryProgress() {
            const progressData = await this.api(`/api/users/${this.state.currentUser.id}/progress-by-category`);
            if (progressData) {
                document.querySelectorAll('.category-btn').forEach(btn => {
                    if(btn.dataset.category) {
                        const category = btn.dataset.category;
                        const progress = progressData[category] || 0;
                        const fill = btn.querySelector('.progress-gauge-fill');
                        if (fill) fill.style.width = `${progress}%`;
                        const percent = btn.querySelector('.progress-percentage');
                        if (percent) percent.textContent = `${Math.round(progress)}%`;
                    }
                });
            }
        },
        async loadAndDisplayFieldProgress() {
            const progressData = await this.api(`/api/users/${this.state.currentUser.id}/progress-by-field?category=${encodeURIComponent(this.state.selectedCategory)}`);
            if (progressData) {
                document.querySelectorAll('.field-btn').forEach(btn => {
                    const field = btn.dataset.field;
                    const progress = progressData[field] || 0;
                    const fill = btn.querySelector('.progress-gauge-fill');
                    if (fill) fill.style.width = `${progress}%`;
                    const percent = btn.querySelector('.progress-percentage');
                    if (percent) percent.textContent = `${Math.round(progress)}%`;
                });
            }
        },
        async loadAndDisplaySubfieldProgress() {
            const progressData = await this.api(`/api/users/${this.state.currentUser.id}/progress-by-subfield?category=${encodeURIComponent(this.state.selectedCategory)}&field=${encodeURIComponent(this.state.selectedField)}`);
            if (progressData) {
                document.querySelectorAll('.subfield-btn').forEach(btn => {
                    const subfield = btn.dataset.subfield;
                    const progress = progressData[subfield] || 0;
                    const fill = btn.querySelector('.progress-gauge-fill');
                    if (fill) fill.style.width = `${progress}%`;
                    const percent = btn.querySelector('.progress-percentage');
                    if (percent) percent.textContent = `${Math.round(progress)}%`;
                });
            }
        },
        async loadAndDisplayDetailProgress() {
            const progressData = await this.api(`/api/users/${this.state.currentUser.id}/progress-by-detail?category=${encodeURIComponent(this.state.selectedCategory)}&field=${encodeURIComponent(this.state.selectedField)}&subfield=${encodeURIComponent(this.state.selectedSubfield)}`);
            if (progressData) {
                document.querySelectorAll('.detail-btn').forEach(btn => {
                    const detail = btn.dataset.detail;
                    const progress = progressData[detail] || 0;
                    const fill = btn.querySelector('.progress-gauge-fill');
                    if (fill) fill.style.width = `${progress}%`;
                    const percent = btn.querySelector('.progress-percentage');
                    if (percent) percent.textContent = `${Math.round(progress)}%`;
                });
            }
        },
        async loadAndDisplayYearProgress() { return; },
        async startGame() {
            if (this.state.playerHP <= 0) {
                // HPが0だったら、ゲームを開始しない
                this.showRewardNotification("HPが 0 のため、戦闘を開始できません。", 'error');

                // 強制的にステータス画面に戻す
                this.showScreen('status');

                // startGame処理をここで中断
                return;
            }

            // 修練の間開始時に結果をリセット
            if (this.state.gameMode === 'yearly') {
                this.state.yearlySessionResults = [];
            }

            // 背景クラスを一旦リセット
            this.elements.gameScreen.classList.remove('bg-itp', 'bg-fe', 'bg-ap');

            // 選択された試験に応じて背景クラスを設定
            switch (this.state.selectedCategory) {
                case 'ITパスポート試験':
                    this.elements.gameScreen.classList.add('bg-itp');
                    break;
                case '基本情報技術者試験':
                    this.elements.gameScreen.classList.add('bg-fe');
                    break;
                case '応用情報技術者試験':
                    this.elements.gameScreen.classList.add('bg-ap');
                    break;
            }

            if (this.state.gameMode === 'standard') {
                const monster = monsterData[this.state.selectedDetail];
                if (monster) {
                    this.elements.monsterImage.src = monster.image;
                    this.elements.monsterName.textContent = monster.name;

                    // HP計算式
                    const calculatedHp = this.state.selectedDetailQuestionCount * 10;

                    this.state.monsterMaxHP = calculatedHp > 0 ? calculatedHp : 10; // HPが0にならないように最低10を保証

                    if (this.state.monsterHPCache[this.state.selectedDetail] !== undefined) {
                        this.state.monsterHP = this.state.monsterHPCache[this.state.selectedDetail];
                    } else {
                        this.state.monsterHP = this.state.monsterMaxHP;
                    }
                }
            } else { // 'yearly'または'unsure'モード
                this.elements.monsterImage.src = '/images/黒い男.png';
                this.elements.monsterName.textContent = '黒い男';
                this.state.monsterHP = 1000;
                this.state.monsterMaxHP = 1000;
            }

            this.elements.playerImage.classList.add('is-breathing');
            this.elements.monsterImage.classList.add('is-breathing');

            // HPバーの表示切り替え
            if (this.state.gameMode === 'yearly'|| this.state.gameMode === 'unsure') {
                // 修練の間モードではHPバーを隠す
                this.elements.playerHPContainer.style.display = 'none';
                this.elements.monsterHPContainer.style.display = 'block';
            } else {
                // 通常モードではHPバーを表示する
                this.elements.playerHPContainer.style.display = 'block';
                this.elements.monsterHPContainer.style.display = 'block';
            }

            this.showScreen('game');
            this.state.sessionStartTime = Date.now();
            // this.state.playerHP = this.state.playerMaxHP;
            this.updateHPDisplay();

            let url;
            const userId = this.state.currentUser.id;
            if (this.state.gameMode === 'yearly') {
                url = `/api/quizzes-by-year?year=${this.state.selectedYear}&category=${encodeURIComponent(this.state.selectedCategory)}`;
            } else if (this.state.gameMode === 'unsure') {
                url = `/api/quizzes/unsure/${userId}`;
            } else {
                url = `/api/quizzes?category=${encodeURIComponent(this.state.selectedCategory)}&field=${encodeURIComponent(this.state.selectedField)}&subfield=${encodeURIComponent(this.state.selectedSubfield)}&detail=${encodeURIComponent(this.state.selectedDetail)}&userId=${userId}`;
            }

            try {
                const result = await this.api(url);
                if (result && result.quizzes && result.quizzes.length > 0) {
                    this.state.quizzes = result.quizzes.sort(() => Math.random() - 0.5);
                    this.state.currentQuizIndex = 0;
                    this.showNextQuestion();
                } else {
                    // 問題が0件だった場合
                    if (this.state.gameMode === 'standard') {
                        this.elements.questionText.textContent = 'このステージをクリアしました！おめでとうございます！';
                    } else if (this.state.gameMode === 'unsure') {
                        this.elements.questionText.textContent = 'チェックした問題はまだありません。';
                    } else { // 'yearly'の場合
                        this.elements.questionText.textContent = 'このステージは現在準備中です。';
                    }
                    this.elements.choicesContainer.innerHTML = '';
                    clearInterval(this.state.timer);
                    this.logStudyTime();
                }
            } catch (err) {
                console.error("クイズの取得または表示でエラー:", err);
                if (this.elements.questionText) this.elements.questionText.textContent = '問題の読み込みに失敗しました。';
                if (this.elements.choicesContainer) this.elements.choicesContainer.innerHTML = '';
                clearInterval(this.state.timer);
                this.logStudyTime();
            }
        },
        updateUserInfo() {
            if (!this.state.currentUser) return;
            const user = this.state.currentUser;
            const xpNeeded = user.level * 20;
            const xpPercent = (user.xp / xpNeeded) * 100;

            // ステータス画面のHP表示を更新
            // (playerMaxHP は 100、playerHP は 80 などが入る)
            const playerHPRatio = Math.max(0, this.state.playerHP / this.state.playerMaxHP) * 100;
            const hpColor = this.getHPColor(playerHPRatio); // 1. 色を取得

            if (this.elements.playerHPBarFillStatus) {
                this.elements.playerHPBarFillStatus.style.width = `${playerHPRatio}%`;
                this.elements.playerHPBarFillStatus.style.backgroundColor = hpColor; // 2. 色を適用
            }
            if (this.elements.playerHPTextStatus) {
                this.elements.playerHPTextStatus.textContent = `${this.state.playerHP} / ${this.state.playerMaxHP}`;
            }

            this.elements.usernameDisplayStatus.textContent = user.username;
            this.elements.levelDisplayStatus.textContent = `Lv: ${user.level}`;
            this.elements.xpDisplayStatus.textContent = user.xp;
            this.elements.xpToNextStatus.textContent = xpNeeded;
            this.elements.xpBarFillStatus.style.width = `${xpPercent}%`;
            this.elements.usernameDisplayGame.textContent = user.username;
            this.elements.levelDisplayGame.textContent = user.level;
            this.elements.xpDisplay.textContent = user.xp;
            this.elements.xpToNext.textContent = xpNeeded;
            this.elements.xpBarFill.style.width = `${xpPercent}%`;

            if (this.elements.potionCountDisplay) {
                this.elements.potionCountDisplay.textContent = user.potion_count;
            }
        },
        showNextQuestion() {
            if (this.elements.commentaryOverlay) this.elements.commentaryOverlay.classList.add('hidden');

            // ゲーム終了条件を修正
            if (this.state.currentQuizIndex >= this.state.quizzes.length || this.state.playerHP <= 0) {

                // 「チェックから出題」モードの場合
                if (this.state.gameMode === 'unsure') {
                    // プレイヤーHPが0になった場合 (通常ありえないが安全のため)
                    if (this.state.playerHP <= 0) {
                        let endMessage = 'ゲームオーバー...';
                        if (this.elements.questionText) this.elements.questionText.textContent = endMessage;
                        // ... (省略) ...
                        return;
                    }
                    
                    // 全問解き終わった場合 (HPは0でない)
                    // startGame を再度呼び出して、最新のチェックリストで再スタート（ループ）する
                    console.log("「チェックから出題」の1周が完了。リストを更新して再スタートします。");
                    this.logStudyTime(); // 1周分の学習時間を記録

                    if (this.elements.feedbackArea) {
                        this.elements.feedbackArea.innerHTML = '';
                        this.elements.feedbackArea.className = 'feedback-area';
                        this.elements.feedbackArea.style.opacity = '0';
                        this.elements.feedbackArea.style.position = '';
                        this.elements.feedbackArea.style.transform = '';
                    }

                    this.startGame(); // これがAPIを叩き直し、最新のリストを取得する
                    return; // この後の処理は startGame に任せる
                }

                // 修練の間モードで全問解き終わった場合
                if (this.state.gameMode === 'yearly' && this.state.currentQuizIndex >= this.state.quizzes.length) {
                    this.showYearlyResults();
                    return;
                }

                let endMessage = 'このステージをクリアしました！おめでとうございます！';
                if (this.state.playerHP <= 0) {
                    endMessage = 'ゲームオーバー...';
                } else if (this.state.monsterHP <= 0 && this.state.gameMode === 'standard') {
                    endMessage = 'モンスターを倒した！クリアおめでとう！';
                }

                this.logStudyTime();

                /*
                this.elements.feedbackArea.textContent = endMessage;
                this.elements.questionText.textContent = 'クイズ終了';
                this.elements.choicesContainer.innerHTML = '';
                */

                // 中央ポップアップ (feedbackArea) は使わない
                if (this.elements.feedbackArea) {
                    this.elements.feedbackArea.innerHTML = '';
                    this.elements.feedbackArea.className = 'feedback-area';
                    this.elements.feedbackArea.style.opacity = '0';
                    this.elements.feedbackArea.style.position = '';
                    this.elements.feedbackArea.style.transform = '';
                }
                
                // 問題文エリア (questionText) に終了メッセージを表示する
                if (this.elements.questionText) this.elements.questionText.textContent = endMessage; 
                
                if (this.elements.choicesContainer) this.elements.choicesContainer.innerHTML = '';
                if (this.elements.commentaryArea) this.elements.commentaryArea.classList.add('hidden');

                clearInterval(this.state.timer);
                return;
            }
            /*
            this.elements.commentaryArea.classList.add('hidden'); // ★★★ 解説を隠す ★★★
            this.elements.unsureCheckbox.checked = false; // ★★★ この1行を追加 ★★★
            const quiz = this.state.quizzes[this.state.currentQuizIndex];
            this.elements.questionText.innerHTML = quiz.question;
            this.elements.choicesContainer.innerHTML = '';
            */
            // 先に quiz オブジェクトを取得し、問題文を表示する
            const quiz = this.state.quizzes[this.state.currentQuizIndex];
            this.elements.questionText.innerHTML = quiz.question;

            /*
            this.elements.commentaryArea.classList.add('hidden');
            this.elements.choicesContainer.innerHTML = '';
            */
            
            if (this.elements.commentaryArea) {
                this.elements.commentaryArea.classList.add('hidden');
            }
            if (this.elements.choicesContainer) {
                this.elements.choicesContainer.innerHTML = '';
            }

            if (this.elements.unsureCheckbox) {
                if (this.state.gameMode === 'unsure') {
                    // 「チェックから出題」モードの時は、必ずチェックされた状態から始める
                    this.elements.unsureCheckbox.checked = true;
                } else {
                    // 通常モードの時は、チェックをリセット
                    this.elements.unsureCheckbox.checked = false;
                }
            }

            /*
            this.elements.feedbackArea.innerHTML = '';
            this.elements.feedbackArea.className = 'feedback-area';
            */
            // ★★★ ここから修正 (if で囲む) ★★★
            if (this.elements.feedbackArea) {
                this.elements.feedbackArea.innerHTML = '';
                this.elements.feedbackArea.className = 'feedback-area';
                // 念のため、JSで変更した可能性のあるスタイルもリセットします
                this.elements.feedbackArea.style.opacity = '0';
                this.elements.feedbackArea.style.position = '';
                this.elements.feedbackArea.style.transform = '';
            }
            // ★★★ ここまで修正 ★★★

            const choices = quiz.choices.sort(() => Math.random() - 0.5);
            choices.forEach(choice => {
                const btn = document.createElement('button');
                btn.textContent = choice;
                btn.className = 'choice-btn';
                btn.onclick = () => this.checkAnswer(choice, quiz, btn);
                /*
                this.elements.choicesContainer.appendChild(btn);
                */
                // ★★★ ここにも null チェックを追加 ★★★
                if (this.elements.choicesContainer) {
                    this.elements.choicesContainer.appendChild(btn);
                }
            });

            // ★★★ startTimerに関数のtime_limitを渡すように変更 ★★★
            this.startTimer(quiz.time_limit || 60);
        },
        // ★★★ startTimerが時間を受け取るように変更 ★★★
        startTimer(limit) {
            this.state.timeLeft = limit; // 固定値ではなく、受け取った値を使う
            this.elements.timerDisplay.textContent = this.state.timeLeft;
            clearInterval(this.state.timer);
            this.state.timer = setInterval(() => {
                this.state.timeLeft--;
                this.elements.timerDisplay.textContent = this.state.timeLeft;
                if (this.state.timeLeft <= 0) this.handleTimeout();
            }, 1000);
        },
        handleTimeout() {
            clearInterval(this.state.timer);
            const quiz = this.state.quizzes[this.state.currentQuizIndex];
            this.checkAnswer(null, quiz, null);
        },
        updateHPDisplay() {
            const playerHPRatio = Math.max(0, this.state.playerHP / this.state.playerMaxHP) * 100;

            const hpColor = this.getHPColor(playerHPRatio); // 1. 色を取得
            this.elements.playerHPBarFill.style.width = `${playerHPRatio}%`;
            this.elements.playerHPBarFill.style.backgroundColor = hpColor; // 2. 色を適用

            this.elements.playerHPText.textContent = `${this.state.playerHP} / ${this.state.playerMaxHP}`;
            const monsterHPRatio = Math.max(0, this.state.monsterHP / this.state.monsterMaxHP) * 100;
            this.elements.monsterHPBarFill.style.width = `${monsterHPRatio}%`;
            this.elements.monsterHPText.textContent = `${this.state.monsterHP} / ${this.state.monsterMaxHP}`;
        },
        async checkAnswer(selected, quiz, btn) {
            try {
                clearInterval(this.state.timer);
                this.elements.choicesContainer.querySelectorAll('.choice-btn').forEach(b => b.disabled = true);
                const isCorrect = selected === quiz.answer;

                this.state.lastQuizId = quiz.id;
                if (this.state.gameMode === 'unsure') {
                    this.state.lastAnswerWasCorrect = undefined; 
                } else {
                    this.state.lastAnswerWasCorrect = isCorrect;
                }

                // 修練の間の結果を記録
                if (this.state.gameMode === 'yearly') {
                    this.state.yearlySessionResults.push({ quiz: quiz, isCorrect: isCorrect });
                }

                let levelUpOccurred = false;
                let feedbackHTML = '';
                let titleResult = null;

                // 'unsure' モードの時は、ステータス計算とAPI通信をスキップ
                if (this.state.gameMode !== 'unsure') {

                    if (isCorrect) {
                        this.state.currentUser.xp += 10;
                        this.state.monsterHP -= 10;
                        if (this.state.gameMode === 'standard') {
                            this.state.monsterHPCache[this.state.selectedDetail] = this.state.monsterHP;
                        }

                        /*
                        if (this.state.monsterHP <= 0 && this.state.gameMode === 'standard') {
                            titleResult = await this.api(`/api/users/${this.state.currentUser.id}/defeat`, 'POST', { detail_name: this.state.selectedDetail });
                        }
                        */

                        const xpNeeded = this.state.currentUser.level * 20;
                        if (this.state.currentUser.xp >= xpNeeded) {
                            levelUpOccurred = true;
                            this.state.currentUser.level++;
                            this.state.currentUser.xp -= xpNeeded;
                            this.state.playerMaxHP += 10;
                            this.state.playerHP = this.state.playerMaxHP;
                        }
                    } else {
                        // 'yearly'(修練の間)モードではHPを減らさない
                        if (this.state.gameMode !== 'yearly') {
                            this.state.playerHP -= 10;
                        }

                        if (this.state.gameMode === 'standard') {
                            this.state.quizzes.push(quiz);
                        }
                    }
                }
                // 変動した「現在のHP」を localStorage に保存する
                localStorage.setItem('currentPlayerHP', this.state.playerHP);

                this.updateHPDisplay();
                this.updateUserInfo();

                // エフェクト表示
                if (isCorrect) {
                    btn.classList.add('correct');
                    // this.elements.monsterDamageEffect.classList.add('show');
                    // setTimeout(() => this.elements.monsterDamageEffect.classList.remove('show'), 500);
                    // Lottie再生処理
                    if (this.elements.monsterDamageAnim) {
                        this.elements.monsterDamageEffect.style.opacity = '1'; // 表示
                        this.elements.monsterDamageAnim.goToAndPlay(0, true);
                    }
                } else {
                    if (btn) btn.classList.add('incorrect');
                    // this.elements.playerDamageEffect.classList.add('show');
                    // setTimeout(() => this.elements.playerDamageEffect.classList.remove('show'), 500);
                    // Lottie再生処理
                    if (this.elements.playerDamageAnim) {
                        this.elements.playerDamageEffect.style.opacity = '1'; // 表示
                        this.elements.playerDamageAnim.goToAndPlay(0, true);
                    }
                    this.elements.choicesContainer.querySelectorAll('.choice-btn').forEach(b => {
                        if (b.textContent === quiz.answer) b.classList.add('correct');
                    });
                }
        
                // フィードバックメッセージの構築と表示
                feedbackHTML = isCorrect ? '正解' : '不正解';
                /*
                if (levelUpOccurred) {
                    feedbackHTML += `<br><small style="font-size: 0.4em; font-weight: normal;">レベルアップ！HPが全回復！</small>`;
                }
                */
                /* if (titleResult && titleResult.new_title_unlocked) {
                    feedbackHTML += `<br><small style="font-size: 0.4em; font-weight: normal;">称号【${titleResult.new_title_unlocked}】を獲得！</small>`;
                } */
                if (this.elements.feedbackArea) {
                    this.elements.feedbackArea.innerHTML = feedbackHTML;
                    this.elements.feedbackArea.className = isCorrect ? 'feedback-area correct' : 'feedback-area incorrect';
                    this.elements.feedbackArea.style.position = 'absolute';
                    this.elements.feedbackArea.style.opacity = '1';
                    this.elements.feedbackArea.style.transform = 'translate(-50%, -50%) scale(1.1)';
                    this.elements.feedbackArea.style.pointerEvents = 'none';
                }

                // 解説モーダル表示
                setTimeout(() => {
                    if (this.elements.modalCommentaryText) {
                        this.elements.modalCommentaryText.innerHTML = quiz.commentary || '解説はありません。';
                    }
                    if (this.elements.commentaryOverlay) {
                        this.elements.commentaryOverlay.classList.remove('hidden');
                    }
                }, 1500);

                /*
                // await this.api(`/api/users/${this.state.currentUser.id}/answer`, 'POST', { quiz_id: quiz.id, is_correct: isCorrect });
                const isUnsure = this.elements.unsureCheckbox ? this.elements.unsureCheckbox.checked : false;
                */
                /*
                // 'unsure' モードの場合、チェックボックスの状態は送信しない (undefined を送る)
                if (this.state.gameMode === 'unsure') {
                    isUnsure = undefined;
                }
                */
                /*
                let isCorrectForAPI = isCorrect;
                if (this.state.gameMode === 'unsure') {
                    isCorrectForAPI = undefined;
                }
                */
                /*
                await this.api(`/api/users/${this.state.currentUser.id}/answer`, 'POST', { 
                    quiz_id: quiz.id,
                    is_correct: isCorrect,
                    is_unsure: isUnsure // 'unsure' モードの時は undefined が送られる
                });
                */

                // 'unsure' モードの時は、API通信をスキップ
                if (this.state.gameMode !== 'unsure') {

                    const progressResult = await this.api(`/api/users/${this.state.currentUser.id}/progress`, 'PATCH', { 
                        level: this.state.currentUser.level,
                        xp: this.state.currentUser.xp,
                        max_hp: this.state.playerMaxHP
                    });

                    // レベルアップ通知
                    if (levelUpOccurred) {
                        // 0.5秒遅らせて表示 (「正解」ポップアップとタイミングをずらす)
                        setTimeout(() => {
                            this.showRewardNotification('レベルアップ！ HPが全回復 & ポーション +1 GET！', 'level-up');
                        }, 500);
                    }

                    if (progressResult && progressResult.user) {
                        this.state.currentUser = progressResult.user;
                        localStorage.setItem('currentUser', JSON.stringify(this.state.currentUser));

                        // サーバーからの情報で再度UIを更新
                        this.updateUserInfo();
                    }

                    // 称号獲得通知
                    if (isCorrect && this.state.monsterHP <= 0 && this.state.gameMode === 'standard') {
                        try {
                            titleResult = await this.api(`/api/users/${this.state.currentUser.id}/defeat`, 'POST', { detail_name: this.state.selectedDetail });
                            if (titleResult && titleResult.new_title_unlocked) {
                                if (titleResult.user) {
                                    this.state.currentUser = titleResult.user;
                                    localStorage.setItem('currentUser', JSON.stringify(this.state.currentUser));
                                    this.updateUserInfo(); // ポーション数の表示を即時更新
                                }
                                setTimeout(() => {
                                    const potionMsg = titleResult.user ? ' ポーションを10個獲得！' : '';
                                    this.showRewardNotification(`称号【${titleResult.new_title_unlocked}】を獲得！${potionMsg}`, 'title-unlocked');
                                }, 1000);
                            }
                        } catch (titleError) { console.error("称号獲得APIエラー:", titleError); }
                    }
                }

            } catch (error) {
                console.error("checkAnswerでエラーが発生しました:", error);

                this.showRewardNotification(`エラー: ${error.message}`, 'error');

                setTimeout(() => {
                    if (this.elements.modalCommentaryText) {
                        this.elements.modalCommentaryText.textContent = 'エラーが発生しました。次の問題に進んでください。';
                    }
                    if (this.elements.commentaryOverlay) {
                        this.elements.commentaryOverlay.classList.remove('hidden');
                    }
                }, 1500);

            } finally {
                // 6. 最後に、必ず次の問題へ進む処理を予約する
                // this.state.currentQuizIndex++;
                /* setTimeout(() => {
                    this.showNextQuestion();
                }, 2500);
                */
            }
        },

        // ★★★ ここに新しい関数を追加 ★★★
        async showYearlyResults() {
            this.logStudyTime(); // ★★★ この行を追加 ★★★
            this.showScreen('results');
            const results = this.state.yearlySessionResults;
            const totalQuestions = results.length;
            const totalCorrect = results.filter(r => r.isCorrect).length;
            const totalScorePercent = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
            
            this.elements.totalScoreDisplay.querySelector('p span').textContent = totalScorePercent;
            
            const fieldCounts = {
                'ストラテジ系': { correct: 0, total: 0 },
                'マネジメント系': { correct: 0, total: 0 },
                'テクノロジ系': { correct: 0, total: 0 }
            };
            results.forEach(result => {
                const field = result.quiz.field;
                if (fieldCounts[field]) {
                    fieldCounts[field].total++;
                    if (result.isCorrect) fieldCounts[field].correct++;
                }
            });
            
            const strategyPercent = fieldCounts['ストラテジ系'].total > 0 ? Math.round((fieldCounts['ストラテジ系'].correct / fieldCounts['ストラテジ系'].total) * 100) : 0;
            const managementPercent = fieldCounts['マネジメント系'].total > 0 ? Math.round((fieldCounts['マネジメント系'].correct / fieldCounts['マネジメント系'].total) * 100) : 0;
            const technologyPercent = fieldCounts['テクノロジ系'].total > 0 ? Math.round((fieldCounts['テクノロジ系'].correct / fieldCounts['テクノロジ系'].total) * 100) : 0;
            
            this.elements.strategyScoreDisplay.querySelector('p').textContent = `${strategyPercent}%`;
            this.elements.managementScoreDisplay.querySelector('p').textContent = `${managementPercent}%`;
            this.elements.technologyScoreDisplay.querySelector('p').textContent = `${technologyPercent}%`;
            
            // サーバーに結果を保存
            await this.api(`/api/users/${this.state.currentUser.id}/save-yearly-result`, 'POST', {
                category: this.state.selectedCategory,
                year: this.state.selectedYear,
                totalScorePercent, strategyPercent, managementPercent, technologyPercent
            });
        },
        
        async loadAndDisplayHistory() {
            this.showScreen('history');
            this.elements.historyList.innerHTML = '<p>履歴を読み込んでいます...</p>';
            try {
                const data = await this.api(`/api/users/${this.state.currentUser.id}/yearly-results`);
                if (data.results && data.results.length > 0) {
                    this.elements.historyList.innerHTML = '';
                    data.results.forEach(res => {
                        const date = new Date(res.completed_at).toLocaleString('ja-JP');
                        const card = `
                            <div class="history-card">
                                <div class="history-card-header">
                                    <h4>${displayNameMap[res.category] || res.category} (${res.year}年)</h4>
                                    <span class="date">${date}</span>
                                </div>
                                <div class="history-card-body">
                                    <div class="score-card-small"><h5>総合</h5><p>${res.total_score_percent}%</p></div>
                                    <div class="score-card-small"><h5>ストラテジ</h5><p>${res.strategy_percent}%</p></div>
                                    <div class="score-card-small"><h5>マネジメント</h5><p>${res.management_percent}%</p></div>
                                    <div class="score-card-small"><h5>テクノロジ</h5><p>${res.technology_percent}%</p></div>
                                </div>
                            </div>`;
                        this.elements.historyList.insertAdjacentHTML('beforeend', card);
                    });
                } else {
                    this.elements.historyList.innerHTML = '<p>修練の履歴はありません。</p>';
                }
            } catch(e) {
                this.elements.historyList.innerHTML = '<p>履歴の読み込みに失敗しました。</p>';
            }
        },

        /*
        // ★★★ この関数を丸ごと追加 ★★★
        async loadAndDisplayUnsureHistory() {
            this.showScreen('unsure-history');
            this.elements.unsureHistoryList.innerHTML = '<p>チェック履歴を読み込んでいます...</p>';
            try {
                // 新しいAPIを呼び出す
                const data = await this.api(`/api/users/${this.state.currentUser.id}/unsure-answers`);
                
                if (data.quizzes && data.quizzes.length > 0) {
                    this.elements.unsureHistoryList.innerHTML = ''; // 一旦クリア
                    data.quizzes.forEach(quiz => {
                        // 各問題を表示するHTML要素を作成
                        const item = document.createElement('div');
                        item.className = 'unsure-history-item';
                        // 試験名、分野などを表示
                        item.innerHTML = `
                            <span>${displayNameMap[quiz.category] || quiz.category} / ${displayNameMap[quiz.field] || quiz.field} / ${displayNameMap[quiz.subfield] || quiz.subfield} / ${displayNameMap[quiz.detail] || quiz.detail} (${quiz.year || '----'}年)</span>
                            ${quiz.question} 
                        `;
                        // ★★★ クリックイベントを追加 (任意) ★★★
                        item.addEventListener('click', () => {
                            // クリックしたら解説を表示するなどの動作を追加できる
                            alert(`正解: ${quiz.answer}\n解説: ${quiz.commentary || '解説はありません'}`);
                        });
                        this.elements.unsureHistoryList.appendChild(item);
                    });
                } else {
                    this.elements.unsureHistoryList.innerHTML = '<p>チェックした問題はありません。</p>';
                }
            } catch (e) {
                console.error("チェック履歴の読み込みエラー:", e);
                this.elements.unsureHistoryList.innerHTML = '<p>チェック履歴の読み込みに失敗しました。</p>';
            }
        },
        // ★★★ ここまで追加 ★★★
        */

        pauseGame() {
            clearInterval(this.state.timer);
            this.elements.pauseOverlay.classList.remove('hidden');
        },
        resumeGame() {
            this.elements.pauseOverlay.classList.add('hidden');
            this.resumeTimer();
        },
        quitGame() {
            clearInterval(this.state.timer);
            this.elements.pauseOverlay.classList.add('hidden');
            this.logStudyTime();

            // 辞めた時点での「現在のHP」を保存する
            localStorage.setItem('currentPlayerHP', this.state.playerHP);

            if (this.state.gameMode === 'yearly') {
                this.showScreen('year');
            } else if (this.state.gameMode === 'unsure') {
                this.showScreen('status'); // ステータス画面に戻る
            } else {
                this.showScreen('detail'); // モンスター選択画面に戻る
            }
        },

        // 解説モーダルの「次の問題へ」ボタンが押された時の処理
        async handleNextQuestionClick() {
            // モーダルを隠す
            if (this.elements.commentaryOverlay) {
                this.elements.commentaryOverlay.classList.add('hidden');
            }

            try {
                // 1. stateから前回の回答情報を取得
                const quizId = this.state.lastQuizId;
                const isCorrect = this.state.lastAnswerWasCorrect;

                // 2. 「今」のチェックボックスの状態を取得
                const isUnsure = this.elements.unsureCheckbox ? this.elements.unsureCheckbox.checked : false;

                // 3. 回答履歴APIを呼ぶ（修練の間'yearly'以外の時のみ保存する）
                if (this.state.gameMode !== 'yearly') {
                    await this.api(`/api/users/${this.state.currentUser.id}/answer`, 'POST', {
                        quiz_id: quizId,
                        is_correct: isCorrect, // 'unsure' モードの時は undefined
                        is_unsure: isUnsure // 「今」のチェック状態
                    });
                } else {
                    console.log("修練の間モードのため、個別の進捗保存をスキップしました。");
                }

                // 4. state をリセット
                this.state.lastQuizId = null;
                this.state.lastAnswerWasCorrect = null;

            } catch (error) {
                console.error("handleNextQuestionClick で回答履歴の保存に失敗:", error);
                // ★ ここでエラーが出た場合はトーストで通知
                this.showRewardNotification(`エラー: ${error.message}`, 'error');
            }

            // 問題インデックスを進める
            this.state.currentQuizIndex++;
            // 次の問題を表示
            this.showNextQuestion();
        },

        /**
         * 報酬通知（レベルアップ、称号）を表示する
         * @param {string} message - 表示するメッセージ
         * @param {string} type - 'level-up' または 'title-unlocked'
         */
        showRewardNotification(message, type = 'title-unlocked') {
            if (!this.elements.rewardNotificationArea) return;

            const toast = document.createElement('div');
            toast.className = `reward-toast ${type}`;

            // Font Awesome のアイコンをタイプに応じて設定
            let iconClass = 'fa-star'; // default
            if (type === 'level-up') iconClass = 'fa-arrow-up';
            else if (type === 'error') iconClass = 'fa-exclamation-triangle';

            toast.innerHTML = `<i class="fas ${iconClass}"></i> ${message}`;

            this.elements.rewardNotificationArea.appendChild(toast);

            // アニメーション時間(3.5s) + 余裕(0.5s) = 4秒後にDOMから削除
            setTimeout(() => {
                toast.remove();
            }, 4000);
        },

        async handleUsePotion() {
            try {
                // クライアント側でHPやポーション数をチェック
                /*
                if (this.state.playerHP <= 0) {
                    return this.showRewardNotification("HPが 0 です。回復してください。");
                }
                */
                if (this.state.playerHP >= this.state.playerMaxHP) {
                    return this.showRewardNotification("HPは満タンです。", 'error');
                }
                if (this.state.currentUser.potion_count <= 0) {
                    return this.showRewardNotification("ポーションがありません。", 'error');
                }

                // APIを呼び出し、サーバー側でポーションを1つ減らす
                const result = await this.api(`/api/users/${this.state.currentUser.id}/use-potion`, 'POST');

                if (result && result.user) {
                    // 1. 返ってきた最新のユーザー情報で state を更新
                    this.state.currentUser = result.user;
                    localStorage.setItem('currentUser', JSON.stringify(this.state.currentUser));

                    // 2. クライアント側のHPを回復 (例: 30回復)
                    const recoveryAmount = 30;
                    this.state.playerHP += recoveryAmount;
                    if (this.state.playerHP > this.state.playerMaxHP) {
                        this.state.playerHP = this.state.playerMaxHP; // 最大HPを超えない
                    }

                    // 3. 回復したHPを localStorage に保存
                    localStorage.setItem('currentPlayerHP', this.state.playerHP);

                    // 4. UIを更新
                    this.updateUserInfo(); // ポーション数の表示を更新

                    this.showRewardNotification(`ポーションを1つ使用した。\nHPが ${recoveryAmount} 回復！`, 'level-up');
                }
            } catch (err) {
                this.showRewardNotification(`ポーションの使用に失敗しました: ${err.message}`, 'error');
            }
        },

        resumeTimer() {
            clearInterval(this.state.timer);
            this.state.timer = setInterval(() => {
                this.state.timeLeft--;
                this.elements.timerDisplay.textContent = this.state.timeLeft;
                if (this.state.timeLeft <= 0) this.handleTimeout();
            }, 1000);
        }
    };
    App.init();
});