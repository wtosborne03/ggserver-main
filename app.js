var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express()
, http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);
server.listen(3001);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auto/:rc/', function (req, res) {
  res.render('index', { '#room' : req.params[0] });
})

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('create', (rm) => {
    socket.join(rm);
    console.log(rm + ' does not i');
  });
  socket.on('join', (rm, name) => {
    rom = rm.toLowerCase();
    if (io.sockets.clients(rom).length > 0) {
      var clients = io.sockets.clients(rm);
      var ok = "yes";
      clients.forEach(element => socket.get('name', function (err, na) {
	if (na == name) {
	  ok = "no";
	}
      }));
      if (ok = "yes") {
      socket.set('name', name, function () { socket.emit("success"); });
      socket.set('rc', rom, function () {});
      io.sockets.in(rom).emit('joined', name, socket.id);
      socket.join(rom);
      }
      else {
        socket.emit("not_name");
      }
    } else {
      console.log(rom + ' does not');
      socket.emit("not_exist");
  }
  });
  socket.on('validateroom', (rm) => {
    var clients = io.sockets.clients(rm); 
    console.log(rm + ' does not i');
      if (clients.length > 0) {
	socket.emit('validateroom', "false");
      } else {
	socket.emit('validateroom', "true");
      }
  });
  socket.on('start', () => {
    socket.get('rc', function (err, room) {
      var clients = io.sockets.clients(room); 
      if (clients.length < 4) {
	socket.emit('start', "false");
      } else {
        console.log(room + "starting");
	io.sockets.in(room).emit('startgame', 'yes');
      }
      });
  });
  socket.on('host', (id) => {
    socket.set('role', 'host', function () {});
    io.sockets.sockets[id].emit('host');
  });
  socket.on('player', (id) => {
    socket.set('role', 'player', function () {});
    io.sockets.sockets[id].emit('player');
  });
  socket.on('disconnect', () => {
    socket.get('name', function (err, name) {
      socket.get('rc', function (err, room) {
        io.sockets.in(room).emit('left', name);
      });
    });
    console.log('user disconnected');
  });
});

module.exports = app;
