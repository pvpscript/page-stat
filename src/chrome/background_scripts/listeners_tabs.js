chrome.tabs.onActivated.addListener((activeInfo) => {
	chrome.tabs.get(activeInfo.tabId, (tab) => {
		const url = buildURL(tab.url);

		console.log(`Tab just got activated: ${url}`);
		console.log(tab);
	});
});

let lastHost = null; /* Used to avoid multiple updates to the same host */
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	const url = buildURL(tab.url);

	if (url && url.host != lastHost) {
		lastHost = url.host;
		console.log(`Tab just got updated: ${url}`);
		console.log(tab);
	}
});

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
	console.log(`Tab just got removed: ${tabId}`);
});
