const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const url = 'https://www.ptt.cc/bbs/Beauty/M.1607086543.A.67C.html';

var download = function(url){
  request({
      url: url,
      method: "GET",
      headers:{
        Cookie:'over18=1' //設置 Cookie
    }
  }, function(error, response, body){
    if (error || !body){
      console.log('error');
      return;
    } else {
        console.log('request successfully');
        const $ = cheerio.load(body);
        const statsTable = $('.bbs-content.bbs-screen a'); //找尋符合條件的tag, ex: class = bbs-content bbs-screen

        fs.exists('./picture/', function(exists){ //如果資料夾不存在就設置資料夾
          if (exists){
            console.log('picture dir exists.');
          } else {
              fs.mkdir('./picture/');
              console.log('mkdir picture');
          }
        });

        statsTable.each(function() {          //針對statsTable內的每一個元素進行函式內的操作
            const href = $(this).text()       //找到有包含連結的文字
            if (href.search('.jpg') != -1){   //只抓取jpg檔案
            console.log(href);

            const split_name = href.split('/');   //以連結最後一段當做檔案的命名
            const filename = split_name[split_name.length-1];
            console.log(filename);

            var readStream = request(href);   //對連結要求存取
            var writeStream = fs.createWriteStream('./picture/'+filename);  //寫入電腦
            readStream.pipe(writeStream);
            readStream.on('end', function() {
              console.log(filename + '下载成功');
            });
            readStream.on('error', function() {
              console.log("错误信息:" + err)
            })
            writeStream.on("finish", function() {
              console.log(filename + "寫入成功");
              writeStream.end();
            });
          }
        }
      );
    }
  });
}

download(url);
