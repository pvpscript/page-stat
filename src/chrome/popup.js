const hostname = document.getElementById("hostname");
const cbSwitch = document.getElementById("switch-shadow");
const spent = document.getElementById("spent");

cbSwitch.addEventListener('change', (e) => {
	/*
	chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
		chrome.tabs.sendMessage(tabs[0].id, {
			call: e.target.checked ? 'unban' : 'ban',
		});
	});
	*/
	chrome.runtime.sendMessage({
		call: e.target.checked ? 'unban' : 'ban',
	});
});

const methods = {
	'inactivated': () => {},
	'activated': () => {},
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
});

chrome.storage.sync.get('host', (data) => {
	hostname.innerText = data.host;
});

chrome.storage.sync.get('inactivated', (data) => {
	if (!data.inactivated) {
	spent.style.display = 'inline';
	//cbSwitch.checked = true;
} else {
	cbSwitch.checked = false;
}
});

/*
chrome.storage.sync.get('color', function(data) {
	changeColor.style.backgroundColor = data.color;
});
*/
