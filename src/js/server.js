var express = require('express');
const http = require('http');
var multer = require('multer');
var mysql = require('mysql')
var app = express()
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended:false
}))

app.use(bodyParser.json())

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
//上传图片
        connection.query('INSERT INTO `blog_img` SET ?', {
            u_path : path,
            u_class : 1,
        })
        cb(null, path)
    }
})

var upload = multer({
    storage : storage
});
//预览上传图片
app.post('/getimg', upload.any(), function(req, res){
    res.append("Access-Control-Allow-Origin", "*");
    connection.query('SELECT * FROM blog_img', function(error, results, fields){
        for(var i = 0; i < results.length; i++){
            src = results[i].u_path
        }
        res.end(src);
    })
});

//获取数据库图片
app.post('/getimages', upload.any(), function(req, res){
    res.append("Access-Control-Allow-Origin", "*");
    connection.query('SELECT * FROM blog_img', function(error, results, fields){
        var str1=JSON.stringify(results)
        res.end(str1);
    })
});


//改变图片状态
app.post('/removeimg', upload.any(),function(req, res){
    console.log(req.body.id);
    res.append("Access-Control-Allow-Origin", "*");

    connection.query("update blog_img set ? where id='"+req.body.id+" '  ",{
        u_class:0
    }, function(error, results, fields){
        res.send("成功")
    })
})
app.listen(9999);










