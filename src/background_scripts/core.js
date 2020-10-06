const focused = new Map();
/* Keeps a map for the focused host in the focused window
 *
 * scheme:
 *
 * windowId => Host
 * 
 */

async function updateFocus(windowId, urlContainer) {
	log(`Updating focus on window ${windowId}`);

	const hasFocus = focused.get(windowId);
	const currentHost = urlContainer.url.host;

	if (urlContainer.stat) {
		let existingHost = null;
		for (let [wid, host] of focused) {
			if (host && host.host == currentHost) {
				existingHost = host;
				break;
			}
		}

		const hostSet = existingHost || new Host(currentHost);

		if (!hasFocus) {
			focused.set(windowId, hostSet);
			checkPageExistence(currentHost);
			setRepeatedHostsFocus(currentHost, hostSet);
		} else if (currentHost != hasFocus.host) {
			await updatePageTime(hasFocus);
			focused.set(windowId, hostSet);
		}
	} else if (hasFocus) {
		if (hasFocus.host == currentHost) {
			for (let [wid, host] of focused) {
				if (host && host.host == hasFocus.host) {
					focused.set(wid, null);
				}
			}
		} else {
			focused.set(windowId, null);
		}
		await updatePageTime(hasFocus);
	}
}

function setRepeatedHostsFocus(currentHost, hostSet) {
	for (let [wid, host] of focused) {
		chrome.tabs.query({
			active: true, windowId: wid
		}, (tabs) => {
			if ((new URL(tabs[0].url)).host == currentHost) {
				focused.set(wid, hostSet);
			}
		});
	}
}

function checkPageExistence(host) {
	const page = pagesCache[host];
	const todayDate = today();

	if (page && page.time[todayDate] == undefined) {
		page.time[todayDate] = 0;
	}
}
