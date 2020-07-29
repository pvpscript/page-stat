function buildURL(url) {
	try {
		const urlObj = new URL(url);
		const protocol = urlObj.protocol.split(":")[0];
		const stat = config.protocols.includes(protocol) &&
			!config.inactive.includes(urlObj.host);

		return {
			url: urlObj,
			stat: stat
		}
	} catch (e) {
	}

	return null;
}
