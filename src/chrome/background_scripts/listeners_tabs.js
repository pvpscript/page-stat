let pagesCache = {}; /* Stored pages cache */
let onUpdatedUrl = null;

chrome.tabs.onActivated.addListener((activeInfo) => {
	chrome.storage.sync.get(['pages'], (res) => {
		pagesCache = res.pages;

		chrome.tabs.get(activeInfo.tabId, async (tab) => {
			const url = buildURL(tab.url);

			/*
			console.log("-------------------- Before --------------------");
			console.log(pagesCache);
			console.log("------------------------------------------------");
			*/

			if (url) {
				console.log(`Tab just got activated: ${url}`);
				console.log(tab);

				await updateFocus(tab.windowId, url.host);
			}

			/*
			console.log("-------------------- After --------------------");
			console.log(pagesCache);
			chrome.storage.sync.get(['pages'], (res) => console.log(res.pages));
			console.log("-----------------------------------------------");
			*/
			chrome.storage.sync.set({pages: pagesCache});
			/*
			chrome.storage.sync.get(['pages'], (res) => console.log(res.pages));
			*/
			
		});
	});
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	onUpdatedUrl = changeInfo.url || onUpdatedUrl;

	if (changeInfo.status == "complete" && onUpdatedUrl) {
		onUpdatedUrl = null;

		chrome.storage.sync.get(['pages'], async (res) => {
			pagesCache = res.pages;

			/*
			console.log("-------------------- Before --------------------");
			console.log(pagesCache);
			console.log("------------------------------------------------");
			*/

			const url = buildURL(tab.url);

			if (url) {
				console.log(`Tab just got updated: ${url}`);
				console.log(tab);

				await updateFocus(tab.windowId, url.host);
			}
			/*console.log("-------------------- After --------------------");
			console.log(pagesCache);
			chrome.storage.sync.get(['pages'], (res) => console.log(res.pages));
			console.log("-----------------------------------------------");
			*/
			chrome.storage.sync.set({pages: pagesCache});
			/*
			chrome.storage.sync.get(['pages'], (res) => console.log(res.pages));
			*/
		});
	}
});

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
	console.log(`Tab just got removed: ${tabId}`);
});
