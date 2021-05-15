
const CHANNEL = "llas-base";
const ICON = ":thinking_face:";
const USER_NAME = "test";
let numAttachments;
const templateString = ({index}) => `<div id="attachment_${index}">
<div id="numAttachments">Attachments: ${index}/5</div>
<form id="attachment">
    <!-- <font style="background-color:green">&nbsp;&nbsp;&nbsp;&nbsp;</font> -->
    <p>[title]</p>
    <p><input id="attachmentTitleForm_${index}" type="text" value=""></p>
    <p>[text]</p>
    <p><textarea id="attachmentTextForm_${index}" rows="2" cols="50" wrap="hard" value=""></textarea></p>
    <p>[image_url]</p>
    <p><input id="attachmentUrlForm_${index}" value=""></p>

    <select id="colorSelectionForm_${index}">
        <option value="green" style="background-color:green">green</option>
        <option value="blue" style="background-color:blue">blue</option>
        <option value="red" style="background-color:red">red</option>
    </select>
    <button id="setBtn_${index}">set</button>
    <button id="clearBtn_${index}">clear</button>
</form>
</div>`;

class Attachment {
    constructor(title, text, url, color){
        this.title = title; 
        this.text = text;
        this.url = url;
        this.color = color;
    }
}

// message text
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("setMessageBtn").addEventListener("click", () => {
        let messageTextForm = document.getElementById("messageTextForm");
        chrome.storage.local.set({"messageText": messageTextForm.value}, () => {
        });
    });
});


chrome.storage.local.get("messageText", (property) => {
    let messageTextForm = document.getElementById("messageTextForm");
    messageTextForm.value = property["messageText"];
});


// setBtn_1
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("setBtn_1").addEventListener("click", () => {
        let titleForm = document.getElementById("attachmentTitleForm_1");
        let textForm = document.getElementById("attachmentTextForm_1");
        let urlForm = document.getElementById("attachmentUrlForm_1");
        let colorForm = document.getElementById("colorSelectionForm_1");
        let attachment = new Attachment(titleForm.value, textForm.value, urlForm.value, colorForm.value);
        chrome.storage.local.set({"Attachment_1": attachment}, () => {
            alert(attachment.title + "/" + attachment.text + "/" + attachment.url + "/" + attachment.color);
            titleForm.value = attachment.title;
            textForm.value = attachment.text;
            urlForm.value = attachment.url;
            colorForm.value = attachment.color;
        });
    });
});

// clearBtn_1
// clearBtn_1 is restore chrome.local.storage
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("clearBtn_1").addEventListener("click", () => {
        alert("clearBtn_1");
    });
});

// show 
chrome.storage.local.get("Attachment_1", (property) => {
    let titleForm = document.getElementById("attachmentTitleForm_1");
    let textForm = document.getElementById("attachmentTextForm_1");
    let urlForm = document.getElementById("attachmentUrlForm_1");
    let colorForm = document.getElementById("colorSelectionForm_1");
    let attachment = property["Attachment_1"];
    titleForm.value = attachment.title;
    textForm.value = attachment.text;
    urlForm.value = attachment.url;
    colorForm.value = attachment.color;
});

// send Slack
if ( document.getElementById("postBtn") ){
    let postBtn = document.getElementById("postBtn");
    postBtn.addEventListener("click", () => {
        chrome.storage.local.get(["messageText", "Attachment_1", "slackToken", "channel", "threadTs", "iconEmoji", "userName"], (property) => {
            let messageText = property["messageText"];
            let attachment = property["Attachment_1"];
            let slackToken = property["slackToken"];
            let channel = property["channel"];
            let threadTs = property["threadTs"];
            let iconEmoji = property["iconEmoji"];
            let userName = property["userName"];
            // send slack
            $(function(){
                $.ajax({
                    data: {
                        "token": slackToken,
                        "text": messageText,
                        "channel": channel,
                        "icon_emoji": iconEmoji,
                        "username": userName,
                        "link_names": true,
                        "attachments": JSON.stringify([
                            {
                                "fallback": "Attachment 1 Fallback",
                                "title": attachment.title,
                                "text": attachment.text,
                                "color": attachment.color,
                                "image_url": attachment.url
                            }
                        ]),
                        "thread_ts": threadTs
                    },
                    method: "POST",
                    url: "https://slack.com/api/chat.postMessage",
                    success: function(data) {
                        alert("success" + JSON.stringify(data));
                    },
                    error: function(response) {
                        alert("fail" + JSON.stringify(response));
                    }
                });
            });
        });
    });
}

