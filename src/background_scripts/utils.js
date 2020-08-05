function buildURL(url) {
	try {
		const urlObj = new URL(url);
		const protocol = urlObj.protocol.split(":")[0];
		const protocolMatching = configCache.pMatching
			? configCache.protocols.includes(protocol)
			: !configCache.protocols.includes(protocol);

		const stat = protocolMatching &&
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

	chrome.storage.local.set({pages: pagesCache});
}

function today(utc) {
	let date = utc ? new Date(utc) : new Date();

	return date.getFullYear() + "-" +
		(date.getMonth() + 1) + "-" +
		date.getDate();
}

function log(msg, logCall) {
	const call = logCall || console.log;

	if (configCache.log) {
		call(msg);
	}
}

