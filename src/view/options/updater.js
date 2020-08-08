function updatePages() {
	chrome.storage.sync.get(['config'], (res) => {
		const config = res.config;

		chrome.storage.local.get(['pages'], (p) => {
			const pages = Object.keys(p.pages);
			const hosts = [
				...pages,
				...config.inactive
			].filter((v, i, self) => self.indexOf(v) === i).sort();

			const table = document.getElementById("host-table");
			table.removeChild(table.lastElementChild);

			const checkbox = document.createElement("input");
			checkbox.type = "checkbox";

			for (let h of hosts) {
				const pChk = checkbox.cloneNode();
				pChk.name = "hostStatus";
				pChk.checked = !config.inactive.includes(h);
				pChk.id = h;

				const row = table.insertRow();
				const hostCell = row.insertCell();
				hostCell.appendChild(
					document.createTextNode(h));

				const chkCell = row.insertCell();
				chkCell.classList.value = "center";
				chkCell.appendChild(pChk);
			}
		});
	});
}

function updateSettings() {
	chrome.storage.sync.get(['config'], (res) => {
		const config = res.config;

		const protocols = document.getElementById("protocols");
		const pOpt = document.getElementById(
			config.pMatching ? "include" : "exclude"
		);

		protocols.value = config.protocols;
		pOpt.checked = true;

		document.getElementsByName("hostStatus").forEach((h) => {
			h.checked = !config.inactive.includes(h.id);
		});

		const logNode = document.getElementById("log");
		logNode.checked = config.log;
	});
}

const updateOptionsSettings = {
	settingsImport: () => updateSettings(),
	pagesImport: () => updatePages()
};

export { updateOptionsSettings };
