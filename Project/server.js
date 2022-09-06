const express = require('express');
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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));


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
	const newCommentObject={articleName:'Somethingggg', articleText: 'hashofthisText', comment: 'The first one'};
	Comment.save(newCommentObject, function (err, objectSaved) {
		if (!err) {
			res.json(objectSaved);
			res.send(objectSaved);
		} else {
			res.send(err)
		}
	});
})

app.get('/find', (req,res) => {
	Comment.find(function (err, allObjects) {
		if (!err) {
			res.json(allObjects);
		}
		else {
			res.send(err)
    }
});
})

app.get('/findId', (req,res) => {
	Comment.findById('Something', function (err, record) {
	   if (!err) {
	       console.log(record);
	   }
	});
})



// http://localhost:3000/
app.get('/', function(request, response) {
	// Render login template
	response.sendFile(path.join(__dirname + '/login.html'));
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
				let uid  = results[0].UID;
				connection.query('SELECT * FROM unige WHERE unige.UID = ? UNION SELECT * FROM hug WHERE hug.UID = ?;', [uid,uid], function(error, results, fields) {
					let keys = [];
					if (error) throw error;
					if (results.length > 0) {
						for (const element of results) {
							keys.push([element.userKey,element.proof]);
						}
						response.send({"UID":uid,"keys":keys});
						response.end();
					}
				});
			} else {
				response.send('Incorrect Username and/or Password!');
				response.end();
			}

		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

// http://localhost:3000/uid/:uid
app.get('/uid/:uid', function(request, response) {
		let uid  = request.params.uid;
		connection.query('SELECT * FROM unige WHERE unige.UID = ? UNION SELECT * FROM hug WHERE hug.UID = ?;', [uid,uid], function(error, results, fields) {
			let keys = [];
			if (error) throw error;
			if (results.length > 0) {
				for (const element of results) {
					keys.push([element.userKey,element.proof]);
				}
				response.send({"UID":uid,"keys":keys});
				response.end();
			}
		});

});

app.listen(3000);
