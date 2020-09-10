import {
	deleteHost,
	updateModal,
	timeToHuman,
	updateCustomInterval,
	updateChartInterval
} from "./modules/helpers.js";

import {
	imgNode,
	spanNode,
	divNode,
	progressBar,
	svgReference
} from "./modules/html-builders.js";

chrome.storage.local.get(['pages'], (res) => {
	const sites = document.getElementById("sites");
	const pages = res.pages;
	const hostTime = [];

	for (let host in pages) {
		let totalTime = 0;
		for (let t in pages[host].time) {
			totalTime += pages[host].time[t];
		}
		
		hostTime.push({
			host: host,
			time: totalTime,
			favicon: pages[host].favicon,
		});
	}

	let index = 1;
	const sHostTime = hostTime.sort((a, b) => {
		return b.time - a.time;
	});

	for (let e of sHostTime) {
		const row = sites.insertRow();
		const indexCell = row.insertCell();
		indexCell.appendChild(document.createTextNode(index++));

		const hostCell = row.insertCell();
		const img = imgNode(["host-favicon"], e.favicon);
		const span = spanNode(["host-link"], e.host);
		const div = divNode(
			["host-container"],
			[img, span],
			e.host,
			updateModal
		);
		hostCell.appendChild(div);

		const usageCell = row.insertCell();
		const bar = progressBar(
			(e.time / sHostTime[0].time) * 100,
			timeToHuman(e.time / 1000)
		);
		usageCell.appendChild(bar);

		const optionCell = row.insertCell();
		optionCell.classList.add("trash-container");
		optionCell.appendChild(
			svgReference("trash", e.host, deleteHost)
		);
	}
});

// Global listener to close the modal when clicking outside of it.
window.addEventListener("click", (e) => {
	const hostStats = document.getElementById("host-stats");
	const node = e.target;

	if (node === hostStats) {
		hostStats.style.display = "none";
	}
});

document.getElementById("close-hs-modal").addEventListener("click", (e) => {
	const hostStats = document.getElementById("host-stats");

	hostStats.style.display = "none";
});

document.getElementById("usage").addEventListener("change", (e) => {
	const node = e.target;
	const hostStats = document.getElementById("host-stats");
	const custom = document.getElementById("custom");
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

document.getElementById("custom").addEventListener("change", (e) => {
	const node = e.target;
	
	const hostStats = document.getElementById("host-stats");
	updateCustomInterval(hostStats.name);
});

document.getElementById("start-date").addEventListener("change", (e) => {
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
