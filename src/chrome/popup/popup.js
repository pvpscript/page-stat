const header = document.getElementById("header");
const content = document.getElementById("content");
const footer = document.getElementById("footer");

const hostname = document.getElementById("hostname");
const cbSwitch = document.getElementById("switch-shadow");
const spentSection = document.getElementById("spent");
const spentTime = document.getElementById("spent-time");

cbSwitch.addEventListener('change', (e) => {
	chrome.runtime.sendMessage({
		type: 'statusChange',
		data: {hostStatus: !e.target.checked}
	});
});

chrome.runtime.sendMessage({type: "popup", data: null}, (res) => {
	header.style.display = 'grid';
	content.style.display = 'inline';

	console.log("popup response");
	console.log(res);

	hostname.innerText = res.host;
	cbSwitch.checked = res.hostStatus;

	//if (res.hostStatus) {
		spentSection.style.display = 'inline';
		spentTime.innerText = getFormattedTime(res.time);
	//} else {
	//	spentSection.style.display = 'none';
	//}
});

function getFormattedTime(time) {
	const hours = Math.floor(time / 3600);
	const mins = Math.floor((time - hours * 3600) / 60);
	const secs = Math.floor(time - hours * 3600 - mins * 60);

	return ("0"+hours).slice(-2) +
		":" + ("0"+mins).slice(-2) +
		":" + ("0"+secs).slice(-2);
}
