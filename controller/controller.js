var app = require('../app');
var debug = require('debug')('crud:server');
var http = require('http');
const connection = require('../db');

// Assignation du port utilisé
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// Créeation du serveur HTTP
var server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
* Normalize a port into a number, string, or false.
*/

function normalizePort(val) {
  var port = parseInt(val, 10);
  
  if (isNaN(port)) {
    // named pipe
    return val;
  }
  
  if (port >= 0) {
    // port number
    return port;
  }
  
  return false;
}

/**
* Event listener for HTTP server "error" event.
*/

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  
  var bind = typeof port === 'string'
  ? 'Pipe ' + port
  : 'Port ' + port;
  
  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
    console.error(bind + ' requires elevated privileges');
    process.exit(1);
    break;
    case 'EADDRINUSE':
    console.error(bind + ' is already in use');
    process.exit(1);
    break;
    default:
    throw error;
  }
}

/**
* Event listener for HTTP server "listening" event.
*/

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
  ? 'pipe ' + addr
  : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

app.post('/auth', (request, response) => {
  let email = request.body.email;
  let password = request.body.password;
  if (email && password) {
    connection.query('SELECT email FROM user WHERE email = ? AND password = ?', [email, password], (error, results, fields) => {
      if (results.length > 0) {
        request.session.loggedin = true;
        request.session.email = email;
        response.redirect("/tasks")
      } else {
        response.send("Identifiants incorrects !");
      }
      response.end();
    });
  } else {
    response.send("Merci d'entrer vos identifiants !");
    response.end();
  }
});

app.get('/login', (request, response) => {
  if (!request.session.loggedin) {
    res.render('index', { title: 'Page de login' });
  } else {
    response.redirect("/tasks")
  } 
});

app.get('/tasks', (request, response) => {
  if (request.session.loggedin) {
    connection.query("SELECT id FROM user WHERE email = ?", [request.session.email], (error, results, fields) => {
    });
  } else {
    response.send('Merci de vous connecter pour voir cette page !');
    response.end();
  }
});

app.get('/logout',  function (req, res, next)  {
  if (req.session) {
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});