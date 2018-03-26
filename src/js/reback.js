 //将文章状态从1变为0
 function del(params){
    $.ajax({
        type:"post",
        url:"http://localhost:5656/del",
        data:{
            article_title:params
        }
    }).then(function(res){
        //console.log(res);
    })

}
//执行点击修改文件在的效果,status变为1
function reback(params){
    $.ajax({
        type:"post",
        url:"http://localhost:5656/reback",
        data:{
            article_title:params
        }
    }).then(function(res){
        console.log(res);
    })
       
}
//将文章数据库中的信息汇总删除

function remove(params){
    $.ajax({
        type:"post",
        url:"http://localhost:5656/remove",
        data:{
            article_title:params
        }
    }).then(function(res){
        // console.log(res);
    })
}