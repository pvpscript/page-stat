let ctx = document.getElementById('chart').getContext('2d');
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
			//minBarLength: 2,
			maxBarThickness: 20,
			//barThickness: 30,
			minBarLength: (context) => {
				return context.dataset.data[context.dataIndex] ? 2 : 0
			},
		}]
	},
	plugins: [{
		afterUpdate: function(chart, options) {
			const chartWrapper = document.getElementById("chart-wrapper");

			const chartMaxBarWidth = chart.data.datasets[0].maxBarThickness;
			const scalesX = chart.scales["x-axis-0"];
			const dataset = chart.getDatasetMeta(0).data;

			if (dataset[0] && dataset[0]._model.width < chartMaxBarWidth) {
				const widthPercentage = dataset[0]._model.width * dataset.length / scalesX.width;
				const chartWrapperRelation = scalesX.width / chartWrapper.offsetWidth;
				const maxBarWidth = scalesX.width * widthPercentage;

				const newWrapperWidth = Math.ceil((dataset.length * chartMaxBarWidth) /
					(chartWrapperRelation * widthPercentage));

				chartWrapper.style.width = newWrapperWidth;
				//console.log("--------------------");
				//console.log(maxBarWidth);
				//console.log(chartWrapperRelation);
				//console.log(newWrapperWidth);
			}

			//console.log("chart");
			//console.log(chart);
			//console.log("options");
			//console.log(options);
			//if (chart.scales["x-axis-0"]._gridLineItems) {
			//	chart.scales["x-axis-0"]._gridLineItems.borderValue = 500; 
			//	console.log("XOPOWOZOU");
			//}
		},
	}],
	options: {
		animations: {
			onProgress: (animation) => {
				console.log(animation);
			}
		},
		scales: {
			xAxes: [{
				type: 'time',
				position: 'bottom',
				stacked: false,
				//maxBarThickness: 30,
				//barThickness: 30,
				time: {
					parser: "YYYY-MM-DD",
					displayFormats: {
						day: 'YYYY/MM/DD',
					},
					unit: 'day',
				},
				offset: true,
				//barPercentage: 1,
				//categoryPercentage: 1,
			}],
			yAxes: [{
				type: 'linear',
				position: 'left',
				stacked: true,
				ticks: {
					beginAtZero: true,
					//min: new Date('1970-01-01 00:00:00').getTime(),
					min: 0,
					// max: moment('1970-01-01 23:59:59').valueOf(),
					stepSize: 3.6e+6,
					callback: (val) => {
						//let date = new Date(val);
						//console.log(val);
						// console.log(date.diff(moment('1970-01-01 23:59:59'), 'minutes'));
						// if(date.diff(moment('1970-01-01 23:59:59'), 'minutes') === 0) {
						//   return null;
						// }

						return timeToHumanHours(val / 1000); // format HH:mm:ss
					},
				},
			}],
		},
		tooltips: {
			callbacks: {
				label: (item, data) => {
					return timeToHumanHours(item.yLabel / 1000);
				},
			},
		},
		responsive: true,
		maintainAspectRatio: false,
	}
};

function timeToHumanHours(time) {
	const hours = Math.floor(time / 3600);
	const mins = Math.floor((time - hours * 3600) / 60);
	const secs = Math.floor(
		time - hours * 3600 - mins * 60
	);

	return ("0"+hours).slice(-2) +
		":" + ("0"+mins).slice(-2) +
		":" + ("0"+secs).slice(-2);
}


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

let chart = null;
let starterino = new Date("2020-01-01 00:00:00").getTime()
function oneAtATime() {
	if (!chart) {
		chart = new Chart(ctx, config);
	}
	const rngHours = Math.ceil(Math.random() * 24);
	const rngMins = Math.ceil(Math.random() * 59);
	const rngSecs = Math.ceil(Math.random() * 59);
	const time = ("0" + rngHours).slice(-2) + ":" + ("0" + rngMins).slice(-2) + ":" + ("0" + rngSecs).slice(-2);
	const timesData = Date.UTC(1970, 0, 1, ...time.split(":"));

	const date = new Date(starterino);
	const dateStr = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);
	

	console.log(dateStr, timesData);

	chart.data.labels.push(dateStr)
	chart.data.datasets[0].data.push(timesData);
	chart.update();

	starterino += 86400000;

	//let element = document.querySelector(".chart-wrapper");
	//let width = element.offsetWidth;
	//width += 30;
	//element.style.width = width;
}

function drawChart(time) {
	if (window.chartObj) {
		// Chart reset workaround
		window.chartObj.data.labels = [];
		window.chartObj.data.datasets[0].data = [];
		window.chartObj.update(config);
		window.chartObj.ctx.canvas.parentNode.style.width = "100%";
	} else {
		window.chartObj = new Chart(ctx, config);
	}

	for (let t in time) {
		console.log(t);
		console.log(time[t]);
		window.chartObj.data.labels.push(t);
		window.chartObj.data.datasets[0].data.push(time[t]);
	};
	window.chartObj.update();
}

function drawStuff() {
	const chart = new Chart(ctx, config);
	console.log(chart);
//	chart.config.options.maintainAspectRatio = false;
//	chart.canvas.parentNode.style.height = "30%";
  	chart.data.datasets.forEach((dataset) => {
		let years = ['2020-03-20', '2020-03-21', '2020-03-22', '2020-03-25', '2020-03-26', '2020-03-27', '2020-04-20', '2020-04-21', '2020-04-22', '2020-04-25', '2020-04-26', '2020-04-27', '2020-04-28', '2020-03-28'];
		let times = ['00:26:12', '02:54:04', '12:28:29', '23:44:10', '12:35:18', '00:00:02', '00:00:00'];
		times = [...times, ...times];
		const timesData = times.map((t) => Date.UTC(1970, 0, 1, ...t.split(":"))); 
		

		//for(let i = 0; i < 20; i++) {
		//	chart.data.labels.push("Hello");
		//	const rng = Math.ceil(100 * Math.random());
		//	dataset.data.push(moment().add(rng, 'd'));
		//}
		//let element = document.querySelector(".chart-wrapper");
		//let width = element.offsetWidth;

		for (let i = 0; i < years.length; i++) {
			chart.data.labels.push(years[i]);
			dataset.data.push(timesData[i]);
			//console.log(`${i} -> ${element.offsetWidth}`);
			//width += 30;
			//element.style.width = width;
		}
		//years.forEach((y) => chart.data.labels.push(y));
		//timesData.forEach((t) => dataset.data.push(t));
  	});
  	chart.update();
  	console.log(chart);
};
/* myChart.data = [12, 19, 3, 5, 2, 3]; */

export { drawChart };
