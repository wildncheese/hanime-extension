document.getElementById("popup-title").innerHTML =
  "Hanime Image Viewer \nVersion: " + chrome.runtime.getManifest().version;

//Get isPaused if not null
chrome.storage.sync.get("isPaused", function(res) {
  //console.log(res);
  if (res.isPaused != null) {
    var test = res.isPaused == 1 ? "Paused" : "Running";
    $("span.info-isPaused").text("Currently: " + test);
  }
});

//SendMessage to toggle modal
$("button.btn-toggle").click(function() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { todo: "activateModal" });
  });
});

//Send message to pause carousel
$("button.btn-pause").click(function() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { todo: "pauseCarousel" });
    chrome.storage.sync.get("isPaused", function(res) {
      //console.log(res);
      var test = res.isPaused == 0 ? "Paused" : "Running";
      $("span.info-isPaused").text("Currently: " + test);
    });
  });
});

//send message to go to last page
$("button.btn-prev-page").click(function() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { todo: "prevPage" });
  });
});

//send message to go to next page
$("button.btn-next-page").click(function() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { todo: "nextPage" });
  });
});

$("button.btn-controls").click(function() {
  // Update status to let user know options were saved.
  var status = document.getElementById("controlss");
  if (status.style.display == "none") {
    status.style.display = "block";
  } else {
    status.style.display = "none";
  }
});

$("button.btn-options").click(function() {
  //Opens the options in a new tab -> not what we want atm!
  chrome.tabs.create({
    url: "chrome://extensions/?options=" + chrome.runtime.id
  });
});
