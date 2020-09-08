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
	const node = e.target;
	const hostStats = document.getElementById("host-stats");
	const chart = document.getElementById("chart-wrapper");
	const cUsageItem = document.getElementById("custom-usage-item");

	if (node.value === "custom") {
		custom.style.visibility = "inherit";
		cUsageItem.style.visibility = "inherit";

		updateCustomInterval(hostStats.name);
	} else {
		custom.style.visibility = "hidden";
		cUsageItem.style.visibility = "hidden";

		updateChartInterval(hostStats.name, node.value);
	}

	console.log(node.value);
	// change the following line to plot the chart
	//chart.childNodes[1].textContent = "Showing data for " + node.value + " " + hostStats.name;
});

custom.addEventListener("change", (e) => {
	const node = e.target;
	
	const hostStats = document.getElementById("host-stats");
	updateCustomInterval(hostStats.name);
});

function updateChartInterval(host, interval) {
	chrome.storage.local.get(["pages"], (res) => {
		const page = res.pages[host];

		drawChart(getUsageInterval(
			page, getDateInterval[interval]()
		));
	});
}

function updateCustomInterval(host) {
	const cUsageNode = document.getElementById("custom-usage");
	const startDate = document.getElementById("start-date");
	const endDate = document.getElementById("end-date");

	chrome.storage.local.get(['pages'], (res) => {
		const page = res.pages[host];
		cUsageNode.textContent = getUsage(
			page,
			[startDate.value, endDate.value]
		);
		drawChart(getUsageInterval(
			page, [startDate.value, endDate.value]
		));
	});
}

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
	
	const hostStats = document.getElementById("host-stats");
	const custom = document.getElementById("custom");
	const usage = document.getElementById("usage");
	const chart = document.getElementById("chart-wrapper");
	const cUsageItem = document.getElementById("custom-usage-item");
	
	// Reset stuff;
	//chart.childNodes[1].textContent = "Graphic was reset";
	usage.selectedIndex = 0;
	hostStats.name = node.name;
	custom.style.visibility = "hidden";
	cUsageItem.style.visibility = "hidden";
	
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

		const yesterdayNode = document.getElementById("yesterday");
		const todayNode = document.getElementById("today");
		const weeklyNode = document.getElementById("weekly");
		const monthlyNode = document.getElementById("monthly");
		const yearlyNode = document.getElementById("yearly");
		const intervalNode = document.getElementById("usage-interval");
		const allTimeNode = document.getElementById("usage-all");
		const cUsageNode = document.getElementById("custom-usage");

		//for (let t in page.time) {
		//	chart.data.labels.push(formatDashedDateString(t));
		//	chart.data.datsets[0].data.push(page[t]);
		//};
		//chart.update();
		drawChart(getUsageInterval(page, getDateInterval["weekly"]()));
		//console.log(getUsageInterval(page, getDateInterval["weekly"]()));
		//console.log(page.time);

		yesterdayNode.textContent = getUsage(
			page, getDateInterval["yesterday"]()
		);
		todayNode.textContent = getUsage(
			page, getDateInterval["today"]()
		);
		weeklyNode.textContent = getUsage(
			page, getDateInterval["weekly"]()
		);
		monthlyNode.textContent = getUsage(
			page, getDateInterval["monthly"]()
		);
		yearlyNode.textContent = getUsage(
			page, getDateInterval["yearly"]()
		);

		console.log(`today: ${getUsage(page, 'today')}`);
		console.log(`yesterday: ${getUsage(page, 'yesterday')}`);
		console.log(`last 7 days: ${getUsage(page, 'weekly')}`);
		console.log(`last 30 days: ${getUsage(page, 'monthly')}`);
		console.log(`this year: ${getUsage(page, 'yearly')}`);
	});

	hostStats.style.display = "block";

}

const getDateInterval = {
	today: () => {
		const today = new Date();

		const year = today.getFullYear();
		const month = today.getMonth() + 1;
		const day = today.getDate();

		return [
			year + "-" + month + "-" + day, 
			year + "-" + month + "-" + day
		];
	},
	yesterday: () => {
		const today = new Date();
		const yesterday = new Date(today - 86400000);

		const year = yesterday.getFullYear();
		const month = yesterday.getMonth() + 1;
		const day = yesterday.getDate();

		return [
			year + "-" + month + "-" + day, 
			year + "-" + month + "-" + day
		];
	},
	weekly: () => { // last 7 days
		const today = new Date();
		const lookupStart = new Date(today - 6 * 86400000);

		const yearStart = lookupStart.getFullYear();
		const monthStart = lookupStart.getMonth() + 1;
		const dayStart = lookupStart.getDate();
		const yearEnd = today.getFullYear();
		const monthEnd = today.getMonth() + 1;
		const dayEnd = today.getDate();

		return [
			yearStart + "-" + monthStart + "-" + dayStart,
			yearEnd + "-" + monthEnd + "-" + dayEnd
		];
	},
	monthly: () => { // last 30 days
		const today = new Date();
		const lookupStart = new Date(today - 29 * 86400000);

		const yearStart = lookupStart.getFullYear();
		const monthStart = lookupStart.getMonth() + 1;
		const dayStart = lookupStart.getDate();
		const yearEnd = today.getFullYear();
		const monthEnd = today.getMonth() + 1;
		const dayEnd = today.getDate();

		return [
			yearStart + "-" + monthStart + "-" + dayStart,
			yearEnd + "-" + monthEnd + "-" + dayEnd
		];
	},
	yearly: () => { // this year
		const today = new Date();
		const lookupStart = new Date(
			today.getFullYear(), 0,	1
		);
		const lookupEnd = new Date(
			today.getFullYear() + 1, 0, 0
		);

		const yearStart = lookupStart.getFullYear();
		const monthStart = lookupStart.getMonth() + 1;
		const dayStart = lookupStart.getDate();
		const yearEnd = lookupEnd.getFullYear();
		const monthEnd = lookupEnd.getMonth() + 1;
		const dayEnd = lookupEnd.getDate();

		return [
			yearStart + "-" + monthStart + "-" + dayStart,
			yearEnd + "-" + monthEnd + "-" + dayEnd
		];
	},
};

function getUsage(pages, interval) {
	let totalTime = 0;

	for (let t in pages.time) {
		if (compareDate(t, interval[0]) >= 0 &&
			compareDate(t, interval[1]) <= 0
		) {
			totalTime += pages.time[t];
		}
	}

	return timeToHuman(totalTime / 1000);
}

function getUsageInterval(pages, interval) {
	const usageInterval = {};

	for (let t in pages.time) {
		if (compareDate(t, interval[0]) >= 0 &&
			compareDate(t, interval[1]) <= 0
		) {
			usageInterval[t] = pages.time[t];
		}
	}

	return usageInterval;
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
