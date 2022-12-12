/**
 * @title 消息撤回模块
 * @description 🐒解决go-cqhttp无法撤回的问题
 * @create_at 2022-12-12 13:49:17
 * @author 佚名
 * @version v1.0.0
 * @public false
 * @module true
 */

module.exports = {
	recallMessage: recallMessage
}

function recallMessage() {
    let length = arguments.length;
    let recallIds = [];
    for (let i = 0; i < length; i++) {
        let messageId = arguments[i];
        recallIds.push(isNaN(messageId) || typeof(messageId) == "number" ? messageId: (+messageId).toString())
    }
    s.recallMessage(recallIds)
}