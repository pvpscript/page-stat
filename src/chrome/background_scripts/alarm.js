const alarmAction = {
	updateHostTime: async () => {
		console.log("alarm -> updateHostTime");
		if (configCache.focusedOnly) {
			chrome.windows.getLastFocused(null, async (win) => {
				const hasFocus = focused.get(win.id);
				if (win.focused && hasFocus) {
					await alarmUpdateHost(hasFocus);
				}

			});
		} else {
			focused.forEach(async (host) => {
				if (host) {
					await alarmUpdateHost(host);
				}
			});
		}

	},
};

async function alarmUpdateHost(host) {
	await updateHostTime(host);
	host.focusedAt = Date.now();

	chrome.storage.sync.set({pages: pagesCache});
}


chrome.alarms.onAlarm.addListener(async (alarm) => {
	const action = alarmAction[alarm.name];

	await action();
});

chrome.alarms.create("updateHostTime", {
	periodInMinutes: 1
});
