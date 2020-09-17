const alarmAction = {
	updatePageTime: async () => {
		log("Updating page time for every focused host");
		/*
		if (configCache.focusedOnly) {
			chrome.windows.getLastFocused(null, async (win) => {
				const hasFocus = focused.get(win.id);
				if (win.focused && hasFocus) {
					await updatePageAndFocusTime(hasFocus);
				} else if (!win.focused && hasFocus) {
					hasFocus.focusedAt = Date.now();
				}
			});
		} else {
		*/
		focused.forEach(async (host) => {
			if (host) {
				await updatePageAndFocusTime(host);
			}
		});

	},
};

chrome.alarms.onAlarm.addListener(async (alarm) => {
	const action = alarmAction[alarm.name];

	log(`Fired up alarm: ${alarm.name}`);
	await action();
});

chrome.alarms.create("updatePageTime", {
	periodInMinutes: 1
});
