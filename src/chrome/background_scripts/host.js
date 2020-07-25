class Host {
	constructor(host) {
		this.host = host;
		this.focusedAt = Date.now();
	}
}

function updateHostTime(host) {
	const page = pages[host.host];

	if (page) {
		page.time += Date.now() - host.focusedAt;
	} else {
		pages[host.host] = new Page(host);
	}
}
