var express = require('express');
var multer = require('multer');
var str=""
var storage = multer.diskStorage({
    // 上传文件夹
    destination: function (req, file, cb) {
        cb(null, '../img/bgimg')
    },
    // 保存的文件名字
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname)
        str=Date.now() + "-" + file.originalname
    },

})


var upload = multer({
    storage: storage
})
//实例化第一个express的应用
var app = express();
app.post('/getimg', upload.any(), function (req, res) {
    res.append("Access-Control-Allow-Origin", "*");
    res.send(str);
});
app.listen(8888);