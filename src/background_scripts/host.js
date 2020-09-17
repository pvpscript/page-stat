class Host {
	constructor(host) {
		this.host = host;
		this.focusedAt = Date.now();
	}
}

async function updatePageTime(host) {
	log(`Updating page time for "${host.host}"`)

	const page = pagesCache[host.host];
	const todayDate = today();
	//pagesCache[Math.floor(Math.random()*10)] = Math.random().toString(36);

	if (page) {
		if (page.time[todayDate]) {
			page.time[todayDate] += Date.now() - host.focusedAt;
		} else {
			const todayUTC = new Date(todayDate +
				" 00:00:00").getTime();
			const firstDay = today(host.focusedAt);

			timeBetweenDays(page, host.focusedAt, firstDay,
				todayUTC);
		}
	} else {
		pagesCache[host.host] = await new Page(host);
	}
}

const wholeDay = 86400000; // 24*60*60*1000

function timeBetweenDays(page, start, firstDay, todayUTC) {
	if (todayUTC - start > wholeDay) {
		timeBetweenDays(page, start + wholeDay, firstDay, todayUTC);

		page.time[today(start + wholeDay)] = wholeDay;
	} else {
		page.time[firstDay] = todayUTC - start;
		page.time[today(todayUTC)] = Date.now() - todayUTC;
	}
}

