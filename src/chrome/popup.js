const hostname = document.getElementById("hostname");
const cbSwitch = document.getElementById("switch-shadow");
const spent = document.getElementById("spent");

hostname.innerText = "developer.fourhourworkweek.com";

cbSwitch.addEventListener('change', (e) => {
  if (e.target.checked) {
  	console.log("On");
  } else {
  	console.log("Off");
  }
});

chrome.storage.sync.get('blacklisted', (data) => {
	if (!data.blacklisted) {
		spent.style.display = 'inline';
	}
});

/*
chrome.storage.sync.get('color', function(data) {
	changeColor.style.backgroundColor = data.color;
});
*/
