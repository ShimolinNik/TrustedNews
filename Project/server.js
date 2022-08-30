//const mysql = require('mysql');
const express = require('express');
//const session = require('express-session');
const path = require('path');

//For Blockchain
const savePath = path.resolve(__dirname + '/contracts');
const ethAirBalloons = require('ethairballoons');
const ethAirBalloonsProvider = ethAirBalloons('http://localhost:8545', savePath);



const Comment = ethAirBalloonsProvider.createSchema({
	name: "Comment",
	contractName: "commentContract",
	properties: [
		{
			name: "articleName",
			type: "bytes32",
			primaryKey: true
		},
		{
			name: "articleText",
			type: "bytes32",
		},
		{
			name: "comment",
			type: "bytes32"
		}]
});

//BD conncetion
const mysql = require('mysql');
const connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'trustednews'
});

const app = express();

/*app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));*/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
//app.use(express.static(path.join(__dirname, 'static')));


app.get('/deploy', (req, res) => {
	console.log("In deploy");
	Comment.deploy(function (err, success) {
		if (!err) {
			res.send("Contract deployed successfully!")
		} else {
			res.send("Contract deployment error" + err)
		}
	});
})

app.post('/create', (req,res) => {
	console.log("In create");
	//const newCommentObject = req.body;
	const newCommentObject={articleName:'Something', articleText: 'hashofthisText', comment: 'The first one'};
	Comment.save(newCommentObject, function (err, objectSaved) {
		if (!err) {
			res.json(objectSaved);
		} else {
			res.send(err)
		}
	});
})

app.get('/find', (req,res) => {
    Comment.find(function (err, allObjects) {
        if (!err) {
            res.json(allObjects);
        } else {
            res.send(err)
        }
});
})

// http://localhost:3000/
app.get('/', function(request, response) {
	// Render login template
	response.sendFile(path.join(__dirname + '/login.html'));
});

app.get('/lol', function(request, response) {
	// Render login template
	console.log("lol")
	//response.sendFile(path.join(__dirname + '/login.html'));
});

// http://localhost:3000/auth
app.post('/auth', function(request, response) {
	// Capture the input fields
	let username = request.body.username;
	console.log("Uername"+request.body.username);
	let password = request.body.password;
	console.log(request.body);
	// Ensure the input fields exists and are not empty
	if (username && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		connection.query('SELECT * FROM user_info WHERE login = ? AND password = ?', [username, password], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				// Authenticate the user
				//request.session.loggedin = true;
				//request.session.username = username;
        //request.session.UID = results[0]["RowDataPacket"]["UID"];
        //console.log(request.session);
        console.log(results[0].UID);
				let uid  = results[0].UID;
				connection.query('SELECT * FROM unige WHERE unige.UID = ? UNION SELECT * FROM hug WHERE hug.UID = ?;', [uid,uid], function(error, results, fields) {
					let keys = [];
					if (error) throw error;
					if (results.length > 0) {
						//console.log("Result1: ",results[0].proof);
						console.log(results);
						for (const element of results) {
							keys.push([element.userKey,element.proof]);
						}
						response.send({"UID":uid,"keys":keys});
						response.end();
					}
				});
				// Redirect to home page
				//response.send({"UID":results[0].UID});
				//response.redirect('/uid/'+results[0].UID);
			} else {
				response.send('Incorrect Username and/or Password!');
				response.end();
			}

		});
	} else {
		response.send('Please enter Username and Password!');
		console.log("Oh nooo");
		response.end();
	}
});

// http://localhost:3000/home
app.get('/uid/:uid', function(request, response) {
		// Output username
		//response.send({"lol":'Welcome back, ' + request.session.username + '!'});
		//req.query.tagId
		let uid  = request.params.uid;
		connection.query('SELECT * FROM unige WHERE unige.UID = ? UNION SELECT * FROM hug WHERE hug.UID = ?;', [uid,uid], function(error, results, fields) {
			let keys = [];
			if (error) throw error;
			if (results.length > 0) {
				//console.log("Result1: ",results[0].proof);
				console.log(results);
				for (const element of results) {
					keys.push([element.userKey,element.proof]);
				}
				response.send({"UID":uid,"keys":keys});
				response.end();
			}
		});
		//response.send({"UID":request.params.uid});
});

app.listen(3000);
