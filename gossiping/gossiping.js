const cheerio = require('cheerio');
const request = require('request');
const fs = require('fs');
const url = "https://www.ptt.cc/bbs/Gossiping/index.html";

var gossiping = function() {
  request({
    url: "https://www.ptt.cc/bbs/Gossiping/index.html",
    method: "GET",
    headers:{
      Cookie:'over18=1' //設置 Cookie
    }
  }, function(error, response, body) {

    if (error || !body) {
      console.log('404');
      return;
    }else{
      console.log('200');
      const $ = cheerio.load(body);
      const statsTable = $('.r-ent'); //找尋符合條件的tag, ex: class = r-ent
      const data = [];
      statsTable.each(function() {  //針對statsTable內的每一個元素進行函式內的操作
          const title = $(this).find('.title a').text();  //元素以 $(this)表示
          const href = $(this).find('.title a').attr('href'); // 取用attr的值
          const date = $(this).find('.meta .date').text();
          const author = $(this).find('.meta .author').text();
          data.push({title, href, author, date});
      });
      console.log(data);
      fs.writeFileSync("gossiping.json", JSON.stringify(data));
    }
  });
};

gossiping()
