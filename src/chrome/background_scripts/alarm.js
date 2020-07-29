const alarmAction = {
	updateHostTime: async () => {
		focused.forEach(async (host) => {
			if (host) {
				await updateHostTime(host);
				host.focusedAt = Date.now();

				chrome.storage.sync.set({pages: pagesCache});
			}
		});
	},
};

chrome.alarms.onAlarm.addListener(async (alarm) => {
	const action = alarmAction[alarm.name];

	await action();
});

chrome.alarms.create("updateHostTime", {
	periodInMinutes: 1
});
