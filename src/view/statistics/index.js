const sites = document.getElementById("sites");

chrome.storage.local.get(['pages'], (res) => {
	const pages = res.pages;
	const hostTime = [];

	for (let h in pages) {
		let totalTime = 0;
		for (let t in pages[h].time) {
			totalTime += pages[h].time[t];
		}
		
		hostTime.push([h, totalTime]);
	}

	console.log(hostTime);

	let index = 1;
	hostTime.sort((a, b) => { return b[1] - a[1]; }).forEach((e) => {
	  const h = e[0];
	  const time = e[1];

	  row = sites.insertRow();
	  cell = row.insertCell();
	  cell.appendChild(document.createTextNode(index++));
	  cell2 = row.insertCell();
	  cell2.appendChild(document.createTextNode(h));
	  cell3 = row.insertCell();

	  cell3.appendChild(document.createTextNode(time));
	});
});
