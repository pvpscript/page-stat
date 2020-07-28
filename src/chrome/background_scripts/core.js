const focused = new Map();
/* Keeps a map for the focused host in the focused window
 *
 * scheme:
 *
 * windowId => Host
 * 
 */

function updateFocus(windowId, currentHost) {
	const hasFocus = focused[windowId];

	if (!hasFocus) {
		focused[windowId] = new Host(currentHost);
	} else if (currentHost != hasFocus.host) {
		updateHostTime(hasFocus);
		focused[windowId] = new Host(currentHost);
	}
}


