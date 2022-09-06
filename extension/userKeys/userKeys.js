function copyToClipboard(textToCopy) {
  var input = document.createElement("input");
  document.body.appendChild(input);
  input.value = textToCopy;
  input.select();
  document.execCommand("Copy");
  input.remove();
}
function copyFirstColumn(button) {
  var input = document.createElement("input");
  document.body.appendChild(input);
  input.value = button.innerHTML;
  input.select();
  document.execCommand("Copy");
  input.remove();
}

function loadTableData(items) {
  if (document.getElementById("mainTable")){
    document.getElementById("mainTable").remove();
  }
  const place = document.getElementById("mainDiv");
  const table = document.createElement("table");
  table.setAttribute('id', 'mainTable');
  table.setAttribute('class', 'table table-bordered');
  //Header
  var head = document.createElement("thead");
  var rowNode = document.createElement("tr");

  var textNode = document.createTextNode("Key");
  var cellNode = document.createElement("th");
  cellNode.appendChild(textNode);
  rowNode.appendChild(cellNode);

  var textNode = document.createTextNode("Description");
  var cellNode = document.createElement("th");
  cellNode.appendChild(textNode);
  rowNode.appendChild(cellNode);

  head.appendChild(rowNode);
  table.appendChild(head);

//Body
  var body = document.createElement("tbody");
  items["keys"].forEach( item => {
    var rowNode = document.createElement("tr");
    var textNode = document.createTextNode(item[0]);
    var cellNode = document.createElement("td");
    cellNode.appendChild(textNode);
    rowNode.appendChild(cellNode);
    var textNode = document.createTextNode(item[1]);
    var cellNode = document.createElement("td");
    cellNode.appendChild(textNode);
    rowNode.appendChild(cellNode);
    body.appendChild(rowNode);
  });
  table.appendChild(body);
  place.appendChild(table);
}

document.querySelector('body').addEventListener('click', function(event) {
  if (event.target.tagName.toLowerCase() === 'td') {
    copyToClipboard(event.target.innerHTML);
  }
});

document.getElementById("refreshButton").onclick = function() {
  /*document.getElementById("info").innerHTML="kak to tak1";*/
  chrome.runtime.sendMessage({msg: "allkeys"}, function(response) {
    document.getElementById("info").innerHTML=response.userkeys["UID"];
    loadTableData(response.userkeys);
  });
};

window.onload = function(){
  document.getElementById("refreshButton").click();
}
