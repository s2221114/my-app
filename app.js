const express = require('express');
const path = require('path');
const db = require('./database.js'); // データベース設定をインポート
const apiRoutes = require('./routes/api.js'); // APIルートをインポート
const app = express();

// JSON形式のリクエストとURLエンコードされたリクエストを解析するミドルウェア
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 静的ファイル（HTML, CSS, JS）を提供
app.use(express.static(path.join(__dirname, 'public')));

// APIルートを設定
app.use('/api', apiRoutes);

// エラーハンドリング
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = app;

// サーバーを起動 (直接 node app.js で実行する場合)
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}. Access it at http://localhost:${PORT}`);
  });
}