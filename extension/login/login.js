document.getElementById("myForm").onsubmit = function() {
  const username = this.elements["username"].value;
  const password = this.elements["password"].value;
  alert("The form was submitted");
  chrome.runtime.sendMessage({msg: "hello",data: [username,password]}, function(response) {
    console.log("login js page",response.farewell);
    alert("yes");
    close();
  });
};

/*function myFunction() {
  alert("The form was submitted");
  chrome.runtime.sendMessage({msg: "hello"}, function(response) {
    console.log(response.farewell);
    alert("yes");
    close();
  });
}*/
