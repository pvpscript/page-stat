let pagesCache = {}; /* Stored pages cache */
let onUpdatedUrl = null;

chrome.tabs.onActivated.addListener((activeInfo) => {
	chrome.storage.local.get(['pages'], (res) => {
		pagesCache = res.pages;

		chrome.tabs.get(activeInfo.tabId, async (tab) => {
			const urlContainer = buildURL(tab.url);

			/*
			console.log("-------------------- Before --------------------");
			console.log(pagesCache);
			console.log("------------------------------------------------");
			*/

			if (urlContainer) {
				console.log(`Tab just got activated: ${urlContainer.url}`);
				console.log(tab);

				await updateFocus(tab.windowId, urlContainer);
			}

			/*
			console.log("-------------------- After --------------------");
			console.log(pagesCache);
			chrome.storage.sync.get(['pages'], (res) => console.log(res.pages));
			console.log("-----------------------------------------------");
			*/
			chrome.storage.local.set({pages: pagesCache});
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

		chrome.storage.local.get(['pages'], async (res) => {
			pagesCache = res.pages;

			/*
			console.log("-------------------- Before --------------------");
			console.log(pagesCache);
			console.log("------------------------------------------------");
			*/

			const urlContainer = buildURL(tab.url);

			if (urlContainer) {
				console.log(`Tab just got updated: ${urlContainer.url}`);
				console.log(tab);

				await updateFocus(tab.windowId, urlContainer);
			}
			/*console.log("-------------------- After --------------------");
			console.log(pagesCache);
			chrome.storage.sync.get(['pages'], (res) => console.log(res.pages));
			console.log("-----------------------------------------------");
			*/
			chrome.storage.local.set({pages: pagesCache});
			/*
			chrome.storage.sync.get(['pages'], (res) => console.log(res.pages));
			*/
		});
	}
});

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
	console.log(`Tab just got removed: ${tabId}`);
});
