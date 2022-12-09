/**
 * @title Faker订阅更新
 * @create_at 2022-10-27 20:33:11
 * @description 将【sillyGirl.session("开始订阅 Faker 助力池版")】中的'Faker 助力池版'改为Faker仓库订阅名
 * @author YuanKK
 * @version v1.0.0
 * @rule raw [\s\S]*?Faker维护仓库[\s\S]*?
 * @public false
 */

// ignoreChatIds 添加需要忽略的群组id
// 默认通知到白眼设置的静默通知群组

//sillyGirl
const sillyGirl = new SillyGirl()
const s = sender;

let ignoreChatIds = [-1001675558305]
function main() {
    // 跳过通知群组
    if (ignoreChatIds.indexOf(s.getChatId()) != -1) {
        return
    }

    notify("检测到Faker仓库更新，执行订阅任务：Faker 助力池版")
    var { message } = sillyGirl.session("开始订阅 Faker 助力池版")()
    if (message.indexOf("已完成") != -1) {
        notify("订阅任务已完成！！！")
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