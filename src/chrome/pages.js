class Page {
	constructor(host, favicon) {
		this._host = host;
		this._favicon = favicon;
		this._time = 0;
	}

	get host() {
		return this._host;
	}

	get favicon() {
		return this._favicon;
	}

	set time(time) {
		this._time = time;
	}

	get time() {
		return this._time;
	}
}
