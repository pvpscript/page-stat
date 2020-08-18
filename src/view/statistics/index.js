const sites = document.getElementById("sites");

chrome.storage.local.get(['pages'], (res) => {
	const pages = res.pages;
	const hostTime = [];

	for (let host in pages) {
		let totalTime = 0;
		for (let t in pages[host].time) {
			totalTime += pages[host].time[t];
		}
		
		hostTime.push([host, totalTime]);
	}

	console.log(hostTime);

	let index = 1;
	let sHostTime = hostTime.sort((a, b) => {
		return b[1] - a[1];
	});

	for (let e of sHostTime) {
		const host = e[0];
		const time = e[1];

		row = sites.insertRow();
		cell = row.insertCell();
		cell.appendChild(document.createTextNode(index++));
		cell2 = row.insertCell();
		cell2.appendChild(anchor(host, host));
		cell3 = row.insertCell();

		const bar = progressBar(
			(time / sHostTime[0][1]) * 100,
			timeToHuman(time / 1000)
		);
		cell3.appendChild(bar);

		cell4 = row.insertCell();
		cell4.classList.add("trash-container");
		cell4.appendChild(svgReference("trash", host, stuff));
	}
});

function stuff(e) {
	console.log(this.id);

	// remove site from cache and local storage
	chrome.storage.local.get(['pages'], (res) => {
		delete res.pages[this.id];

		chrome.storage.local.set({pages: res.pages});
		chrome.runtime.sendMessage({
			type: "updatePagesCache",
			data: {pages: res.pages}
		});
	});

	window.location.reload();
}

function anchor(link, text) {
	const a = document.createElement("a");
	a.target = "_blank";
	a.href = "http://" + link;
	a.appendChild(document.createTextNode(text));

	return a;
}

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

function svgReference(refId, elementId, evt) {
	const button = document.createElement("button");
	button.name = "nomerento";
	button.id = elementId;
	button.addEventListener("click", evt);
	const svg = document.createElementNS(
		"http://www.w3.org/2000/svg",
		"svg"
	);
	svg.setAttributeNS(
		"http://www.w3.org/2000/xmlns/",
		"xmlns:xlink",
		"http://www.w3.org/1999/xlink"
	);
	svg.classList.add("svg-trash");
	svg.id = elementId;

	const use = document.createElementNS(
		"http://www.w3.org/2000/svg",
		"use"
	);
	use.setAttributeNS(
		"http://www.w3.org/1999/xlink",
		"xlink:href",
		"#" + refId
	);

	svg.appendChild(use);
	button.appendChild(svg);

	return button;
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
