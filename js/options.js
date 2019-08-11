var CurrentSelected = 0;

//Get loadTime from storage
chrome.storage.sync.get("loadTime", function(res) {
  //console.log("Loaded LoadTime: " + res.loadTime);
  $("span.current-loadTime").text(
    "Current LT: " + res.loadTime / 1000 + "/Sec"
  );
});

//Show hide options!
$("#inputLoadTime").change(function() {
  var selected = $(this)
    .children("option:selected")
    .val();

  CurrentSelected = selected;

  if (selected == 4) {
    $("div.settings-custom").show();
  } else {
    $("div.settings-custom").hide();
  }
});

$("button.btn-submit-settings").click(function() {
  GetResult(CurrentSelected);
});

function GetResult(_seleceted) {
  var test = parseInt(_seleceted);
  switch (test) {
    case 1:
      SaveOptions(1000);
      break;
    case 2:
      SaveOptions(2000);
      break;
    case 3:
      SaveOptions(4000);
      break;
    case 4:
      let customeInput = $("#custom-time-input").val();
      SaveOptions(customeInput);
      break;
  }
}

//Save options
function SaveOptions(res) {
  //console.log("Saving..." + res);
  chrome.storage.sync.set(
    {
      loadTime: res
    },
    function() {
      // Update status to let user know options were saved.
      var status = document.getElementById("saved");
      status.style.display = "block";
      setTimeout(function() {
        status.style.display = "none";
      }, 750);

      //Get loadTime from storage
      chrome.storage.sync.get("loadTime", function(res) {
        $("span.current-loadTime").text(
          "Current LT: " + res.loadTime / 1000 + "/Sec"
        );
      });
    }
  );
}