// slack-token
if ( document.getElementById("slackToken") && document.getElementById("slackTokenBtn") ){
    let slackTokenText = document.getElementById("slackToken");
    let slackTokenBtn = document.getElementById("slackTokenBtn");
    // show the value which is stored in web storage
    chrome.storage.local.get(["slackToken"], function(property) {
        let tmp = property.slackToken;
        if ( tmp != null ){
            slackTokenText.innerHTML = "[slack_token] " + hide(tmp);
        } else {
            slackTokenText.innerHTML = "[slack_token] NULL";
        }
    });
    // set the value by pushing button
    slackTokenBtn.addEventListener("click", () => {
        let slackTokenForm = document.getElementById("slackTokenForm");
        chrome.storage.local.set({"slackToken": slackTokenForm.value}, () => {
            slackTokenText.innerHTML = "[slack-token] " + hide(slackTokenForm.value);
        });
    });
}

// hide token
function hide(token){
    let x = token.split("-");
    let a = x[0];
    let b = x[1];
    let c = x[2];
    let d = x[3];
    return a + "-" + b.slice(0,3) + "-" + c.slice(0,3) + "-" + d.slice(0,3);
}

// // channel 
if ( document.getElementById("channel") && document.getElementById("channelBtn") ){
    let channelText = document.getElementById("channel");
    let channelBtn = document.getElementById("channelBtn");
    chrome.storage.local.get(["channel"], function(property) {
        let tmp = property.channel;
        if ( tmp != null ){
            channelText.innerHTML = "[channel] " + tmp;
        } else {
            channelText.innerHTML = "[channel] NULL";
        }
    });
    channelBtn.addEventListener("click", () => {
        let channelForm = document.getElementById("channelForm");
        chrome.storage.local.set({"channel": channelForm.value}, () => {
            channelText.innerHTML = "[channel] " + channelForm.value;
        });
    });    
}

// thread_ts
if ( document.getElementById("threadTs") && document.getElementById("threadTsBtn") ){
    let threadTsText = document.getElementById("threadTs");
    let threadTsBtn = document.getElementById("threadTsBtn");
    chrome.storage.local.get(["threadTs"], function(property) {
        let tmp = property.threadTs;
        if ( tmp != null ){
            threadTsText.innerHTML = "[thread_ts] " + tmp;
        } else {
            threadTsText.innerHTML = "[thread_ts] NULL";
        }
    });
    threadTsBtn.addEventListener("click", () => {
        let threadTsForm = document.getElementById("threadTsForm");
        if (threadTsForm.value != Number(threadTsForm.value)){
            alert("please copy and pasete thread timestamp");
            return;
        }
        if (!threadTsForm.value.includes(".")) {
            threadTsForm.value = threadTsForm.value.slice(0, -6) + "." + threadTsForm.value.slice(-6)
        }
        // load new thread_ts value
        chrome.storage.local.set({"threadTs": threadTsForm.value}, () => {
            threadTsText.innerHTML = "[thread_ts] " + threadTsForm.value;
        });
    });
}

// icon emoji
if ( document.getElementById("iconEmoji") && document.getElementById("iconEmojiBtn") ){
    let iconEmojiText = document.getElementById("iconEmoji");
    let iconEmojiBtn = document.getElementById("iconEmojiBtn");
    chrome.storage.local.get(["iconEmoji"], (property) => {
        let tmp = property.iconEmoji;
        if ( tmp != null ){
            iconEmojiText.innerHTML = "[icon_emoji]] " + tmp;
        } else {
            iconEmojiText.innerHTML = "[icon_emoji] NULL";
        }
    });
    iconEmojiBtn.addEventListener("click", () => {
        let iconEmojiForm = document.getElementById("iconEmojiForm");
        chrome.storage.local.set({"iconEmoji": iconEmojiForm.value}, () => {
            iconEmojiText.innerHTML = "[icon_emoji] " + iconEmojiForm.value;
        });
    });
}

// bot name
if ( document.getElementById("userName") && document.getElementById("userNameBtn") ){
    let userNameText = document.getElementById("userName");
    let userNameBtn = document.getElementById("userNameBtn");
    chrome.storage.local.get(["userName"], (property) => {
        let tmp = property.userName;
        if ( tmp != null ){
            userNameText.innerHTML = "[userName]] " + tmp;
        } else {
            userNameText.innerHTML = "[userName] NULL";
        }
    });
    userNameBtn.addEventListener("click", () => {
        let userNameForm = document.getElementById("userNameForm");
        chrome.storage.local.set({"userName": userNameForm.value}, () => {
            userNameText.innerHTML = "[userName] " + userNameForm.value;
        });
    });
}

if ( document.getElementById("addBtn") ){
    let addBtn = document.getElementById("addBtn");
    addBtn.addEventListener("click", () => {
        if (numAttachments >= 5){
            alert("Attachments must be less than 5");
        }else{
            numAttachments++;
            let latestAttachment = document.getElementById("output_" + numAttachments);
            latestAttachment.innerHTML = "<hr>" + templateString({i: numAttachments});
            chrome.storage.local.set({"numAttachments": numAttachments}, () => {
                
            });
        }
    });
}

