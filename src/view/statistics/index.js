const sites = document.getElementById("sites");

chrome.storage.local.get(['pages'], (res) => {
	const pages = res.pages;
	let index = 1;

	Object.keys(pages).sort().forEach((h) => {
	  row = sites.insertRow();
	  cell = row.insertCell();
	  cell.appendChild(document.createTextNode(index++));
	  cell2 = row.insertCell();
	  cell2.appendChild(document.createTextNode(h));
	  cell3 = row.insertCell();
	  
	  let totalTime = 0;
	  for(let i in pages[h].time) {
		totalTime += pages[h].time[i];
	  }

	  cell3.appendChild(document.createTextNode(totalTime));
	});
});
