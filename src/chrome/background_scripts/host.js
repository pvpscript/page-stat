class Host {
	constructor(host) {
		this.host = host;
		this.focusedAt = Date.now();
	}
}

function updateHostTime(host) {
	const page = pagesCache[host.host];
	//pagesCache[Math.floor(Math.random()*10)] = Math.random().toString(36);


	if (page) {
		page.time += Date.now() - host.focusedAt;
	} else {
		pagesCache[host.host] = new Page(host);
	}
}
