const alarmAction = {
	updatePageTime: async () => {
		console.log("alarm -> updatePageTime");
		if (configCache.focusedOnly) {
			chrome.windows.getLastFocused(null, async (win) => {
				const hasFocus = focused.get(win.id);
				if (win.focused && hasFocus) {
					await updatePageAndFocusTime(hasFocus);
				}

			});
		} else {
			focused.forEach(async (host) => {
				if (host) {
					await updatePageAndFocusTime(host);
				}
			});
		}

	},
};

chrome.alarms.onAlarm.addListener(async (alarm) => {
	const action = alarmAction[alarm.name];

	await action();
});

chrome.alarms.create("updatePageTime", {
	periodInMinutes: 1
});
