var isEnabled = false;
chrome.browserAction.onClicked.addListener(function(){
    if (isEnabled) {
        sendMessage({action: "Disable"});
        chrome.browserAction.setIcon({
            path: "img/icon_disabled.png"
        });
    } else {
        sendMessage({action: "Enable"});
        chrome.browserAction.setIcon({
            path: "img/icon_enabled.png"
        });
    }
    isEnabled = !isEnabled;
});

function sendMessage(message) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        if (tabs[0].url.indexOf("web.whatsapp.com") > -1) {
            chrome.tabs.sendMessage(tabs[0].id, message, function(response){
            });
        }
    });
}
