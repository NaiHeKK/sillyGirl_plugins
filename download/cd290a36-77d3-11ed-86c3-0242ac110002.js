/**
* @author YuanKK
* @create_at 2022-09-08 21:46:36
* @description 🐒执行青龙2.13.9以后才有的订阅任务
* @version v1.0.0
* @title 执行青龙订阅与脚本
* @rule 开始订阅 ?
* @rule ql cron run ?
* @admin true
 * @public false
* @priority 9999
*/

//sender
const s = sender
const qinglong = new Bucket("qinglong")
let clients = JSON.parse(qinglong.get("QLS"))
let keyword = s.param(1)
let msg = s.getContent()

function main() {
    for (let i = 0; i < clients.length; i++) {
        // 获取青龙Token
        let host = clients[i].host
        let token = getQLToken(clients[i].host, clients[i].client_id, clients[i].client_secret)
        if (token == null || token == "") {
            s.reply(`容器【${clients[i].name}】连接失败，请检查相关设置！！！！`)
            continue
        }
        // 执行订阅函数
        if (msg.indexOf("开始订阅") != -1) {
            doSub(host, token, clients[i].name)
        } else {
            // 执行脚本函数
            doRunScript(host, token, clients[i].name)
        }

    }
}

main()


/**************青龙api************/
//获取青龙token
function getQLToken(host, clientId, clientSecret) {
    try {
        let data = request({ url: host + "/open/auth/token?client_id=" + clientId + "&client_secret=" + clientSecret, dataType: "json" }).body
        return data.data
    }
    catch (err) {
        return null
    }
}

// 获取订阅任务列表
function getQLSubscriptionList(host, token) {
    try {
        let data = request({
            url: host + "/open/subscriptions",
            method: "get",
            headers: {
                Authorization: token.token_type + " " + token.token,
                "content-Type": "application/json"
            },
            dataType: "json",
        }).body
        return data.data
    } catch {
        return []
    }
}

// 执行订阅
function startQLSubscription(host, token, subscriptionIds) {
    try {
        let resp = request({
            url: host + "/open/subscriptions/run",
            method: "put",
            headers: {
                Authorization: token.token_type + " " + token.token,
            },
            body: subscriptionIds,
            dataType: "json",
        })
        if (!resp.body.code == 200) {
            return false
        }
        return true
    } catch {
        return false
    }
}

// 获取订阅任务状态
function getQLSubscriptionStatus(host, token, subscriptionId) {
    try {
        let status = request({
            url: host + "/open/subscriptions/" + subscriptionId,
            method: "get",
            headers: {
                Authorization: token.token_type + " " + token.token,
                "content-Type": "application/json"
            },
            dataType: "json",
        }).body.data.status
        return status
    } catch {
        return null
    }
}

// 获取所有任务，返回所有任务对象数组
function getQLCrons(host, token) {
    try {
        let data = request({
            url: host + "/open/crons?page=1&size=99999&t=1&searchText=",
            method: "get",
            headers: {
                accept: "application/json",
                Authorization: token.token_type + " " + token.token
            },
            dataType: "json",
        }).body
        try {
            return data.data.data
        } catch {
            return data.data
        }
    }
    catch (err) {
        return null
    }
}

// 立即执行任务id,id为数组
function startQLCrons(host, token, id) {
    try {
        let data = request({
            url: host + "/open/crons/run",
            method: "put",
            headers: {
                accept: "application/json",
                Authorization: token.token_type + " " + token.token,
                contentType: "application/json"
            },
            body: [id],
            dataType: "json",
        }).body
        if (data.code == 200)
            return true
        else
            return false
    }
    catch (err) {
        return false
    }
}

// 获取任务状态
function getCronStatus(host, token, id) {
    try {
        let status = request({
            url: host + "/open/crons/" + id,
            method: "get",
            headers: {
                Authorization: token.token_type + " " + token.token,
                "content-Type": "application/json"
            },
            dataType: "json",
        }).body.data.status
        return status
    } catch {
        return null
    }
}
/** ------------------------------------------------------------------------------------ */

// 获取订阅任务ID
function getSubscriptionId(subscriptionList) {
    let subscriptionIds = []
    for (let i = 0; i < subscriptionList.length; i++) {
        if (subscriptionList[i].name.indexOf(keyword) != -1) {
            if (subscriptionList[i].status == 0) {
                s.reply(`容器【${clients[i].name}】中名为[${keyword}]的订阅任务正在执行中！！！！`)
                break
            }
            subscriptionIds.push(subscriptionList[i].id)
            break
        }
    }
    return subscriptionIds
}

// 执行订阅
function doSub(host, token, name) {
    // 获取订阅任务列表
    let subscriptionList = getQLSubscriptionList(host, token)

    // 获取订阅任务ID
    let subscriptionIds = getSubscriptionId(subscriptionList)

    if (subscriptionIds.length == 0) {
        s.reply(`容器【${name}】未找到名为[${keyword}]的订阅任务！！！！`)
        return
    }

    // 执行订阅
    if (!startQLSubscription(host, token, subscriptionIds)) {
        s.reply(`容器【${name}】中的订阅任务[${keyword}]执行失败，未知错误请自行调试！`)
        return
    }
    sleep(2000)
    while (true) {
        let status = getQLSubscriptionStatus(host, token, subscriptionIds[0])
        if (status == 1) {
            s.reply(s.reply(`容器【${name}】中的订阅任务[${keyword}]已完成！！！！`))
            break
        } else if (status == null) {
            s.reply(s.reply(`容器【${name}】中的订阅任务[${keyword}]状态获取失败。退出脚本！！！！`))
            return
        }
        sleep(2000)
    }
}

// 执行脚本
function doRunScript(host, token, name) {
    // 所有的定时任务
    let crons = getQLCrons(host, token)

    if (crons == null) {
        s.reply(`容器【${name}】获取定时任务失败！！`)
        return
    }

    let keywards = keyword.split(" & ")
    let ids = [], names = []//记录需要执行的任务
    keywards.forEach(item => {
        let find = false
        for (let i = 0; i < crons.length; i++) {
            if (crons[i].command.indexOf(item) != -1 || crons[i].name.indexOf(item) != -1) {
                if (crons[i].id)
                    ids.push(crons[i].id)
                else
                    ids.push(crons[i]._id)
                names.push(crons[i].name)
                find = true
            }
        }
        if (!find) {
            s.reply(`容器【${name}】中未找到任务：${item}！！`)
            return
        }
    })


    while (ids.length > 0) {
        for (let i = ids.length - 1; i >= 0; i--) {
            let status = getCronStatus(host, token, ids[i])
            if (status == 1) {
                startQLCrons(host, token, ids[i])
                s.reply(`开始执行容器【${name}】中的：${names[i]}}！！`)
                ids.splice(i, 1)
            }
        }
        sleep(60000)
    }
}