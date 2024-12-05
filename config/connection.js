const mysql = require("mysql");
const fs = require("fs");

const conn = mysql.createConnection({
  host: "hamza-mehdi-server.mysql.database.azure.com",
  user: "hamza_mehdi",
  password: "bismilah@@0404",
  database: "ecommerce",
  port: 3306,
  ssl: {
    rejectUnauthorized: false, // Permet les certificats auto-signés pour le débogage
    ca: fs.readFileSync("config/DigiCertGlobalRootG2.crt.pem", "utf8"),
  },
});

conn.connect((err) => {
  if (err) {
    console.error("Erreur de connexion : ", err.stack);
    return;
  }
  console.log("Connecté en tant qu'ID :", conn.threadId);
});

module.exports = conn;
