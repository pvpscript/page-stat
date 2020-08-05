const methods = {
	statusChange: async (tab, data, response) => {
		const hostStatus = data.hostStatus;
		const host = (new URL(tab.url)).host;

		if (hostStatus) {
			configCache.inactive.push(host);
		} else {
			const index = configCache.inactive.indexOf(host);
			configCache.inactive.splice(index, 1);
		}

		const urlContainer = buildURL(tab.url);

		chrome.storage.sync.set({config: configCache});
		await updateFocus(tab.windowId, urlContainer);
	},
	popup: async (tab, data, response) => {
		const urlContainer = buildURL(tab.url);
		const host = urlContainer.url.host;
		const hasFocus = focused.get(tab.windowId);
		const todayDate = today();

		if (urlContainer.stat) {
			await updatePageAndFocusTime(hasFocus);
		}

		const time = pagesCache[host]
			? pagesCache[host].time[todayDate] / 1000
			: -1;

		response({
			host: host,
			hostStatus: urlContainer.stat,
			time: time,
		});
	},
	updateConfigCache: (tab, data, response) => {
		configCache = data.config;
	},
	updatePagesCache: (tab, data, response) => {
		pagesCache = data.pages;
	},
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	console.log("Listener request");
	console.log(request);

	const action = methods[request.type];

	chrome.tabs.query({active: true, currentWindow: true},
		async (tabs) => {
			await action(tabs[0], request.data, sendResponse);
		});

	return true;
});

chrome.runtime.onInstalled.addListener((message, sender, sendResponse) => {
	chrome.storage.local.set({
		pages: {}, /* Pages dictionary, with time already computed. */
	});

	chrome.windows.getLastFocused(null, (win) => currentWindowId = win.id);
});

let configCache = {
	protocols: ["http", "https", "file", "ftp"], // Valid protocols
	pMatching: true, // true: match only defined protocols; false: match every protocol, except defined;
	inactive: [], // Inactive hosts
	log: true, // Show log messages
	/*focusedOnly: true, // Used by the update alarm to update only hosts that are on a focused window*/
};

chrome.runtime.onStartup.addListener(() => {
	chrome.storage.sync.get(['config'], (res) => {
		if (res.config) {
			configCache = res.config;
		} else {
			chrome.storage.sync.set({config: configCache});
		}
	});

	chrome.windows.getLastFocused(null, (win) => currentWindowId = win.id);
});
