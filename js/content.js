//EVENTS
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.todo == "activateModal") {
    //Bring up modal!
    $("div.hviewer-modal").modal("toggle");
  }

  if (request.todo == "pauseCarousel") {
    ToggleCarousel(); //Toggle carousel on and off
  }

  //This doesn't check if the page exists..
  if (request.todo == "prevPage") {
    PrevPage(); //Move to prev page
  }

  //This doesn't check if the page exists..
  if (request.todo == "nextPage") {
    NextPage(); // Move to next page
  }
});

//Send Message to show the UI on the popup!
chrome.runtime.sendMessage({ todo: "showPageAction" });

var loadTime = 0;

//Create the modal with controls

// hviewer-modal
$("#__nuxt").append(
  "<div class='modal fade hviewer-modal' tabindex='-1' aria-hidden='true' ></div>"
);
//console.log("Created :: hviewer-modal");

//modal-dialog
$("div.hviewer-modal").append("<div class='modal-dialog modal-xl'></div>");
//console.log("Created :: modal-dialog");

//modal-content
$("div.modal-dialog").append("<div class='modal-content'></div>");
//console.log("Created :: modal-content");

//carouselControls
$("div.modal-content").append(
  "<div id='carouselControls' class='carousel slide'></div>"
);
//console.log("Created :: carouselControls");

//carousel-inner
$("#carouselControls").append("<div class='carousel-inner'</div>");
//console.log("Created :: carousel-inner");

//CONTROLS

//previous button
$("div.modal-content").append(
  "<a id='a-prev-hviewer' class='carousel-control-prev' href='#carouselControls' role='button' data-slide='prev'></a>"
);
//console.log("Created :: previous button");

//prev icon
$("#a-prev-hviewer").append(
  "<span class='carousel-control-prev-icon' aria-hideen='true'></span>"
);
$("#a-prev-hviewer").append("<span class='sr-only'>Previous</span>");
//console.log("Created :: prev icon");

//next button
$("div.modal-content").append(
  "<a id='a-next-hviewer' class='carousel-control-next' href='#carouselControls' role='button' data-slide='next'></a>"
);
//console.log("Created :: next button");

//next icon
$("#a-next-hviewer").append(
  "<span class='carousel-control-next-icon' aria-hideen='true'></span>"
);
$("#a-next-hviewer").append("<span class='sr-only'>Next</span>");
//console.log("Created :: next icon");

//Check if Arrows left + right are pressed
// - move carousel in either direction
$("body").keydown(function(e) {
  if (e.keyCode == 37) {
    // left
    $("div.carousel").carousel("prev"); // Go to prev image
  } else if (e.keyCode == 39) {
    // right
    $("div.carousel").carousel("next"); // Go to next iamge
  } else if (e.keyCode == 38) {
    //Up
    NextPage(); //Move to next page
  } else if (e.keyCode == 40) {
    e.preventDefault();
    //Down
    PrevPage(); //Move to prev page
  } else if (e.key === " " || e.key === "Spacebar") {
    e.preventDefault();
    ToggleCarousel();
  } else if (e.keyCode == 79) {
    //Toggle modal
    $("div.hviewer-modal").modal("toggle");
  }
});

function SendMessage() {
  // console.log("Done!");
  chrome.storage.sync.get("wasOpen", function(res) {
    //console.log(res.wasOpen);
    //Check if it was left open. Open it when the new page has loaded!
    if (res.wasOpen == 1) {
      //Bring up modal!
      $("div.hviewer-modal").modal("toggle");
    }
  });
}

function NextPage() {
  let currURL = document.URL;
  let getNumber = /\d*\d/.exec(currURL);
  let defaultURL;
  let page;
  let nextPage;
  let nextURL;
  if (getNumber != null) {
    defaultURL = currURL.substring(0, currURL.length - getNumber[0].length); // This is coming up as null since browse doesn't have ?pages=1 to begin with!
    page = parseInt(getNumber[0]);
    nextPage = page + 1;
    nextURL = defaultURL + nextPage;
  } else {
    nextURL = currURL + "?page=2";
  }

  //console.log("nextURL " + nextURL);
  if ($("div.hviewer-modal").is(":visible")) {
    chrome.storage.sync.set({ wasOpen: 1 }, function() {
      //Store that the modal was open!
    });
  } else {
    chrome.storage.sync.set({ wasOpen: 0 }, function() {
      //Store wasn't open
    });
  }
  window.location.href = nextURL;
}

function PrevPage() {
  let currURL = document.URL;
  let getNumber = /\d*\d/.exec(currURL);
  let defaultURL = currURL.substring(0, currURL.length - getNumber[0].length);
  let page = parseInt(getNumber[0]);
  let prevPage = page - 1;
  if (prevPage < 1) prevPage = 1;

  let prevURL = defaultURL + prevPage;

  //console.log("prevURL " + prevURL);
  if ($("div.hviewer-modal").is(":visible")) {
    chrome.storage.sync.set({ wasOpen: 1 }, function() {
      //Store that the modal was open!
    });
  } else {
    chrome.storage.sync.set({ wasOpen: 0 }, function() {
      //Store that the modal was open!
    });
  }

  window.location.href = prevURL;
}

function ToggleCarousel() {
  chrome.storage.sync.get("isPaused", function(res) {
    if (res != null) {
      if (res.isPaused == 1) {
        //Resume
        chrome.storage.sync.set({ isPaused: 0 }, function() {
          $("div.carousel").carousel("cycle");
        });
      } else {
        //Pause
        chrome.storage.sync.set({ isPaused: 1 }, function() {
          $("div.carousel").carousel("pause");
        });
      }
    } else {
      chrome.storage.sync.set({ isPaused: 1 }, function() {
        $("div.carousel").carousel("pause");
      });
    }
  });
}

chrome.storage.sync.get("loadTime", function(res) {
  if (res.loadTime != null) {
    loadTime = res.loadTime;
  } else {
    loadTime = 2000;
    chrome.storage.sync.set({ loadTime: 2000 }, function() {
      //console.log("Set loadTime to 2000");
    });
  }
  //console.log("Current LoadTime: " + loadTime);
  setTimeout(function() {
    var element = document.getElementsByClassName("carousel-inner");
    let fragment = document.createDocumentFragment();
    let imgs = document.getElementsByClassName("cuc grows");
    for (var i = 0; i < imgs.length; i++) {
      //let href = $(imgElt).attr("href");
      let href = imgs[i].href;

      if (i == 0) {
        var e = document.createElement("div");
        e.className = "carousel-item active";
        e.id = "img" + i;

        var img = document.createElement("img");
        img.className = "d-block w-100";
        img.src = href;
        e.appendChild(img);

        fragment.appendChild(e);
      } else {
        var e = document.createElement("div");
        e.className = "carousel-item";
        e.id = "img" + i;

        var img = document.createElement("img");
        img.className = "d-block w-100";
        img.src = href;
        img.style = "object-fit: contain";
        e.appendChild(img);

        fragment.appendChild(e);
      }
    }
    $(element).append(fragment);
    //console.timeEnd("test");
    SendMessage();
  }, loadTime);
});
