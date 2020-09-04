const ctx = document.getElementById('stats-chart').getContext('2d');
const config = {
	type: 'bar',
	data: {
		//labels: years,
		datasets: [{
			label: "Time",
			backgroundColor: 'rgba(188, 229, 214, 0.7)',
			// pointBackgroundColor: bckColors,
			// data: data,
			// pointBorderWidth: 2,
			// pointRadius: 5,
			// pointHoverRadius: 7
			borderWidth: 1,
		}]
	},
	options: {
		scales: {
			xAxes: [{
				type: 'time',
				position: 'bottom',
				time: {
					displayFormats: {
						parser: "YY-MM-DD",
						day: 'YYYY/MM/DD',
					},
					unit: 'day',
				},
				offset: true,
			}],
			yAxes: [{
				type: 'linear',
				position: 'left',
				ticks: {
					min: new Date('1970-01-01 00:00:00').getTime(),
					// max: moment('1970-01-01 23:59:59').valueOf(),
					stepSize: 3.6e+6,
					// beginAtZero: true,
					callback: value => {
						let date = new Date(value);
						// console.log(date.diff(moment('1970-01-01 23:59:59'), 'minutes'));
						// if(date.diff(moment('1970-01-01 23:59:59'), 'minutes') === 0) {
						//   return null;
						// }

						return date.getHours(); // format HH:mm:ss
					}
				}
			}]
		},
		maintainAspectRatio: false,
	}
};

const chart = new Chart(ctx, config);

//{
//	type: 'bar',
//	data: {
//		/* labels: ['2020/03/28', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'], */
//		datasets: [{
//			label: 'Data name',
//			/* data: [12, 19, 3, 5, 2, 3], */
//			/* data: [], */
//			backgroundColor: 'blue',
//			borderWidth: 0
//		}]
//	},
//	options: {
//		scales: {
//			yAxes: [{
//				type: 'linear',
//				position: 'left',
//				ticks: {
//					beginAtZero: true,
//				}
//			}]
//		},
//		maintainAspectRatio: false,
//	},
//});

(() => {
//	chart.config.options.maintainAspectRatio = false;
//	chart.canvas.parentNode.style.height = "30%";
  	chart.data.datasets.forEach((dataset) => {
		const years = ['2020-03-20', '2020-03-21', '2020-03-25', '2020-03-26'];
		const times = ['00:26:12', '02:54:04', '12:28:29', '12:35:18'];
		const timesData = times.map((t) => new Date(`1970-01-01 ${t}`)); 
		

		//for(let i = 0; i < 20; i++) {
		//	chart.data.labels.push("Hello");
		//	const rng = Math.ceil(100 * Math.random());
		//	dataset.data.push(moment().add(rng, 'd'));
		//}
		years.forEach((y) => chart.data.labels.push(y));
		timesData.forEach((t) => dataset.data.push(t));
  	});
  	chart.update();
  	console.log(chart);
})();
/* myChart.data = [12, 19, 3, 5, 2, 3]; */
