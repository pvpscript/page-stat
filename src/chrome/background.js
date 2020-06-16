const blacklistRule = {
	conditions: [new chrome.declarativeContent.PageStateMatcher({
		pageUrl: {hostEquals: 'developer.chrome.com'},
	})
	],
	actions: []
};

const blacklist = fetch(chrome.runtime.getURL("blacklist.json"), {
	method: 'GET',
	mode: 'cors',
	cache: 'no-cache',
	headers: {
		'Accept': 'application/json'
	}
}).then(data => data.json());

const regex = new RegExp(/^(([a-zA-Z]*:\/\/(\/)?)?(www\.)?(.+?)(?=(\/|#|\?|$)))/i);

function checkBlacklist(tabId, changeInfo, tab) {
	//alert(chrome.runtime.getURL("blacklist.json"));
	//const rawUrl = regex.exec(tab.url)[5];
	//console.log(tab);
	
	if (tab.url.indexOf("https") >= 0) {
		chrome.storage.sync.set({blacklisted: true}); // stores blacklisted site flag
		chrome.browserAction.setIcon({tabId: tabId, path:"images/test.png"}, () => {
			console.log("Icon has been changed");
		});
	} else {
		chrome.storage.sync.set({blacklisted: false});
	}
	
	//chrome.pageAction.show(tabId);
	/*
	blacklist.then(list => {
		if (list.pages.includes(rawUrl)) {
			//chrome.pageAction.setPopup({popup: "test.html"});
		}
	});
	*/
}

/*
chrome.tabs.onActivated.addListener((activeInfo) => {
	console.log(`tabId: ${activeInfo.tabId}`);
	console.log(`windowId: ${activeInfo.windowId}`);

	chrome.tabs.get(activeInfo.tabId, (tab) => {
		console.log(`[get] tab ${tab.id} url -> ${tab.url}`);
		if (tab.url.indexOf("https") >= 0) {
			chrome.browserAction.setIcon({tabId: tab.id, path:"images/seiti.png"}, () => {
				console.log("Icon has been changed");
			});
		}
	});
});
*/

chrome.tabs.query({}, (tabs) => {
	console.log(tabs);
});

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
	console.log(`Tab with id "${tabId}" was closed!`);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	checkBlacklist(tabId, changeInfo, tab);

	if (tab.url) {
		const url = new URL(tab.url);

		if (
			url.protocol == "about:" ||
			url.protocol == "chrome:"
		) {
			chrome.browserAction.disable(activeInfo.tabId);
		}
		chrome.storage.sync.set({host: url.host});
	}
});

chrome.tabs.onActivated.addListener((activeInfo) => {
	chrome.tabs.get(activeInfo.tabId, (tab) => {
		checkBlacklist(activeInfo.tabId, null, tab);

		if (tab.url) {
			const url = new URL(tab.url);

			if (
				url.protocol == "about:" ||
				url.protocol == "chrome:"
			) {
				chrome.browserAction.disable(activeInfo.tabId);
			}
			chrome.storage.sync.set({host: url.host});
		}
	});
});

chrome.runtime.onInstalled.addListener(function(message, sender, sendResponse) {
	chrome.storage.sync.set({color: '#3aa757'}, function() {
		console.log("The color is green");
	});

	/*chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
		chrome.declarativeContent.onPageChanged.addRules([
			blacklistRule
		]);
	});*/
	/*chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
		chrome.declarativeContent.onPageChanged.addRules([{
			conditions: [new chrome.declarativeContent.PageStateMatcher({
				pageUrl: {hostEquals: 'developer.chrome.com'},
			})
			],
				actions: [new chrome.declarativeContent.ShowPageAction()]
		}]);
	});
	*/
});
