function tabAction(tabId, changeInfo, tab) {
	if (tab.url) {
		const url = new URL(tab.url);

		checkBlacklist(tabId, url.host);

		if (
			url.protocol == "about:" ||
			url.protocol == "chrome:"
		) {
			chrome.browserAction.disable(tabId);
		}
		chrome.storage.sync.set({host: url.host});
	}
}


function checkBlacklist(tabId, host) {
	chrome.storage.sync.get('inactive', (data) => {	
		if (data.inactive.includes(host)) {
			chrome.storage.sync.set({inactivated: true}); // stores inactivated site flag
			chrome.browserAction.setIcon({
				tabId: tabId,
				path:"images/test.png"
			}, () => {
				console.log("Icon has been changed");
			});
		} else {
			chrome.storage.sync.set({inactivated: false});
		}
	});
}

chrome.tabs.query({}, (tabs) => {
	console.log(tabs);
});

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
	console.log(`Tab with id "${tabId}" was closed!`);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	tabAction(tabId, changeInfo, tab);
});

chrome.tabs.onActivated.addListener((activeInfo) => {
	chrome.tabs.get(activeInfo.tabId, (tab) => {
		tabAction(activeInfo.tabId, null, tab);
	});
});

const methods = {
	'ban': (host) => {
		chrome.storage.sync.get('inactive', (data) => {
			data.inactive.push(host);
			console.log(data.inactive);
			chrome.storage.sync.set({inactive: data.inactive});
		});
	},
	'unban': (host) => {
		chrome.storage.sync.get('inactive', (data) => {
			const index = data.inactive.indexOf(host);
			data.inactive.splice(index, 1);
			console.log(data.inactive);
			chrome.storage.sync.set({inactive: data.inactive});
		});
	}
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	const action = methods[request.call];

	chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
		const url = new URL(tabs[0].url);
		action(url.host);

		tabAction(tabs[0].id, null, tabs[0]);
	});

	console.log(`Request ${JSON.stringify(request)}`);
	console.log(`Sender ${JSON.stringify(sender)}`);
});

chrome.runtime.onInstalled.addListener(function(message, sender, sendResponse) {
	chrome.storage.sync.set({
		inactive: [],
	}, () => {
		console.log("Local data set as empty.");
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
