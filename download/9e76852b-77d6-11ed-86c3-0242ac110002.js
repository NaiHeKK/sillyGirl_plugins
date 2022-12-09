/**
* @author YuanKK
 * @version v1.0.0
* @create_at 2022-09-07 23:19:59
* @description 🐒这个人很懒什么都没有留下。
* @title 自动撤回
* @platform qq wx tg pgm web
* @rule ?
* @rule 自动撤回设置
* @rule 开启自动撤回
* @rule 关闭自动撤回
 * @public false
*/

//sender
const s = sender
const autoReCall = new Bucket("autoReCall")
function main() {
    let msg = s.getContent()
    let keyWordsObject = autoReCall.get("keyWords")
    let keyWords = []
    if (keyWordsObject != "") {
        keyWords = JSON.parse(keyWordsObject)
    }
    let groupIdsObject = autoReCall.get("groupIds")
    let groupIds = []
    if (groupIdsObject != '') {
        groupIds = JSON.parse(groupIdsObject)
    }
    // 群组ID
    let groupId = s.getChatId()
    // 是否是自动撤回的群组
    let existFlg = groupIds.includes(groupId);
    if (msg == "自动撤回设置") {
        if (!s.isAdmin()) {
            s.reply("此命令非管理员不可用！！！！")
            return
        }
        let limit=24
        const WAIT = 60*1000 
        let inp=1//随便什么值，非空即可
        while(true){
            if(limit--<0){
                s.reply("由于您长时间未操作，已自动退出，数据未保存")
                return
            }
            if(inp != "")	
                printAutoReCallList(keyWords)
            inp=input(WAIT)
            if (inp == "q") {
                s.reply("请确认是否保存？输入\"是\"保存")
                if(input(WAIT)=="是")
                    s.reply(SaveData("keyWords", keyWords))
                else
                    s.reply("未保存本次修改内容")
                break
            } else if (inp == "wq") {
				s.reply(SaveData("keyWords", keyWords))
			break
            } else if (inp == "0") {
                let keyWord = {
                    desc: "",
                    value: ""
                }
                s.reply("请输入新添加的自动撤回关键词：")
                keyWord.value = input(WAIT)
                s.reply("请输入新添加的自动撤回关键词说明：")
                keyWord.desc = input(WAIT)
                keyWords.push(keyWord)
            } else if (inp < 0) {
                try{
                    keyWords.splice(Math.abs(inp)-1,1)
                } catch(err) {
                    s.reply("输入有误，请重新输入")
                }
            }
		}
    } else if(msg == "开启自动撤回" || msg == "关闭自动撤回") {
        if (!s.isAdmin()) {
            s.reply("此命令非管理员不可用！！！！")
            return
        }
        if (s.getChatId() != 0) {
            if (!existFlg && msg == "开启自动撤回") {
                groupIds.push(groupId)
                SaveData("groupIds", groupIds)
                s.reply("已开启自动撤回！")
            }
            if (existFlg && msg == "关闭自动撤回") {
                groupIds.splice(groupIds.indexOf(groupId), 1)
                SaveData("groupIds", groupIds)
                let id = s.reply("已关闭自动撤回！")
            }
        } else {
            s.reply("请在群组里使用！")
        }
    } else {
        if (s.getChatId() != 0 && existFlg) {
            keyWords.forEach(function (keyword) {
                let reg = new RegExp(keyword.value)
                let result = msg.match(reg)
                if (result != '' && result != null) {
                    const messageId = s.getMessageId()
                    console.log(`消息ID：${messageId}`)
                    s.recallMessage(s.getMessageId())
                    let id = s.reply(`命中关键词${keyword.value}(${keyword.desc})，已撤回`)
                    sleep(10000)
                    s.recallMessage(id)
                }
            })
        }
    }
}

// 打印自动撤回关键词列表
function printAutoReCallList(keyWords){
	let notify="请选择自动撤回关键词进行编辑：\n(-数字删除,0添加,q退出，wq保存)\n"
	for(let i=0;i<keyWords.length;i++){
		notify+=(i+1)+"、"+keyWords[i].value+ `(${keyWords[i].desc})` + "\n"
	}
	s.reply(notify)
}

//保存数据
function SaveData(key, value){
	try{
		autoReCall.set(key,JSON.stringify(value))
		return "已保存本次修改"
	}
	catch(err){
		return "保存失败"
	}		
}

// 获取输入
function input(wait) {
	let temp = s.listen(function (s) {
	}, wait)
	if (temp == null) {
		return ''
	} else {
		return temp.getContent()
	}
}

main()
s.continue()