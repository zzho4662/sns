// promise 로 개발된, mysql2 패키지를 설치하고 로딩.
const mysql = require("mysql2");

// 커넥션 풀 (Connection Pool) 을 만든다.
// 이유? 풀이 알아서, 커넥션 연결을 컨트롤 한다.

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWD,
  waitForConnections: true,
  connectionLimit: 10,
});

// await 으로 사용하기 위해, 프라미스로 저장.
const connection = pool.promise();

module.exports = connection;
