const hostname = document.getElementById("hostname");
const cbSwitch = document.getElementById("switch-shadow");
const spentTime = document.getElementById("spent-time");

cbSwitch.addEventListener('change', (e) => {
	chrome.runtime.sendMessage({
		type: 'statusChange',
		data: {hostStatus: !e.target.checked}
	});
});

chrome.runtime.sendMessage({type: "popup", data: null}, (res) => {
	hostname.innerText = res.host;
	cbSwitch.checked = res.hostStatus;

	if (res.time < 0) {
		cbSwitch.disabled = true;
	}

	spentTime.innerText = getFormattedTime(res.time);
});

function getFormattedTime(time) {
	if (time > -1) {
		const hours = Math.floor(time / 3600);
		const mins = Math.floor((time - hours * 3600) / 60);
		const secs = Math.floor(time - hours * 3600 - mins * 60);

		return ("0"+hours).slice(-2) +
			":" + ("0"+mins).slice(-2) +
			":" + ("0"+secs).slice(-2);
	}

	return "--:--:--";
}
