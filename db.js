var mysql = require('mysql');

//create connection to mysql database
var db = mysql.createConnection({
  host: 'localhost',
  user: 'nlproject',
  password: 'nlproject',
  database: 'demo'
});

db.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + db.threadId);
});

module.exports = db;