window.location.hash = "#settings";

// Populate inputs
chrome.storage.sync.get(['config'], (res) => {
	const config = res.config;

	const protocols = document.getElementById("protocols");
	const pOpt = document.getElementById(
		res.config.pMatching ? "include" : "exclude"
	);

	protocols.value = res.config.protocols;
	pOpt.checked = true;

	chrome.storage.local.get(['pages'], (p) => {
		const pages = Object.keys(p.pages);
		const hosts = [
			...pages,
			...config.inactive
		].sort();

		console.log(hosts);

		const table = document.getElementById("host-table");
		const checkbox = document.createElement("input");
		checkbox.type = "checkbox";

		for (let h of hosts) {
			const pChk = checkbox.cloneNode();
			pChk.name = "hostStatus";
			pChk.checked = !config.inactive.includes(h);
			pChk.id = h;

			const row = table.insertRow();
			const hostCell = row.insertCell();
			hostCell.appendChild(document.createTextNode(h));

			const chkCell = row.insertCell();
			chkCell.classList.value = "center";
			chkCell.appendChild(pChk);
		}
	});
	
	const log = document.getElementById("log");
	log.checked = config.log;
});

// Listen for changes
const settings = document.getElementById("settings");
settings.addEventListener("change", (e) => {
	console.log(`${e.target.name}: ${e.target.id}`);
});
