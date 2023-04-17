var mysql = require("mysql");

const conn = mysql.createConnection({
  host: "intflowserver2.iptime.org", // aws ec2 도메인 주소
  port: "33306", // aws ec2에 연결된 security group에서 허용한 port 번호
  user: "edgefarm", // mariaDB 접속계정
  password: "intflow3121", // mariaDB 접속계정의 비밀번호
  database: "edgefarm_monitoring", // 연결시킬 database 이름
});

module.exports = conn;
