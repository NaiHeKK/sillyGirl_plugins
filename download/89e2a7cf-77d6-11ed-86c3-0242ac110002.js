/**
* @author YuanKK
* @create_at 2022-09-08 10:48:48
* @description 🐒青蛙开卡脚本监控，配合[执行青龙订阅与脚本]使用
* @title 青蛙开卡脚本监控
* @rule raw (gua_opencard[\d]{3}.js)
* @priority 100
 * @public false
* @admin false
* @disable false
* @version v1.0.0
*/


const s = sender;
//sillyGirl
const sillyGirl = new SillyGirl()

let msg = s.getContent()

let reg = /gua_opencard[\d]{3}.js/g
let result = msg.match(reg)

let ignoreChatIds = [-1001675558305]
function main() {
    // 跳过通知群组
    if (ignoreChatIds.indexOf(s.getChatId) != -1) {
        return
    }
    let scriptFileName = result.join(" & ")

    notify("检测到青蛙开卡脚本，执行订阅任务：青蛙开卡")
    var { message } = sillyGirl.session("开始订阅 青蛙开卡")()
    if (message.indexOf("已完成") != -1) {
        notify("订阅任务已完成开始执行脚本：" + scriptFileName)
        s.createSender({ content: 'ql cron run ' + scriptFileName })
    }

}

function notify(msg) {
    let spyGroupNotify = new Bucket("SpyGroupNotify")
    let toType = spyGroupNotify.keys()
    for (let i = 0; i < toType.length; i++) {
        let ids = spyGroupNotify.get(toType[i]).split("&")
        if (ids == "")
            continue
        for (let j = 0; j < ids.length; j++) {
            sillyGirl.push({
                platform: toType[i],
                chatID: ids[j],
                content: msg,
            })
        }
    }
}

main()