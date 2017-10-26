var router = require('express').Router();
var db = require('./db');

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
  console.log(req.session);
  // if user is authenticated in the session, carry on 
  if (req.session.user) {
    return next();
  } else {
    // if they aren't send error code
    res.sendStatus(401);
  }
}

// process the signup form
router.post('/signup', function(req, res) {
  var student = {
    username: req.body.username,
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    password: req.body.password
  };

  db.query('INSERT INTO student SET ?', student, function(err, results) {
    // this user is already signed up
    if (err) {
      res.sendStatus(409);
    } else {
      // user signed up successfully
      res.sendStatus(200);
    }
  });
});

// process data from login form submission
router.post('/login', function(req, res) {
  req.body.data = JSON.parse(req.body.data);
  console.log('username: ' + req.body.data.username);
  console.log('password: ' + req.body.data.password);

  db.query('SELECT * FROM student WHERE username = ? AND password = ?', [req.body.data.username, req.body.data.password], function(err, results) {
    if (results.length === 1) {
      // user loged in successfully :)
      // user data will be stored in session
      req.session.user = results[0];
      console.log(req.session);
      // redirect user to the homepage
      res.sendStatus(200);
    } else {
      //Username or password is wrong, please try again!!:(
      res.sendStatus(401);
    }
  });
});

// retrieve an user specified by username in the database
router.get('/user', isLoggedIn, function(req, res) {
  console.log(req.session);
  var username = req.session.user.username;

  db.query('SELECT * FROM student WHERE username = ?', [username], function(err, results) {
    if (err) {
      console.log(err);
      res.send(500, 'Sorry, some errors occured :(');
    } else {
      res.send(results[0]);
    }
  });
});

// retrieve all courses enrolled of an user specified by username in the database
router.get('/user/courses', isLoggedIn, function(req, res) {
  var username = req.session.username;
  var queryStr = 'SELECT DISTINCT c.* FROM enroll e INNER JOIN student s ON s.username = e.student INNER JOIN course c ON c.id = e.course WHERE s.username = ? ORDER BY c.id';

  db.query(queryStr, [username], function(err, results) {
    if (err) {
      console.log(err);
      res.send(500, 'Sorry, some errors occured :(');
    } else {
      res.send(results);
    }
  });
});

// retrieve all courses available in the database
router.get('/courses/', function(req, res) {
  db.query('SELECT * FROM course', function(err, results) {
    if (err) {
      console.log(err);
      res.send(500, 'Sorry, some errors occured :(');
    } else {
      res.send(results);
    }
  });
});

// retrieve information of a course specified by id
router.get('/courses/:id', function(req, res) {
  var id = req.params.id;

  db.query('SELECT * FROM course WHERE id = ?', [id], function(err, results) {
    if (err) {
      console.log(err);
      res.send(500, 'Sorry, some errors occured :(');
    } else {
      res.send(results[0]);
    }
  });
});

module.exports = router;