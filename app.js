const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");

const app = express();
let port = (process.env.PORT == null || process.env.PORT == "") ? 3000 : process.env.PORT;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = mongoose.model("User", userSchema);


app.get("/", (req, res) => {
    res.render("home");
});


///////////////////////////////// LOGIN ///////////////////////////////////
app.route("/login")
    
    .get((req, res) => {
        res.render("login");
    })

    .post((req, res) => {
        const username = req.body.username;
        const password = req.body.password;

        User.findOne({email: username}, (err, result) => {

            if(!err) {
                if(result) {
                    if(result.password === password) {
                        res.render("secrets");
                    }
                }
            } else {
                console.log(err);
            }
        });
    });


///////////////////////////////// REGISTER ///////////////////////////////////
app.route("/register")

    .get((req, res) => {
        res.render("register");
    })

    .post((req, res) => {
        const newUser = new User({
            email: req.body.username,
            password: req.body.password
        });
        newUser.save((err) => {
            if(!err) {
                console.log("Successfully added user!");
                res.render("secrets");
            } else {
                console.log(err);
            }
        });
    });







app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});



