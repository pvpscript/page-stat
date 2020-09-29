import { option } from "./html-builders.js";
import { drawChart } from "./chart.js";

function updateChartInterval(host, interval) { // helper used by the "usage" listener 
	chrome.storage.local.get(["pages"], (res) => {
		const page = res.pages[host];

		drawChart(getUsageInterval(
			page, getDateInterval[interval]()
		));
	});
}

function updateCustomInterval(host) { // (helper) used by the "usage" and "custom" listeners
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

function deleteHost(e) { // (helper) used by the 'storage get' populator
	chrome.storage.local.get(['pages'], (res) => {
		const message = "Do you really want to delete all " +
			"information for\n" + this.id + "?";
		if (confirm(message)) {
			delete res.pages[this.id];

			chrome.storage.local.set({pages: res.pages});
			chrome.runtime.sendMessage({
				type: "updatePagesCache",
				data: {pages: res.pages}
			});

			window.location.reload();
		}
	});
}

function updateModal(e) { // (helper) used by the 'storage get' populator
	//e.preventDefault();

	const node = e.currentTarget;
	console.log("Hallal");
	console.log(e);
	console.log(node);
	console.log(node.name);
	console.log("Hellele");
	
	const hostStats = document.getElementById("host-stats");
	const custom = document.getElementById("custom");
	const usage = document.getElementById("usage");
	const chart = document.getElementById("chart-wrapper");
	const cUsageItem = document.getElementById("custom-usage-item");
	
	// Reset stuff;
	//chart.childNodes[1].textContent = "Graphic was reset";
	usage.selectedIndex = 0;
	hostStats.name = node.getAttribute("name");
	custom.style.visibility = "hidden";
	cUsageItem.style.visibility = "hidden";
	
	chrome.storage.local.get(["pages"], (res) => {
		const page = res.pages[node.getAttribute("name")];
		const siteStat = document.getElementById("site-stat");
		const startDate = document.getElementById("start-date");
		const endDate = document.getElementById("end-date");
		
		siteStat.textContent = node.getAttribute("name");
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

const getDateInterval = { // (helper) used by other helpers (updateModal, updateChartInterval)
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

function getUsage(pages, interval) { // (helper) used by other helpers (updateCustomInterval, updateModal)
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

function getUsageInterval(pages, interval) { // (helper) used by other helpers
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

const formatDashedDateString = (date) => // (helper) used by helpers.
	date.split("-").reverse().map((e, i) =>
		i == 2 ? ("0000"+e).slice(-4) : ("0"+e).slice(-2)).join("/");

function compareDate(a, b) { // (helper) used by other helpers
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

function timeToHuman(time) { // (helper) used by the populator and helpers.
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

export {
	updateChartInterval,
	updateCustomInterval,
	deleteHost,
	updateModal,
	getDateInterval,
	getUsage,
	getUsageInterval,
	formatDashedDateString,
	compareDate,
	timeToHuman
};
