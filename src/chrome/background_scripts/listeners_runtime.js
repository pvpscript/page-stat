const methods = {
	statusChange: async (tab, data, response) => {
		const hostStatus = data.hostStatus;
		const host = (new URL(tab.url)).host;

		if (hostStatus) {
			config.inactive.push(host);
		} else {
			const index = config.inactive.indexOf(host);
			config.inactive.splice(index, 1);
		}

		const urlContainer = buildURL(tab.url);

		chrome.storage.sync.set({config: config});
		await updateFocus(tab.windowId, urlContainer);
	},
	popup: async (tab, data, response) => {
		const urlContainer = buildURL(tab.url);
		const host = urlContainer.url.host;
		const hasFocus = focused.get(tab.windowId);

		if (urlContainer.stat) {
			await updateHostTime(hasFocus);
			hasFocus.focusedAt = Date.now();
		}

		response({
			host: host,
			hostStatus: urlContainer.stat,
			time: pagesCache[host].time / 1000,
		});
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
	chrome.storage.sync.set({
		pages: {}, /* Pages dictionary, with time already computed. */
	});
});

const config = {
	protocols: ["http", "https", "file", "ftp"], // Valid protocols
	inactive: [], // Inactive hosts
};

chrome.runtime.onStartup.addListener(() => {
	chrome.storage.sync.get(['config'], (res) => {
		if (res.config) {
			config = res.config;
		} else {
			chrome.storage.sync.set({config: config});
		}
	});
});
