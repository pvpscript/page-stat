window.location.hash = "#storage";

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
		].filter((v, i, self) => self.indexOf(v) === i).sort();

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
	
	const logNode = document.getElementById("log");
	logNode.checked = config.log;
});

import { methods } from "./settings.js";

// Listen for changes
const settings = document.getElementById("settings");
settings.addEventListener("change", (e) => {
	console.log(`${e.target.name}: ${e.target.id}`);
	console.log(e.target);

	const action = methods[e.target.name];
	action(e.target);
});

// Set storage structure
const code = document.getElementById("storage-structure");
const objStructure = {
	host: {
		favicon: "base64 favicon data",
		time: {
			date: "usage time",
		}
	},
};
const structure = document.createTextNode(
	JSON.stringify(objStructure, null, 4));
code.appendChild(structure);

// Show current storage usage
const usageNode = document.getElementById("curr-usage");
chrome.storage.local.getBytesInUse((res) => 
	usageNode.innerText = res + "B"
);

// Save storage data
const getData = {
	pagesStorage: (anchor) => {
		chrome.storage.local.get(['pages'], (res) => {
			const data = new Blob(
				[JSON.stringify(res.pages, null, '\t')],
				{type: "application/json"}
			);
			anchor.download = "pagesStorage.json";
			anchor.href = URL.createObjectURL(data);
		});
	},
	settingsStorage: (anchor) => {
		chrome.storage.sync.get(['config'], (res) => {
			const data = new Blob(
				[JSON.stringify(res.config, null, '\t')],
				{type: "application/json"}
			);
			anchor.download = "settingsStorage.json";
			anchor.href = URL.createObjectURL(data);
		});
	}
}

const downloaders = document.getElementsByName("download");
downloaders.forEach((a) => getData[a.id](a));

// Import data

import { validateImport } from "./validator.js";

const storeImport = {
	pagesImport: (data) => {
		chrome.storage.local.set({pages: data});

		chrome.runtime.sendMessage({
			type: "updatePagesCache",
			data: {pages: data}
		});
	},
	settingsImport: (data) => {
		chrome.storage.sync.set({config: data});

		chrome.runtime.sendMessage({
			type: "updateConfigCache",
			data: {config: data}
		});
	}
};
const importTable = document.getElementById("import-table");
importTable.addEventListener("change", (e) => {
	const element = e.target;
	const reader = new FileReader();

	const errorNode = document.getElementById("import-error");
	const successNode = document.getElementById("import-success");

	reader.onload = () => {
		errorNode.style.visibility = "hidden";
		errorNode.textContent = "";
		successNode.style.visibility = "hidden";
		successNode.textContent = "";
	}

	reader.onloadend = () => {
		const json = JSON.parse(reader.result);
		const action = validateImport[element.id];

		action(json, (stat, msg) => {
			if (stat) {
				storeImport[element.id](json);

				successNode.textContent = msg +
					" [Data applied successfully]";
				successNode.style.visibility = "visible";
			} else {
				errorNode.textContent = 
					"Invalid JSON. [" + msg + "]";

				errorNode.style.visibility = "visible";
			}
		});
	}

	if (element.files && element.files.length > 0) {
		reader.readAsText(element.files[0]);
	}
});
