chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.todo == "showPageAction") {
    chrome.pageAction.show(sender.tab.id);
  }
});

chrome.storage.sync.get("isInit", function(res) {
  if (res.isInit == null) {
    //Set isInit to 1
    chrome.storage.sync.set({ isInit: 1 }, function() {
      console.log("Set isInit to 1");
    });

    //Set LoadTime
    chrome.storage.sync.set({ loadTime: 2000 }, function() {
      console.log("Set up default loadTime!");
    });
  }
});
