const express = require('express')
const app = express()
const port = 3000

// Import the file system module for handling files
const fs = require("fs")

// Import and configure the body-parser for parsing form data
const bodyparser = require("body-parser");
const parser = bodyparser.urlencoded({ extended: false })

// Serve static files from the "public" directory
app.use(express.static("public"))

// Configure sessions and cookies
const session = require('express-session')
const cookieParser = require('cookie-parser')
app.use(cookieParser())

app.use(session({
	secret: 'gh$%^&*987$%ghj',
	cookie: { maxAge: 90000 },
	saveUninitialized: true,
	resave: false
}));

app.use(express.json())

// Route to serve the home page
app.get('/', (req, res) => {
	res.sendFile(__dirname + "/public/home.html");
})

// Route to serve the signup page
app.get('/signup', (req, res) => {
	res.sendFile(__dirname + "/public/signup.html");
})

// Route to serve the login page
app.get('/loginpage', (req, res) => {
	res.sendFile(__dirname + "/public/login.html");
})

// Route to handle the creation of a new note
app.post("/postNote", (req, res) => {
	if (req.body.note) {
		fs.readFile(__dirname + "/public/" + req.session.session_id + ".txt", (err, data) => {
			data = data ? JSON.parse(data) : [];
			let maxID = 0;
			if (data[data.length - 1])
				maxID = data[data.length - 1].id;

			let obj = {};
			obj.note = req.body.note;
			obj.id = ++maxID;
			data.push(obj);

			console.log(data);

			fs.writeFile(__dirname + "/public/" + req.session.session_id + ".txt", JSON.stringify(data), (err) => {
				res.end("GOT IT");
			});
		})
	}
})

// Route to handle user registration
app.post("/signupFunction", parser, (req, res) => {
	fs.readFile(__dirname + "/public/data1.txt", (err, data) => {
		data = data ? JSON.parse(data) : [];
		let obj = {};
		obj.username = req.body.username;
		obj.password = req.body.password;
		data.push(obj);
		console.log(data);

		fs.writeFile(__dirname + "/public/data1.txt", JSON.stringify(data), (err) => {
			res.end("User Created");
		});
	});
})

// Route to handle user login
app.post("/login", parser, (req, res) => {
	fs.readFile(__dirname + "/public/data1.txt", (err, data) => {
		data = data ? JSON.parse(data) : [];
		let obj = {};
		obj.username = req.body.username;
		obj.password = req.body.password;
		let check = data.filter((e) => {
			if (e.username == obj.username && e.password == obj.password)
				return e;
			return null;
		});
		console.log(check);
		if (check[0] != null) {
			req.session.session_id = req.body.username;
			res.sendFile(__dirname + "/public/note-home.html");
		}
		else
			res.end("NO USER FOUND");
	})
})

// Route to retrieve user notes
app.get("/getNotes", (req, res) => {
	fs.readFile(__dirname + "/public/" + req.session.session_id + ".txt", (err, data) => {
		data = data ? JSON.parse(data) : [];
		res.end(JSON.stringify(data));
	})
})

// Route to retrieve the username associated with the current session
app.get("/name", (req, res) => {
	let name = req.session.session_id;
	console.log(name);
	res.end(JSON.stringify({ name: name }));
})

// Route to handle user logout
app.get('/logout', (req, res) => {
	req.session.destroy();
	res.sendFile(__dirname + '/public/home.html')
})

// Route to retrieve the latest note associated with the current session
app.get("/getLatest", (req, res) => {
	fs.readFile(__dirname + "/public/" + req.session.session_id + ".txt", (err, data) => {
		data = data ? JSON.parse(data) : [];
		res.end(JSON.stringify(data[data.length - 1]));
	})
})

// Route to delete a specific note associated with the current session
app.post("/deleteNote", (req, res) => {
	if (req.body.delNote) {
		fs.readFile(__dirname + "/public/" + req.session.session_id + ".txt", (err, data) => {
			data = data ? JSON.parse(data) : [];
			if (data) {
				console.log(data);
				let newData = data.filter(function (e) {
					if (e.id != req.body.delNote) {
						return e;
					}
				})
				console.log(newData);
				fs.writeFile(__dirname + "/public/" + req.session.session_id + ".txt", JSON.stringify(newData), (err) => {
					res.end("DELETED");
				})
			}
		})
	}
})

// Start the server and listen on port 3000
app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})
