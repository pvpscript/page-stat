const hostname = document.getElementById("hostname");
const hoststatus = document.getElementById("hoststatus");
const cbSwitch = document.getElementById("switch-shadow");

hostname.innerText = "developer.fourhourworkweek.com";
hostname.style.color = "#06758F";

hoststatus.innerText = "ACTIVE";
//hoststatus.style.color = "#8F0B00";
hoststatus.style.color = "#4A8F06";

cbSwitch.addEventListener('change', (e) => {
	if (e.target.checked) {
  	console.log("On");
  } else {
  	console.log("Off");
  }
});

chrome.storage.sync.get('color', function(data) {
	changeColor.style.backgroundColor = data.color;
});
