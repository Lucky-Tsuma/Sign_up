const bcrypt = require("bcrypt");
const express = require('express');
require('dotenv').config();
const jwt = require("jsonwebtoken");
const app = express();
app.use(express.json());
const port = 3000;

const users = [];

// const key = require('crypto').randomBytes(16).toString('hex');

app.get('/', (req, res) => {
    res.status(200).send("This is the homepage");
});

app.get('/users', (req, res) => {
    res.status(200).send(users);
});

app.post('/sign_up', async (req, res) => {
    
    const length = RegExp('(?=.{8,})');
    const password_regex = RegExp('(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9])');

    const { email, username, password, confirm_password} = req.body;

    if(password != confirm_password) {
        return res.status(400).send("Passwords do not match");
    }

    if(!length.test(password)) {
        return res.status(400).send("Password should be at least 8 characters long");
    } 

    if(!password_regex.test(password)) {
        return res.status(400).send("Password should contain both upper and lowercase characters, numbers and special characters");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    users.push({email, username, hashedPassword});
    return res.send(users);
});

app.post('/login', async (req, res) => {
    const {mail, password} = req.body;

    for(user of users) {
        if(user.email === mail) {
            const isValid = await bcrypt.compare(password, user.hashedPassword);
            if(isValid) {
                const token = jwt.sign({mail, password}, process.env.SECRET_KEY, {expiresIn: '24h'});
                return res.status(200).send(token);
            } else {
                return res.status(400).send("Invalid password");
            }
        }
    }

    res.status(400).send("User not found");
});

app.listen(port, () => {
    console.log(`Listening at port ${port}`);
});
