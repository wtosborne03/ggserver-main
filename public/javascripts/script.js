$(function () {

$('#main').html(loadFile('phonescreens/join.txt'));

function loadFile(filePath) {
  var result = null;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", filePath, false);
  xmlhttp.send();
  if (xmlhttp.status==200) {
    result = xmlhttp.responseText;
  }
  return result;
  }
  async function message(txt) {
    $('#message').html(txt);
    await new Promise(r => setTimeout(r, 2000));
    $('#message').html("");
  }

   var socket = io.connect('http://localhost:3001');
    
    
    $('#join').click(function() {
       // prevents page reloading
      socket.emit('join', $('#room').val(), $('#name').val());
      $('#room').val('');
      return false;
    });
    socket.on('not_exist', function(){
      message("Room Not Found");
    });
    socket.on('host', function(){
      $('#main').html(loadFile('phonescreens/host_form.txt')); 
      $('#start').click(function() {
      //Console.Log("hi");
       // prevents page reloading
      socket.emit('start');
    });
    });
    
    socket.on('player', function(){
        $('#main').html(loadFile('phonescreens/waiting.txt'));
    });
    socket.on('start', function(val){
      message("Not Enough Players");
    });
});