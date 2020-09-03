var ctx = document.getElementById('stats-chart').getContext('2d');
var chart = new Chart(ctx, {
    type: 'bar',
    data: {
        /* labels: ['2020/03/28', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'], */
        datasets: [{
            label: 'Data name',
            /* data: [12, 19, 3, 5, 2, 3], */
            /* data: [], */
            backgroundColor: 'blue',
           /*  backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ], */
            borderWidth: 0
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});

(() => {
	chart.config.options.maintainAspectRatio = false;
//	chart.canvas.parentNode.style.height = "30%";
  	chart.data.datasets.forEach((dataset) => {
		for(let i = 0; i < 20; i++) {
			chart.data.labels.push("Hello");
			const rng = Math.ceil(100 * Math.random());
			dataset.data.push(rng);
		}
  	});
  	chart.update();
  	console.log(chart);
})();
/* myChart.data = [12, 19, 3, 5, 2, 3]; */
