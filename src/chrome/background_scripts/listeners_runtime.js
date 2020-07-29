const methods = {
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	console.log("Listener request");
	console.log(request);
});

chrome.runtime.onInstalled.addListener((message, sender, sendResponse) => {
	chrome.storage.sync.set({
		pages: {}, /* Pages dictionary, with time already computed. */
	});
});

const config = {
	protocols: ["http", "https", "file", "ftp"], // Valid protocols
	inactive: {}, // Inactive hosts
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
