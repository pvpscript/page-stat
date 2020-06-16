/*
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
*/

function tabAction(tabId, changeInfo, tab) {
	checkBlacklist(tabId, changeInfo, tab);

	if (tab.url) {
		const url = new URL(tab.url);

		if (
			url.protocol == "about:" ||
			url.protocol == "chrome:"
		) {
			chrome.browserAction.disable(tabId);
		}
		chrome.storage.sync.set({host: url.host});
	}
}


function checkBlacklist(tabId, changeInfo, tab) {
	const url = new URL(tab.url);

	chrome.storage.sync.get('blacklist', (data) => {	
		if (data.blacklist.includes(url.host)) {
			chrome.storage.sync.set({blacklisted: true}); // stores blacklisted site flag
			chrome.browserAction.setIcon({
				tabId: tabId,
				path:"images/test.png"
			}, () => {
				console.log("Icon has been changed");
			});
		} else {
			chrome.storage.sync.set({blacklisted: false});
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
		chrome.storage.sync.get('blacklist', (data) => {
			data.blacklist.push(host);
			console.log(data.blacklist);
			chrome.storage.sync.set({blacklist: data.blacklist});
		});
	},
	'unban': (host) => {
		chrome.storage.sync.get('blacklist', (data) => {
			const index = data.blacklist.indexOf(host);
			data.blacklist.splice(index, 1);
			console.log(data.blacklist);
			chrome.storage.sync.set({blacklist: data.blacklist});
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
		blacklist: [],
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
