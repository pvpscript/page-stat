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
	let sHostTime = hostTime.sort((a, b) => {
		return b[1] - a[1];
	});

	for (let e of sHostTime) {
		const h = e[0];
		const time = e[1];

		row = sites.insertRow();
		cell = row.insertCell();
		cell.appendChild(document.createTextNode(index++));
		cell2 = row.insertCell();
		cell2.appendChild(document.createTextNode(h));
		cell3 = row.insertCell();

		const bar = progressBar(
			(time / sHostTime[0][1]) * 100,
			timeToHuman(time / 1000)
		);
		cell3.appendChild(bar);
	}
});

function progressBar(perc, text) {
	const bar = document.createElement("div");
	const valNode = document.createElement("span");
	const textNode = document.createElement("span");

	bar.classList.value = "progress";

	valNode.classList.value = "value";
	valNode.style.width = perc + "%";

	textNode.classList.value = "text";
	textNode.appendChild(document.createTextNode(text));

	bar.appendChild(valNode);
	bar.appendChild(textNode);

	return bar;
}

function timeToHuman(time) {
	const days = Math.floor(time / 86400);
	const hours = Math.floor((time - days * 86400) / 3600);
	const mins = Math.floor((time - days * 86400 - hours * 3600) / 60);
	const secs = Math.floor(
		time - days * 86400 - hours * 3600 - mins * 60
	);

	return days + (days == 1 ? " day, " : " days, ") +
		("0"+hours).slice(-2) +
		":" + ("0"+mins).slice(-2) +
		":" + ("0"+secs).slice(-2);
}
