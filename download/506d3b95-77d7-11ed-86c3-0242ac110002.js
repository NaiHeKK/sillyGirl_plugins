/**
* @author YuanKK
 * @version v1.0.0
* @create_at 2022-09-07 23:19:05
* @description 🐒国外机有可能用不了,等待修正
* @title 随机cosplay
* @platform qq wx tg pgm web
* @rule ^cos$
* @rule ^COS$
* @disable false
 * @public false
*/

//sender
const s = sender

var data = request({
    // 内置http请求函数
    url: "http://ovooa.com/API/cosplay/api.php", //请求链接
    method:"POST",
    headers:{
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36"
    }
});
console.log(data)

s.reply(image(data))