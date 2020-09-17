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
				log(`Tab ${activeInfo.tabId} just got activated with URL: ${urlContainer.url}`);

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
				log(`Tab ${tabId} just got activated with URL: ${urlContainer.url}`);

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
	log(`Tab ${tabId} just got removed`);
});
