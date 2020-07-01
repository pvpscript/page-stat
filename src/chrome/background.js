const pages = new Map();
/* Maps a hostname to an object containing the time the host was first opened,
 * and the tabs associated with it
 *
 * scheme:
 * {
 * 	host => {
 * 		startTime: startTime,
 * 		tabs: [],
 * 	}
 * }
 */

const tabIdToHost = new Map();
/* Maps a tab id to a host name to enable quick check for a tab -> host relationship
 *
 * scheme:
 * { tabId => host }
 *
 */

function changeIcon(tabId, suffix) {
	const icons = {
		16: `images/icon16${suffix}.png`,
		32: `images/icon32${suffix}.png`,
		48: `images/icon48${suffix}.png`,
		128: `images/icon128${suffix}.png`,
	};

	chrome.browserAction.setIcon({
		tabId: tabId,
		path: icons,
	}, () => {
		console.log("Icon has been changed");
	});
}

const methods = {
	handshake: async (tab, callback, data) => {
		const url = new URL(tab.url);
		const pageStat = await checkStatus(url.host);
		const page = pages.get(tab.windowId);

		console.log(`Page: ${page}`);

		//console.log(`Timereth: ${page.startTime}`);
		//console.log(`Nozinho: ${(Date.now() - page.startTime) / 1000}`);

		callback({
			host: page ? page.host : null,
			time: page ? (Date.now() - page.startTime) / 1000 : -1,
			pageStat: pageStat,
		});
	},
	change: async (tab, callback, data) => {
		const url = new URL(tab.url);
		chrome.storage.sync.get(['inactive', 'pageData'], (obj) => {
			if (data.deactivate) {
				const lastFocused = pages.get(tab.windowId);
				const pageData = obj.pageData[lastFocused.host];
				pageData.time += Date.now() - lastFocused.startTime;
				
				obj.inactive.push(url.host);
				changeIcon(tab.id, "-disabled");
			} else {
				const index = obj.inactive.indexOf(url.host);
				obj.inactive.splice(index, 1);
				changeIcon(tab.id, "");

				const page = pages.get(tab.windowId);
				page.startTime = Date.now();
				page.host = url.host;

			}
			chrome.storage.sync.set({
				inactive: obj.inactive,
				pageData: obj.pageData,
			});
		});

		callback({});
	},
}
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	const action = methods[request.type];

	chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
		action(tabs[0], sendResponse, request.data);
	});

	return true;
});

async function checkStatus(host) {
	return new Promise((resolve, reject) => {
		try {
			chrome.storage.sync.get('inactive', (data) => {
				resolve(!data.inactive.includes(host));
			});
		} catch (ex) {
			reject(ex);
		}
	});
}

function pageAction(tab, url) {
	chrome.storage.sync.get(['pageData'], async (obj) => {
		if (!obj.pageData[url.host]) {
			obj.pageData[url.host] = {
				favicon: tab.favIconUrl,
				time: 0,
			};
		}

		const lastFocused = pages.get(tab.windowId);

		if (!lastFocused) {
			pages.set(tab.windowId, {
				startTime: Date.now(),
				host: url.host,
			});
		} else if (lastFocused.host != url.host) {
			if (await checkStatus(lastFocused.host)) {
				const lastPage = obj.pageData[lastFocused.host];
				lastPage.time += Date.now() - lastFocused.startTime;
			}

			lastFocused.startTime = Date.now();
			lastFocused.host = url.host;
		}

		chrome.storage.sync.set({pageData: obj.pageData});
		console.log(obj.pageData);
	});
}

function buildURL(url) {
	try {
		return new URL(url);
	} catch (e) {
	}

	return null;
}

function isValidURL(url) {
	if (url) {
		return !(url.protocol == "about:" ||
			url.protocol == "chrome:");
	} else {
		return false;
	}

	return true;
}

function updatePageData(windowId) {
	chrome.storage.sync.get(['pageData'], (obj) => {
		const lastFocused = pages.get(windowId);

		if (lastFocused) {
			const pageData = obj.pageData[lastFocused.host];
			pageData.time += Date.now() - lastFocused.startTime;

			pages.delete(windowId);

			chrome.storage.sync.set({pageData: obj.pageData});
			console.log(obj.pageData);
		}
	});
}

async function tabAction(tab) {
	const url = buildURL(tab.url);

	console.log(`Tab id: ${tab.id}`);

	if (isValidURL(url)) {
		console.log("VALID!");
		const pageStat = await checkStatus(url.host);
		console.log(`Status: ${pageStat ? "true" : "false"}`);

		changeIcon(tab.id, pageStat ? "" : "-disabled");
		pageAction(tab, url);
	} else {
		changeIcon(tab.id, "-off");
		updatePageData(tab.windowId);
	}
}

let favicon = false;
let complete = false;
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	favicon = favicon || changeInfo.favIconUrl != undefined;
	complete = complete || changeInfo.status === "complete";

	if (complete && favicon) {
		favicon = complete = false;
		tabAction(tab);
		console.log(`Updated ${tab.url}`);
	}
});

chrome.tabs.onActivated.addListener((activeInfo) => {
	//console.log("Active Info");
	//console.log(activeInfo);
	chrome.tabs.get(activeInfo.tabId, (tab) => {
		tabAction(tab);
		console.log(`Activated: ${tab.url}`);
	});
});

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
	updatePageData(removeInfo.windowId);
	/*
	console.log(`Tab ID: ${tabId}`);
	console.log("Remove info");
	console.log(removeInfo);
	*/
});

/*
 * pageData is a map that will be kept in the chrome persistent storage.
 * This map associates a host name with its favicon url and total usage time.
 *
 * scheme:
 * {
 * 	host => {
 * 		favicon: favIconUrl,
 * 		time: usageTime,
 * 	}
 * }
 */
chrome.runtime.onInstalled.addListener((message, sender, sendResponse) => {
	chrome.storage.sync.set({
		inactive: [],
		pageData: {}, 
	}, () => {
		console.log("Local data set as empty.");
	});
});
