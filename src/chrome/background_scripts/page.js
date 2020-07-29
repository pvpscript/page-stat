const faviconAPI = "https://www.google.com/s2/favicons?domain=";

class Page {
	constructor(host) {
		return (async () => {
			this.time = Date.now() - host.focusedAt;
			this.favicon = await fetch(faviconAPI + host.host)
				.then(res => res.blob())
				.then(blob => new Promise((resolve, reject) => {
					const reader = new FileReader();
					reader.onloadend = () => {
						resolve(reader.result);
					}
					reader.onerror = reject;
					reader.readAsDataURL(blob);
				}));

			return this;
		})();
	}
}
