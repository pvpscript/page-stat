class Page {
	constructor(host) {
		this.time = Date.now() - host.focusedAt;
		this.favicon = null;
	}
}
