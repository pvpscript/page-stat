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

	let index = 1;
	const sHostTime = hostTime.sort((a, b) => {
		return b[1] - a[1];
	});

	for (let e of sHostTime) {
		const host = e[0];
		const time = e[1];

		row = sites.insertRow();
		const cell = row.insertCell();
		cell.appendChild(document.createTextNode(index++));
		const cell2 = row.insertCell();
		cell2.appendChild(anchor(host, host, updateModal));
		const cell3 = row.insertCell();

		const bar = progressBar(
			(time / sHostTime[0][1]) * 100,
			timeToHuman(time / 1000)
		);
		cell3.appendChild(bar);

		const cell4 = row.insertCell();
		cell4.classList.add("trash-container");
		cell4.appendChild(
			svgReference("trash", host, deleteHost)
		);
	}
});

const hostStats = document.getElementById("host-stats");
const closeHsModal = document.getElementById("close-hs-modal");

window.addEventListener("click", (e) => {
	const node = e.target;

	if (node === hostStats) {
		hostStats.style.display = "none";
	}
});

closeHsModal.addEventListener("click", (e) => {
	hostStats.style.display = "none";
});

const usage = document.getElementById("usage");
const custom = document.getElementById("custom");

usage.addEventListener("change", (e) => {
	if (e.target.value === "custom") {
		custom.style.visibility = "inherit";
	} else {
		custom.style.visibility = "hidden";
	}
});

const startDate = document.getElementById("start-date");
startDate.addEventListener("change", (e) => {
	const endDate = document.getElementById("end-date");
	const node = e.target;

	for (let i = node.selectedIndex; i >= 0; i--) {
		endDate.options[i].disabled = true;
	}
	if (endDate.selectedIndex < node.selectedIndex) {
		endDate.selectedIndex = node.selectedIndex;
	}
	for (let i = node.selectedIndex; i < endDate.options.length; i++) {
		endDate.options[i].disabled = false;
	}
});

function deleteHost(e) {
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

function updateModal(e) {
	e.preventDefault();

	const node = e.target;
	console.log(node.name);
	
	chrome.storage.local.get(['pages'], (res) => {
		const page = res.pages[node.name];
		const siteStat = document.getElementById("site-stat");
		const startDate = document.getElementById("start-date");
		const endDate = document.getElementById("end-date");
		
		siteStat.textContent = node.name;
		while (startDate.lastChild) {
			startDate.removeChild(startDate.lastChild);
			endDate.removeChild(endDate.lastChild);
		}

		const sortedDates = Object.keys(page.time).sort(compareDate);
		for (let d of sortedDates) {
			const fmtDate = formatDashedDateString(d);

			startDate.appendChild(
				option(d, fmtDate)
			);
			endDate.appendChild(
				option(d, fmtDate)
			);
		}
	});

	hostStats.style.display = "block";
}

function option(value, text) {
	const opt = document.createElement("option");

	opt.value = value;
	opt.appendChild(document.createTextNode(text));

	return opt;
}

function formatDashedDateString(date) {
	const fields = date.split("-");

	return ("0"+fields[2]).slice(-2) + "/" +
		("0"+fields[1]).slice(-2) + "/" +
		("0000"+fields[0]).slice(-4);
}

function compareDate(a, b) {
	const UTCA = new Date(a).getTime();
	const UTCB = new Date(b).getTime();
	
	if (UTCA > UTCB) {
		return 1;
	} else if (UTCA < UTCB) {
		return -1;
	} else {
		return 0;
	}
}

function anchor(link, text, evt) {
	const a = document.createElement("a");
	
	if (evt) {
		a.addEventListener("click", evt);
		a.name = link;
		a.href = "#";
	} else {
		a.target = "_blank";
		a.href = "http://" + link;
	}

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
