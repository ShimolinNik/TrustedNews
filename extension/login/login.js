document.getElementById("myForm").onsubmit = function() {
  const username = this.elements["username"].value;
  const password = this.elements["password"].value;
  alert("The form was submitted");
  chrome.runtime.sendMessage({msg: "hello",data: [username,password]}, function(response) {
    close();
  });
};
