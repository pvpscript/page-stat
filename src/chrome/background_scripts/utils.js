function buildURL(url) {
	try {
		return new URL(url);
	} catch (e) {
	}

	return null;
}
