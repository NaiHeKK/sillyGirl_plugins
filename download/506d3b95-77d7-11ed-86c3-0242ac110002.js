/**
* @author YuanKK
 * @description 🐒这个人很懒什么都没有留下。
 * @version v1.0.0
* @create_at 2022-09-07 23:19:05
* @title 随机cosplay
* @platform qq wx tg pgm web
* @rule cos [张数]
* @rule cos
* @rule COS [张数]
* @rule COS
* @disable false
 * @public false
*/

const recall = require("消息撤回模块")
//sender
const s = sender

console.log(`消息平台：${s.getPlatform()}`)
let num = parseInt(s.param("张数"))

var {body} = request({
    // 内置http请求函数
    url: "http://ovooa.com/API/cosplay/api.php", //请求链接
    method:"POST",
    headers:{
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36"
    }
});
let bodyObj = JSON.parse(body)
if(bodyObj.code == "1") {
    let Title = bodyObj.data.Title
    let data = bodyObj.data.data
    num = isNaN(num) || num > data.length? data.length: num;
    let id = s.reply(`${Title}(总共${data.length}张),即将发送前${num}张！`)
    for (let i = 0; i < num; i++) {
        recall.recallMessage(s.reply(`${image(data[i])}`), 10000)
        sleep(10000)
    }
    recall.recallMessage(s.reply("发送结束"), id, s.getMessageId(), 3000)
}