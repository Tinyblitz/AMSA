// Classes
class Group {
  constructor(name, y, id) {
    this.name = name;
    this.y = y;
    this.ID = id;
    this.users = [];
    this.messages = [];   
  }
}

class User {
  constructor(name, c, id) {
    this.n = name;
    this.c = c;
    this.ID = id;
    // Hold a list of all the groups the user is in
    this.groups = [];
    this.groups.push(0);
  }
}

class Message {
  constructor(ID, _text, w, h){
    this.Text = _text;
    this.userID = ID;
    this.w = w;
    this.h = h;
    //this.Time = _time;
  }
}

// SETUP
var express = require('express');

var app = express();

// Localhost for testing
//var server = app.listen(3000, '0.0.0.0', () => console.log('listening at 3000'));
var server = app.listen(3000, '192.168.1.23', () => console.log('listening at 3000'));

app.use(express.static('public'));

console.log("My socket server is running");

var socket = require('socket.io');

var io = socket(server);

io.sockets.on('connection', newConnection);

// Variables

let groupHolder = [];
groupHolder[0] = new Group("Main Chat", 157, 0);


// Socket connection
function newConnection(socket){
	console.log('new connection: ' + socket.id);

	// Send data to new connection
	socket.emit('load', groupHolder);

	// Send out text messages
	socket.on('message', addMSG);

	function addMSG(data){

		// Don't store movie buddy conversations
		if (data.g != -1) {
			let newMSG = new Message(data.u, data.t, data.w, data.h);

			groupHolder[data.g].messages.push(newMSG);
		}

		io.emit('message', data);
	}

	// User additions to groups
	socket.on('addUser', addUser);

	function addUser(data){

		/* format
		var data = {
	      n: avatar.Name,
	      c: avatar.Color,
	      u: thisUser.ID,
	      g: 0
    	};*/

		// Add new user to main group
		if (data.g == 0) {

			let newUser = new User(data.n, data.c, data.u);

			groupHolder[0].users.push(newUser);
		}

		/* format
		var data = {
	      u: thisUser.ID,
	      g: 0 // group ID
    	};*/
		// Add reference of user to target group
		else {

			// Find the user in the main group
			let tarUser = null;
			for (let v of groupHolder[0].users){
				if (v.ID == data.u) tarUser = v;
			}

			if (tarUser == null) console.log("ERROR: could not find user when adding to group!");


			// Push user into target group - might need to change if change group IDs
			groupHolder[data.g].users.push(tarUser);
		}

		socket.broadcast.emit('addUser', data);		
	}

	// User changes name
	socket.on('changeName', changeName);

	function changeName(data){

		let tarUser = null;
		for (let v of groupHolder[0].users){
			if (v.ID == data.u) tarUser = v;
		}

		if (tarUser == null) console.log("ERROR: could not find user when changing names!");

		tarUser.n = data.n;
		tarUser.c = data.c;

		socket.broadcast.emit('changeName', data);
	}

	// Add new group
	socket.on('addGroup', addGroup);

	function addGroup(data){

		let newGroup = new Group(data.n, data.y, data.g);

		groupHolder.push(newGroup); 

		socket.broadcast.emit('addGroup', data);

	}

	// Send Invites
	socket.on('sendInvites', sendInvites);

	function sendInvites(data){

		socket.broadcast.emit('sendInvites', data);

	}

	// Signal end of movie
	socket.on('movieDone', movieDone);

	function movieDone(){
		// For debugging
		io.emit('movieDone');

		// For user testing
		//socket.broadcast.emit('movieDone');
	}

	// Relay Emotions to other users -  don't worry about storing, people should not be able to join after movie
	socket.on('emotionRecord', sendEmotions);

	function sendEmotions(data){
		socket.broadcast.emit('otherEmotions', data);
	}
}