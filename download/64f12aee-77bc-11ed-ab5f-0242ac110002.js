/**
* @author YuanKK
 * @version v1.0.0
* @create_at 2022-09-07 23:14:19
* @description 🐒这个人很懒什么都没有留下。
* @title 二次元
* @rule ^ACG$
* @rule ^二次元$
* @rule ^acg$
 * @public false
*/

const recall = require("消息撤回模块")
//sender
const s = sender

function main() {
    let { headers, status } = request({
        url: "https://api.ghser.com/random/api.php",
        method: "get",
        allowredirects: false,
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36"
        }
    });
    if ([302, 304].indexOf(status) != -1) {
        let data = request({
            url: "https://api.ghser.com/random/" + headers.Location,
            method: "get",
            allowredirects: false,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36"
            }
        });
        var id = s.reply(image(data.headers.Location))
        recall.recallMessage(s.getMessageId(), id, 20000)
    }
}
main()