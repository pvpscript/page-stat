function buildURL(url) {
	try {
		const urlObj = new URL(url);
		const protocol = urlObj.protocol.split(":")[0];
		const stat = configCache.protocols.includes(protocol) &&
			!configCache.inactive.includes(urlObj.host);

		return {
			url: urlObj,
			stat: stat
		}
	} catch (e) {
	}

	return null;
}

async function updatePageAndFocusTime(host) {
	await updatePageTime(host);
	host.focusedAt = Date.now();

	chrome.storage.sync.set({pages: pagesCache});
}
