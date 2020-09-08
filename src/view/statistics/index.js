import {
	deleteHost,
	updateModal,
	timeToHuman,
	updateCustomInterval,
	updateChartInterval
} from "./modules/helpers.js";

import { anchor, progressBar, svgReference } from "./modules/html-builders.js";

chrome.storage.local.get(['pages'], (res) => {
	const sites = document.getElementById("sites");
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

		const row = sites.insertRow();
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
