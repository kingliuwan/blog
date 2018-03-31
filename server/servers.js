var http = require('http');
var url = require('url');
var querystring = require('querystring');
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
    connection.query("SELECT * FROM article AS a INNER JOIN COMMENT  AS b INNER JOIN person AS c WHERE a.a_id=b.a_id",function (error, result, fields) {
        res.send(result)
    })
})
/*删除评论*/
app.post('/removecomment',function (req,res) {
    res.append("Access-Control-Allow-Origin", "*")
    connection.query("delete from comment where c_id='"+req.body.cId+"'",function (error, result, fields) {
        res.send(result)
    })
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
        personimg:req.body.m_personimg,
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
//修改头像
app.post('/personimg',function (req,res) {
    res.append("Access-Control-Allow-Origin", "*")

    connection.query("update person set ? where p_id=1",{
        personimg:req.body.m_personimg,
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
        article_time: req.body.article_time,
        article_status: req.body.article_status
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
    connection.query("select * from article where article_status='1'", function (error, results, fields) {
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
        cb(null, '../src/img/bgimg')
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
//获取status状态为0的文件
app.post("/admin-v3", function (req, res) {
    res.append("Access-Control-Allow-Origin", "*");
    connection.query("select * from article where article_status='0'", function (error, results, fields) {
        // if(error) throw error;
        // var mmp = JSON.stringify(results);
        // console.log(results);
        res.send(results);
    })
})
//reback操作将状态为0的文章变为状态1,将文章的显示于所有文章中
app.post("/reback", function (req, res) {
    res.append("Access-Control-Allow-Origin", "*");
    //更新文章的状态
    connection.query("update article set ?  where article_title="+"'"+req.body.article_title+"'",{
        article_status:"1"
    } ,function (error, results, fields) {
        // if(error) throw error;
        // var mmp = JSON.stringify(results);
        // console.log(results);
        res.send(results);
    })
})
//修改状态,将状态为1的文章变为状态0
app.post("/del", function (req, res) {
    res.append("Access-Control-Allow-Origin", "*");
    connection.query("update article set ? where article_title="+"'"+req.body.article_title+"'",{
        article_status:0
    }, function (error, results, fields) {
            // res.send(results)
            res.send(results);
        })
})
//删除数据库中不需要的表的操作,永远也看不到了
app.post("/remove", function (req, res) {
    res.append("Access-Control-Allow-Origin", "*");
    connection.query("delete from article where article_title="+"'"+req.body.article_title+"'", function (error, results, fields) {
        console.log(results);
        res.send(results);
    })
})
//修改背景图片的后台
app.post("/bgchange",function (req,res) {
    res.append("Access-Control-Allow-Origin", "*");
    connection.query("update bgimg set ?  where bg_id='1'",{
        bg_url:req.body.bgimg
    } ,function (error, results, fields) {
        res.send(results);
    })
})

//首页背景图
app.post("/bgimg",function (req,res){
    res.append("Access-Control-Allow-Origin", "*");
    connection.query("SELECT * FROM bgimg",function (error, results, fields) {
        res.send(results);
    })
})
//首页的文章后台
app.post("/index", function (req, res) {
    res.append("Access-Control-Allow-Origin", "*");
    connection.query("SELECT * FROM article WHERE article_status=1 ORDER BY a_id DESC LIMIT 0,4", function (error, results, fields) {
        // if(error) throw error;
        // var mmp = JSON.stringify(results);
        // console.log(results);
        res.send(results);
    })
})
//首页的文章切换后台
app.post("/changearcitle", function (req, res) {
    res.append("Access-Control-Allow-Origin", "*");
    connection.query("SELECT * FROM article WHERE article_status=1 ORDER BY a_id DESC LIMIT "+req.body.num*4+",4", function (error, results, fields) {
        // if(error) throw error;
        // var mmp = JSON.stringify(results);
        // console.log(results);
        res.send(results);
    })
})
//跳转到详情文章页面
app.post("/detailsarticle", function (req, res) {
    res.append("Access-Control-Allow-Origin", "*");
    connection.query("SELECT * FROM article WHERE a_id="+req.body.a_id, function (error, results, fields) {
        // if(error) throw error;
        // var mmp = JSON.stringify(results);
        // console.log(results);
        res.send(results);
    })
})
//前端提交评论
app.post("/postcomment", function (req, res) {
    res.append("Access-Control-Allow-Origin", "*");
    connection.query("insert into comment set ?",{
        c_content:req.body.content,
        c_time:req.body.time,
        a_id:req.body.id
    }, function (error, results, fields) {
        res.send(results);
    })
})
//定向查询评论
app.post("/commenttwo", function (req, res) {
    res.append("Access-Control-Allow-Origin", "*");
    connection.query("SELECT * FROM comment WHERE a_id="+req.body.id, function (error, results, fields) {
        res.send(results);
    })
})
app.listen(5656)
console.log("开启服务器");