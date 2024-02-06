const express = require('express')
const app = express()
const port = 3005;
const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser')
let jsonData = require('./data.json');
let users = jsonData.users;

let allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Headers', "*");
    next();
}
app.use(allowCrossDomain);
app.use(bodyParser.json());       // to support JSON-encoded bodies


app.get('/getUsers', (req, res) => {
    let data = sendAllUsers();
    res.send(data);
})

app.post('/createUser', (req, res) => {
    if (req.body.name !== undefined && req.body.email !== undefined && req.body.date !== undefined) {
        let newName = req.body.name;
        let newEmail = req.body.email;
        let newDate = req.body.date;
        if (checkUserExist(users, newName)) {
            res.json({
                status: 'error',
                message: 'Пользователь с таким именем уже есть'
            })
            return
        } else {
            let newUser = {
                "name": newName,
                "email": newEmail,
                "created": newDate,
                "lastUpdate": newDate
            }
            users.push(newUser);
            fs.writeFile('./data.json', JSON.stringify(jsonData), function writeJSON(err) {
                if (err) return console.log(err);
            });

            res.json({
                status: 'success',
                message: 'Пользователь успешно добавлен'
            })
        }
    } else {
        res.json({
            status: 'error',
            message: 'Какого-то поля не хватает'
        })
    }
})

app.post('/changeUser', (req, res) => {
    if (req.body.name !== undefined && req.body.email !== undefined && req.body.date !== undefined) {
        let userName = req.body.name;
        let newEmail = req.body.email;
        let updatedDate = req.body.date;
        if (checkUserExist(users, userName)) {
            for (let user of users) {
                if (user.name === userName) {
                    user.email = newEmail;
                    user.lastUpdate = updatedDate;
                    fs.writeFile('./data.json', JSON.stringify(jsonData), function writeJSON(err) {
                        if (err) return console.log(err);
                    });
    
                    res.json({
                        status: 'success',
                        message: 'Пользователь успешно обновлен'
                    })
                }
            }
        } else {
            res.json({
                status: 'error',
                message: 'Пользователь с таким именем не найден('
            })
        }
    } else {
        res.json({
            status: 'error',
            message: 'Какого-то поля не хватает'
        })
    }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


function sendAllUsers() {
    if (jsonData === undefined) return;
    return jsonData
}

function checkUserExist(usersArray, name) {
    for (let user of usersArray) {
        if (user.name === name) {
            return true;
        }
    }
    return false;
}