var express = require('express');
var multer = require('multer');
var mysql = require('mysql')
var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'blog8888'
});
connection.connect();

var src = ''
var storage = multer.diskStorage({
    // 上传文件夹
    destination : function(req, file, cb){
        cb(null, '../img/bgimg')
    },
    // 保存的文件名字
    filename : function(req, file, cb){
        var path = file.originalname

        connection.query('INSERT INTO `blog_img` SET ?', {
            u_path : path,
        })
        cb(null, path)
    }
})

var upload = multer({
    storage : storage
});
var app = express()
app.post('/getimg', upload.any(), function(req, res){
    res.append("Access-Control-Allow-Origin", "*");
    connection.query('SELECT * FROM blog_img', function(error, results, fields){
        for(var i = 0; i < results.length; i++){
            src = results[i].u_path
        }
        res.end(src);
    })
});
app.listen(9999);












