function buildURL(url) {
	try {
		const urlObj = new URL(url);
		const protocol = urlObj.protocol.split(":")[0];

		return {
			url: urlObj,
			stat: config.protocols.includes(protocol)
		}
	} catch (e) {
	}

	return null;
}
