var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
players = {};
 app.get('/', function(req, res){
   res.sendFile(__dirname + '/public/index.html');
   });
   
    app.get('/cookie.js', function(req, res){
   res.sendFile(__dirname + '/public/cookie.js');
   });

io.on('connection', function(socket){
  console.log('a user connected');

   socket.on('disconnect', function(){
    io.emit('remove player',players[socket.id]);
    var nn = "unknown";
    try {
    var nn = players[socket.id].nickname;
    }
    catch(err) {}
    delete players[socket.id];
    console.log('user disconnected: ' + nn);
  });

socket.on('add player',function(start) {
  
  players[socket.id] = {nickname:start.nickname,x:10,y:10};
  io.emit('add player', players[socket.id]);
  console.log("Added new player! " + start.nickname);
});
  socket.on('chat message', function(msg){
    var p = players[socket.id];
    if (p == null) {
      console.log("received message from non existant player");
      return;
    }
    console.log("Message from " + p.nickname + " x: " + msg.x + ' y: ' + msg.y);
    p.x = msg.x;
    p.y = msg.y;

     io.emit('chat message', {allPlayers: players});
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});