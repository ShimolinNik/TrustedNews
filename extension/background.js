chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.msg === "hello"){
      sendResponse({farewell: "goodbye"});
      console.log(request.data[0]);
      console.log(request.data[1]);

      var data = JSON.stringify({username:request.data[0],password:request.data[1]});
      var myheaders = new Headers(
        { "Accept": "application/json",
        "Content-Type": "application/json; charset=UTF-8"
      });
      console.log("data: ",data);
      fetch("http://localhost:3000/auth",{
        method: "POST",
        body: data,
        headers: myheaders
      }).then(function(res){
        res.json().then((data) => {console.log(data); chrome.storage.local.set({"logged": true,"UID":data["UID"]},() =>{console.log(data["UID"]);});})
      });
  }
  else if(request.msg === "allkeys"){
    chrome.storage.local.get(["UID"],(result) => {
      fetch('http://localhost:3000/uid/'+result["UID"]).then(function(res){
        res.json().then((data) => {console.log(data);
        sendResponse({userkeys: data});
      })
      });
    });
    return true;

  }

  }
);

//Store the info: person is not logged
chrome.runtime.onInstalled.addListener(()=>{chrome.storage.local.set({"logged": false},
() => {
});

chrome.action.onClicked.addListener(function(request, sender, callback) {

  //Retrieve the info: person is logged ?
  chrome.storage.local.get(["logged"], (result) => {
    let logged = result["logged"];
    if (logged){
      chrome.windows.create({url: "userKeys/userKeys.html", type: "popup"});
    }
    else{
      chrome.windows.create({url: "login/login.html", type: "popup"});
      chrome.windows.create({url: "infoPage/infoPage.html", type: "popup"});
    }
  });
});
