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

function changeIcon(tabId, iconPath) {
	chrome.browserAction.setIcon({
		tabId: tabId,
		path: iconPath
	}, () => {
		console.log("Icon has been changed");
	});
}

const methods = {
	handshake: async (tab, callback, data) => {
		const url = new URL(tab.url);
		const pageStat = await checkStatus(url.host);
		const page = pages.get(tab.windowId);

		console.log(`Timereth: ${page.startTime}`);
		console.log(`Nozinho: ${(Date.now() - page.startTime) / 1000}`);

		callback({
			host: page.host,
			time: (Date.now() - page.startTime) / 1000,
			pageStat: pageStat,
		});
		/*
		chrome.storage.sync.get('pages', (obj) => {
			const page = obj.pages.filter(page => page.host === url.host)[0];

			callback({
				host: page.host,
				time: (Date.now() - page.time) / 1000,
				pageStat: pageStat,
			});
		});

			/*
		callback({
			host: url.host,
			pageStat: pageStat,
			time: 0,
		});
		*/
	},
	change: async (tab, callback, data) => {
		const url = new URL(tab.url);
		chrome.storage.sync.get('inactive', (obj) => {
			if (data.deactivate) {
				obj.inactive.push(url.host);
				changeIcon(tab.id, "images/test.png");
			} else {
				const index = obj.inactive.indexOf(url.host);
				obj.inactive.splice(index, 1);
				changeIcon(tab.id, "images/graph_icon128.png");
			}
			chrome.storage.sync.set({inactive: obj.inactive});
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

/*
function defaultPageAction(tab, url) {
	chrome.storage.sync.get(['pageData'], (obj) => {
		console.log("Page data stufferino below");
		console.log(obj.pageData);
		const page = pages.get(url.host);
		const hostRef = tabIdToHost.get(tab.id);
		
		console.log();
		console.log(`-------->>> ${page}`);
		if (!page) {
			pages.set(url.host, {
				startTime: Date.now(),
			});

			console.log();
			console.log();
			console.log(`klasp: ${obj.pageData[url.host]}`);
			if (!obj.pageData[url.host]) {
				console.log("some random info");
				obj.pageData[url.host] = {
					favicon: tab.favIconUrl,
					time: 0,
				}
			}
			console.log(`-'-------------------${tab.id}`);
		}
		console.log(`-------->>> ${page}`);

		if (hostRef && hostRef != url.host) {
			const oldPage = pages.get(hostRef);
			const hostData = obj.pageData[hostRef];

			hostData.time += Date.now() - oldPage.startTime;
			console.log(`NHEIMMMMMMMMMMMMMMMMMMMMMMMMM: ${hostData.time}`);

			console.log(`The letou: ${hostRef}`);
			pages.delete(hostRef);
		}
		tabIdToHost.set(tab.id, url.host);

		chrome.storage.sync.set({pageData: obj.pageData});
		console.log(obj.pageData);
		chrome.storage.sync.get(['pageData'], (kk) => {
			console.log("started");
			console.log(kk.pageData)
			console.log("ended");
		});
		console.log("--------------------------------------------------------------------------------");
	});
}
*/

function defaultPageAction(tab, url) {
	// Create a more general function to change a page usage time, based on host unfocus.
	chrome.storage.sync.get(['pageData'], (obj) => {
		if (!obj.pageData[url.host]) {
			obj.pageData[url.host] = {
				favicon: tab.favIconUrl,
				time: 0,
			};
		}

		const focusedPage = pages.get(tab.windowId);
		
		if (!focusedPage) {
			pages.set(tab.windowId, {
				startTime: Date.now(),
				host: url.host,
			});
		} else if (focusedPage.host != url.host) {
			const pageData = obj.pageData[focusedPage.host];
			pageData.time += Date.now() - focusedPage.startTime;

			focusedPage.startTime = Date.now();
			focusedPage.host = url.host;
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

async function tabAction(tab, pageAction) {
	console.log("Manah Manah");
	console.log(tab);
	const url = buildURL(tab.url);
	if (isValidURL(url)) {
		if (
			url.protocol == "about:" ||
			url.protocol == "chrome:"
		) {
			chrome.browserAction.disable(tab.id);
		} else {
			const pageStat = await checkStatus(url.host);
			changeIcon(tab.id, pageStat
				? "images/graph_icon128.png"
				: "images/test.png");

			await pageAction(tab, url);
		}
	} else {
		chrome.browserAction.disable(tab.id);
	}
}

let favicon = false;
let complete = false;
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	favicon = favicon || changeInfo.favIconUrl != undefined;
	complete = complete || changeInfo.status === "complete";

	if (complete && favicon) {
		favicon = complete = false;
		tabAction(tab, defaultPageAction);
		//console.log(`Updated ${tab.url}`);
	}
});

chrome.tabs.onActivated.addListener((activeInfo) => {
	chrome.tabs.get(activeInfo.tabId, (tab) => {
		tabAction(tab, defaultPageAction);
		//console.log(`Activated: ${tab.url}`);
	});
});

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
	/*
	chrome.storage.sync.get('pages', (obj) => {
		for (let page of obj.pages) {

		}
	});
	*/
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
