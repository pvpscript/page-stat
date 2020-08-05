const methods = {
	hostStatus: (payload) => changeHostStatus(payload),
	pMatching: (payload) => changeProtocolMatching(payload),
	log: (payload) => changeLogging(payload),
	protocols: (payload) => updateProtocolList(payload),
};

function changeHostStatus(payload) {
	chrome.storage.sync.get(['config'], (res) => {
		const config = res.config;

		if (!payload.checked) {
			config.inactive.push(payload.id);
		} else {
			const index = config.inactive.indexOf(payload.id);
			config.inactive.splice(index, 1);
		}

		chrome.storage.sync.set({config: res.config});
		chrome.runtime.sendMessage({
			type: "updateConfigCache",
			data: {config: res.config}
		});
	});
}

function changeProtocolMatching(payload) {
	chrome.storage.sync.get(['config'], (res) => {
		res.config.pMatching = payload.id === "include"
			? true
			: false;

		chrome.storage.sync.set({config: res.config});
		chrome.runtime.sendMessage({
			type: "updateConfigCache",
			data: {config: res.config}
		});
	});
}

function changeLogging(payload) {
	chrome.storage.sync.get(['config'], (res) => {
		res.config.log = !payload.checked;

		chrome.storage.sync.set({config: res.config});
		chrome.runtime.sendMessage({
			type: "updateConfigCache",
			data: {config: res.config}
		});
	});
}

function updateProtocolList(payload) {
	const error = document.getElementById("protocol-error");

	if (payload.checkValidity()) {
		error.style.visibility = "hidden";

		chrome.storage.sync.get(['config'], (res) => {
			res.config.protocols = payload.value.split(",");

			chrome.storage.sync.set({config: res.config});
			chrome.runtime.sendMessage({
				type: "updateConfigCache",
				data: {config: res.config}
			});
		});
	} else {
		error.style.visibility = "visible";
	}
}

export { methods };
