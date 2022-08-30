chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    /*console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");*/
    if (request.msg === "hello"){
      sendResponse({farewell: "goodbye"});
      console.log(request.data[0]);
      console.log(request.data[1]);
      //var data = new FormData();
      //data.append( "json", JSON.stringify( {username:request.data[0],password:request.data[1]} ) );
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
        //{
          //"Accept": "application/json",
        //  "Content-Type": "application/json;"
          //"Content-Type": "application/json; charset=UTF-8"
          //"Access-Control-Allow-Origin" : "*"
          //"Access-Control-Allow-Credentials" : true
      //  },
        //mode: 'no-cors'
      }).then(function(res){
        //console.log("Niceee");
        //console.log(request.headers)
        res.json().then((data) => {console.log(data); chrome.storage.local.set({"logged": true,"UID":data["UID"]},() =>{console.log(data["UID"]);});})
      });
  }
  else if(request.msg === "allkeys"){
    //sendResponse({keys: "nuuuu vot"});
    chrome.storage.local.get(["UID"],(result) => {
      fetch('http://localhost:3000/uid/'+result["UID"]).then(function(res){
        //console.log("Niceee");
        res.json().then((data) => {console.log(data);
          sendResponse({userkeys: data});
      })
      });
    });
    //sendResponse({test: "nuuuu vot"});
    return true;

  }

  }
);

//Store the info: person is not logged
chrome.runtime.onInstalled.addListener(()=>{chrome.storage.local.set({"logged": false},
() => {
  console.log('Not logged');});
});
/*chrome.storage.local.set({"logged": false}, () => {
  console.log('Not logged');
});*/

chrome.action.onClicked.addListener(function(request, sender, callback) {
  //let logged = true;

  //Retrieve the info: person is logged ?
  chrome.storage.local.get(["logged"], (result) => {
    let logged = result["logged"];
    //console.log('Retrieved name: ' + logged);
    if (logged){
      chrome.windows.create({url: "userKeys/userKeys.html", type: "popup"});
      /*chrome.storage.local.get(["UID"],(result) => {
        fetch('http://localhost:3000/uid/'+result["UID"]).then(function(res){
          //console.log("Niceee");
          res.json().then((data) => {
            console.log(data);
            chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
              console.log(tabs[0].id);
              chrome.tabs.sendMessage(tabs[0].id, {color: "#00FF00"}, function(response) {
                console.log(response.status);
              });
            });
            //chrome.tabs.sendMessage(tabs[0].id, {color: "#00FF00"}, function(response) {
              //console.log(response.status);
            //});
          })
        });
      });*/
      console.log('Inside ' + logged);
      //fetch('http://localhost:3000/lol').then(console.log("oura"));
    }
    else{
      //chrome.tabs.create({url: chrome.extension.getURL("pop2.html")});
      chrome.windows.create({url: "login/login.html", type: "popup"});
      chrome.windows.create({url: "infoPage/infoPage.html", type: "popup"});
      //window.open("pop2.html", "extension_popup", "width=300,height=400,status=no,scrollbars=yes,resizable=no");
    }
  });
});
