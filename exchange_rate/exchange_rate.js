const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");

var jp = function() {
  request({
    url: "https://rate.bot.com.tw/xrt?Lang=zh-TW",
    method: "GET"
  }, function(error, response, body) {

    if (error || !body) {
      console.log('404');
      return;
    }else{

    // 爬完網頁後要做的事情
        console.log('200')
        const data = [];
        const $ = cheerio.load(body); //載入body
        const list = $(".table-bordered tbody tr"); //尋找 class>tbody>tr
        console.log(list.length);
        for (let i = 0; i < list.length; i++) {
            const currency = list.eq(i).find("[class='visible-phone print_hide']").text().replace(/\n/g, '').trim();
            const cash = list.eq(i).find("[class='rate-content-cash text-right print_hide']");
            const spot = list.eq(i).find("[class='rate-content-sight text-right print_hide hidden-phone']");
            const cash_bid = cash.eq(0).text();
            const cash_ask = cash.eq(1).text();
            const spot_bid = cash.eq(0).text();
            const spot_ask = cash.eq(1).text();
            data.push({currency, cash_bid, cash_ask, spot_bid, spot_ask});

        }
        console.log(data);
        fs.writeFileSync("exchange_rate.json", JSON.stringify(data))  //寫入檔案
    }
  });
};

jp();
