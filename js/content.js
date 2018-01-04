var isWSExtensionEnabled = false;

window.onload = function() {
    checkContactList();
}

/**
 * Check contacts
 */
function checkContactList() {
    var contactList = document.getElementsByClassName("infinite-list-item");
    if (contactList.length > 0) {
        addMonitoringFeature(contactList);
    }
    setTimeout(checkContactList, 100);
}
/**
 * Add monitoring feature for each contact
 */
function addMonitoringFeature(contactList) {
    for (var i=0; i<contactList.length; i++) {
        contactList[i].onclick = function(evt) {
            startMonitoring(evt.target.closest(".chat-body").childNodes[0].childNodes[0].innerText);
        }
    }
}

function startMonitoring(contactName) {
    var messageList = document.getElementsByClassName("message-list")[0];
    messageList.addEventListener("DOMNodeInserted", function(evt) {
        if ($(evt.target).attr("class") != "msg") return;
        if (!isWSExtensionEnabled) return;

        var messageBody = $(evt.target).find(".message.message-chat")[0];
        var messageText = "";
        var timeStamp   = ""; 

        //MessageText
        if ($(messageBody).find(".emojitext.selectable-text")[0] != undefined) {
            messageText = $(messageBody).find(".emojitext.selectable-text")[0].innerText.replace(/\s/g, '');
        }

        //TimeStamp
        if ($(messageBody).find(".message-datetime")[0] != undefined) {
            var timeString = $(messageBody).find(".message-datetime")[0].innerText;
            var d = (new Date()).getTime();
            var timeReg = /(\d+)\:(\d+) (\w+)/;
            var parts = timeString.match(timeReg);
            var hours = 0;
            if (parts[3] == "AM") {
                hours = (parseInt(parts[1], 10) < 12) ? parseInt(parts[1], 10) : 0;
            } else if (parts[3] == "PM") {
                hours = (parseInt(parts[1], 10) < 12) ? parseInt(parts[1], 10) + 12 : 12;
            }
            var minutes = parseInt(parts[2], 10);
            timeStamp =  new Date(d);
            timeStamp.setHours(hours);
            timeStamp.setMinutes(minutes);
            timeStamp = timeStamp.getTime() / 1000;
        }

        //send message to background.js
        if ($(messageBody).hasClass("message-out")) {
            console.log("Message Outgoing - ", contactName + ", " + messageText);
            console.log("TimeStamp - ", timeStamp);
        } else if ($(messageBody).hasClass("message-in")) {
            console.log("Message Incoming - ", contactName + ", " + messageText);
            console.log("TimeStamp - ", timeStamp);
        }
    });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "Enable") {
        isWSExtensionEnabled = true;
    } else if (request.action === "Disable") {
        isWSExtensionEnabled = false;
    }
});