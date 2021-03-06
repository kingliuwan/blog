const http = require('http');
const url = require('url');
const querystring = require('querystring');
var mysql=require('mysql')
var multer = require('multer');
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
/*登录后台*/
app.post('/login',function (req,res) {
    res.append("Access-Control-Allow-Origin", "*")
    connection.query("select * from login where u_name='"+req.body.username+"'and u_pwd='"+req.body.password+"'",function (error, result, fields) {
            // if(result==true){
            //     res.send(1);
            // }
        res.send(result);
    })
})
/*评论后台*/
app.post('/comment',function (req,res) {
    res.append("Access-Control-Allow-Origin", "*")
    connection.query()
})
/*个人资料后台*/
app.post('/person',function (req,res) {
    res.append("Access-Control-Allow-Origin", "*")
    connection.query("select * from person",function (error, result, fields) {
        res.send(result)
    })
})
/*修改个人资料的后台*/
app.post('/updataperson',function (req,res) {
    res.append("Access-Control-Allow-Origin", "*")
    console.log(req.body);
    connection.query("update person set ? where p_id=1",{
        name:req.body.m_name,
        email:req.body.m_email,
        tel:req.body.m_tel,
        phone:req.body.m_phone,
        company:req.body.m_company,
        department:req.body.m_department,
        remarks:req.body.m_Remarks,
        profile:req.body.profile
    },function (error, result, fields) {
        if(error)
            throw error
        res.send("修改成功")
    })
})
//将文章信息录入数据库
app.post("/article", function (req, res) {
    res.append("Access-Control-Allow-Origin", "*");
    connection.query("insert into article set ?", {
        article_title: req.body.article_title,
        article_content: req.body.article_content,
        article_class: req.body.article_class,
        article_time: req.body.article_time
    }, function (err, result) {
        if (err) {
            console.log("插入失败");
        } else {
            console.log('插入成功');
        }
    })
})


//页面刷新后,获取文章信息生成列表
app.post("/admin-v2", function (req, res) {
    res.append("Access-Control-Allow-Origin", "*");
    connection.query("select * from article", function (error, results, fields) {
        // if(error) throw error;
        // var mmp = JSON.stringify(results);
        // console.log(results);
        res.send(results);
    })
})


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
app.listen(5656)
console.log("开启服务器");