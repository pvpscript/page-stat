let pagesCache = {}; /* Stored pages cache */
let onUpdatedUrl = null;

chrome.tabs.onActivated.addListener((activeInfo) => {
	chrome.storage.local.get(['pages'], (res) => {
		pagesCache = res.pages;

		chrome.tabs.get(activeInfo.tabId, async (tab) => {
			const urlContainer = buildURL(tab.url);

			if (urlContainer) {
				log(`Tab ${activeInfo.tabId} just got activated with URL: ${urlContainer.url}`);

				await updateFocus(tab.windowId, urlContainer);
			}

			chrome.storage.local.set({pages: pagesCache});
		});
	});
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	onUpdatedUrl = changeInfo.url || onUpdatedUrl;

	if (changeInfo.status == "complete" && onUpdatedUrl) {
		onUpdatedUrl = null;

		chrome.storage.local.get(['pages'], async (res) => {
			pagesCache = res.pages;

			const urlContainer = buildURL(tab.url);

			if (urlContainer) {
				log(`Tab ${tabId} just got activated with URL: ${urlContainer.url}`);

				await updateFocus(tab.windowId, urlContainer);
			}

			chrome.storage.local.set({pages: pagesCache});
		});
	}
});

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
	log(`Tab ${tabId} just got removed`);
});
