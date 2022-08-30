/*<tr>
    <td id="key"></td>
    <td id="description"></td>
</tr>

<tbody>

</tbody>

<table id="mainTable" class="table table-bordered">
      <thead>
      <tr>
          <th>Key</th>
          <th>Description</th>
      </tr>
      </thead>
  </table>*/

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
  alert('copied to clipboard');
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
  //var rowNode = document.createElement("tr");
  //var cellNode = document.createElement("td");
  items["keys"].forEach( item => {
    var rowNode = document.createElement("tr");
    //rowNode.setAttribute('ondblclick', 'copyFirstColumn(this)');
    //console.log(item);
    var textNode = document.createTextNode(item[0]);
    //var button = document.createElement("button");
    //button.setAttribute('id', 'button1');
    //button.setAttribute('onclick', 'copyFirstColumn(this)');
    //button.innerHTML = item[0];
    //button.appendChild(textNode);
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

/*if (document.getElementById("button1")!=null){
  document.getElementById("button1").onclick = copyFirstColumn(this);
}*/

//document.getElementById("button1").onclick = copyFirstColumn(this);
//document.getElementById("button1").addEventListener('click', ()=>{});
document.querySelector('body').addEventListener('click', function(event) {
  if (event.target.tagName.toLowerCase() === 'td') {
    copyToClipboard(event.target.innerHTML);

    // do your action on your 'li' or whatever it is you're listening for
  }
});

document.getElementById("refreshButton").onclick = function() {
  alert("yes");
  document.getElementById("info").innerHTML="kak to tak1";
  chrome.runtime.sendMessage({msg: "allkeys"}, function(response) {
    console.log("userKeys js page",response.userkeys);
    document.getElementById("info").innerHTML=response.userkeys["UID"];
    loadTableData(response.userkeys);
    alert("ooura");
  });
};


window.onload = function(){
  document.getElementById("refreshButton").click();
  alert("new one");
}
