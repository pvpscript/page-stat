let currentWindowId = -1;

/* Ensures no extra time will be added to focused hosts of unfocused windows */
chrome.windows.onFocusChanged.addListener(async (winId) => {
	const lastFocus = focused.get(currentWindowId);
	const currFocus = focused.get(winId);

	if (lastFocus) {
		await alarmUpdateHost(lastFocus);
	}
	if (currFocus) {
		currFocus.focusedAt = Date.now();
	}

	currentWindowId = winId;
});
