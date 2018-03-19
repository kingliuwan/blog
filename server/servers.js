const http = require('http');
const url = require('url');
const querystring = require('querystring');
var mysql=require('mysql')
var express=require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended:false
}))

app.use(bodyParser.json())
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'blog'
});
connection.connect();

app.post('/login',function (req,res) {
    console.log(req.body.username);
    console.log(req.body.password);
    res.append("Access-Control-Allow-Origin", "*")
    connection.query("select * from login where u_name='"+req.body.username+"'and u_pwd='"+req.body.password+"'",function (error, result, fields) {
            // if(result==true){
            //     res.send(1);
            // }
        res.send(result);
    })
})

app.listen(5656)
console.log("开启服务器");