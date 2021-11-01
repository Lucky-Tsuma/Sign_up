const express = require('express');
const app = express();
const port = 3000;

const users = [];
const password_length = RegExp('(?=.{8,})');
const password_lowercase = RegExp('(?=.*[a-z])');
const password_caps = RegExp('(?=.*[A-Z])');
const password_numbers = RegExp('(?=.*[0-9])');
const password_special_symbols = RegExp('(?=.*[^A-Za-z0-9])');

app.post('/sign_up', (req, res) => {
    const email = req.query.email;
    const username = req.query.username;
    const password = req.query.password;
    const confirm_password = req.query.confirm_password;

    if(password != confirm_password) {
        res.status(400).send("Passwords do not match");
    }

    if(!password_length.test(password)) {
        res.status(400).send("Password too short");
    } 

    if(!password_lowercase.test(password)) {
        res.status(400).send("Password should contain lowercase characters");
    }

    if(!password_caps.test(password)) {
        res.status(400).send("Password should contain uppercase characters");
    }

    if(!password_numbers.test(password)) {
        res.status(400).send("Password should contain numbers");
    }

    if(!password_special_symbols.test(password)) {
        res.status(400).send("Password should contain special characters");
    }

    const user = {
        "email" : email,
        "username" : username,
        "password" : password
    }

    users.push(user);
    res.send(users);
});

app.listen(port, () => {
    console.log(`Listening at port ${port}`);
});