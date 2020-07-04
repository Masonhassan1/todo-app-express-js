const express = require('express')
const app = express()
const port = 3000

//fs for handling files
const fs = require("fs")

//parser
const bodyparser = require("body-parser");
const parser = bodyparser.urlencoded({ extended: false })

//static files
app.use(express.static("public"))

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

app.get('/', (req, res) => {
	res.sendFile(__dirname + "/public/home.html");
})

app.get('/signup', (req, res) => {
	res.sendFile(__dirname + "/public/signup.html");
})

app.get('/loginpage', (req, res) => {
	res.sendFile(__dirname + "/public/home.html");
})

app.post("/postNote", (req, res) => {
	//console.log(req.body.note);
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

				// console.log(err);
				res.end("GOT IT");
			});
		})
	}
})

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

});


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

app.get("/getNotes", (req, res) => {
	fs.readFile(__dirname + "/public/" + req.session.session_id + ".txt", (err, data) => {
		data = data ? JSON.parse(data) : [];
		res.end(JSON.stringify(data));
	})
})

app.get("/name", (req, res) => {
	let name = req.session.session_id;
	console.log(name);
	res.end(JSON.stringify({ name: name }));
})
// View Engine





app.get('/logout', (req, res) => {
	req.session.destroy();
	res.sendFile(__dirname + '/public/home.html')
})

app.get("/getLatest", (req, res) => {
	fs.readFile(__dirname + "/public/" + req.session.session_id + ".txt", (err, data) => {
		data = data ? JSON.parse(data) : [];
		res.end(JSON.stringify(data[data.length - 1]));
	})

})

app.post("/deleteNote", (req, res) => {
	if (req.body.delNote) {
		//console.log(req.body.delNote);
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


app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})
