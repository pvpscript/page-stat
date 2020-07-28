let pagesCache = {}; /* Stored pages cache */
let onUpdatedUrl = null;

chrome.tabs.onActivated.addListener((activeInfo) => {
	chrome.storage.sync.get(['pages'], (res) => {
		pagesCache = res.pages;

		chrome.tabs.get(activeInfo.tabId, (tab) => {
			const url = buildURL(tab.url);

			/*
			console.log("-------------------- Before --------------------");
			console.log(pagesCache);
			console.log("------------------------------------------------");
			*/

			if (url) {
				console.log(`Tab just got activated: ${url}`);
				console.log(tab);

				updateFocus(tab.windowId, url.host);
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
		urlUpdate(tab);
	}
});

function urlUpdate(tab) {
	chrome.storage.sync.get(['pages'], (res) => {
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

			updateFocus(tab.windowId, url.host);
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

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
	console.log(`Tab just got removed: ${tabId}`);
});

function updatePagesCache(callback) {
	chrome.storage.sync.get(['pages'], (res) => {
		pagesCache = res.pages;

		console.log("-------------------- Before --------------------");
		console.log(pagesCache);
		console.log("------------------------------------------------");
		callback(pagesCache);
		//res.pages[Math.floor(Math.random()*10)] = Math.random().toString(36);
		console.log("-------------------- After --------------------");
		console.log(pagesCache);
		console.log("-----------------------------------------------");

		chrome.storage.sync.set({pages: pagesCache});
		chrome.storage.sync.get(['pages'], (kkj) => {
			console.log("CHEIRO DE LEEMAUN");
			console.log(kkj.pages)
			console.log("CHEIRO DE LEEMAUN");
			console.log(pagesCache);
			console.log("AGUINHA");
		});
	});
}
