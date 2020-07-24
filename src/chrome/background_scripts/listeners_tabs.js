chrome.tabs.onActivated.addListener((activeInfo) => {
	chrome.tabs.get(activeInfo.tabId, (tab) => {
		const url = buildURL(tab.url);

		console.log(`Tab just got activated: ${url}`);
		console.log(tab);
	});
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	const url = buildURL(tab.url);

	console.log(`Tab just got updated: ${url}`);
	console.log(tab);
});

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
	chrome.tabs.get(tabId, (tab) => { 
		const url = buildURL(tab.url);

		console.log(`Tab just got removed: ${url}`);
		console.log(tab);
	});
});
