$(function () {
    $.ajax({
        url: "http://localhost:5656/index",
        type: "post",
    }).then(function (res) {
        for(var i=0;i<res.length;i++){
            var str = '';
            str+='<li><a href="index_article.html?a_id='+res[i].a_id+'">'+(i+1)+'.'+res[i]["article_title"]+'</a></li>'
            $(".newart>ul").append(str);
        }
    })
})