const bcrypt = require("bcrypt");
const express = require('express');
const app = express();
const port = 3000;

const users = [];

app.get('/', (req, res) => {
    res.status(200).send("This is the homepage");
});

app.get('/users', (req, res) => {
    res.status(200).send(users);
});

app.post('/sign_up', async (req, res) => {
    
    const length = RegExp('(?=.{8,})');
    const password_regex = RegExp('(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9])');

    const { email, username, password, confirm_password} = req.query;

    if(password != confirm_password) {
        res.status(400).send("Passwords do not match");
    }

    if(!length.test(password)) {
        res.status(400).send("Password should be at least 8 characters long");
    } 

    if(!password_regex.test(password)) {
        res.status(400).send("Password should contain both upper and lowercase characters, numbers and special characters");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    users.push({email, username, hashedPassword});
    res.send(users);
});

app.listen(port, () => {
    console.log(`Listening at port ${port}`);
});
