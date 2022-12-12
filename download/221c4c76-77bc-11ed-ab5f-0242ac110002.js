/**
* @author YuanKK
 * @version v1.0.0
* @create_at 2022-09-07 23:05:40
* @description 随机抖音视频
* @title 扭一扭
* @rule ^nyn$
* @rule ^扭一扭$
 * @public false
*/

//sender
const s = sender

var url = "https://v.nrzj.vip/video.php"
var {headers} = request({
        url: url,
        method:"get",
        allowredirects: false,
        headers:{
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36"
        }
    })
console.log(headers.Location[0])
s.reply(video(headers.Location[0]))