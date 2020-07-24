chrome.tabs.onActivated.addListener((activeInfo) => {
	chrome.tabs.get(activeInfo.tabId, (tab) => {
		alert("Tab just got activated");

		console.log("Tab just got activated");
		console.log(tab);
	});
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	alert("Tab just got updated");

	console.log("Tab just got updated");
	console.log(tab);
});

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
	chrome.tabs.get(tabId, (tab) => { 
		alert("Tab just got removed");

		console.log("Tab just got removed");
		console.log(tab);
	});
});
