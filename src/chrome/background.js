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

		callback({
			host: url.host,
			pageStat: pageStat,
			time: 0,
		});
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

async function tabAction(tab) {
	if (tab.url) {
		const url = new URL(tab.url);

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
		}
	}
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	tabAction(tab);
});

chrome.tabs.onActivated.addListener((activeInfo) => {
	chrome.tabs.get(activeInfo.tabId, (tab) => {
		tabAction(tab);
	});
});

chrome.runtime.onInstalled.addListener((message, sender, sendResponse) => {
	chrome.storage.sync.set({
		inactive: [],
	}, () => {
		console.log("Local data set as empty.");
	});
});
