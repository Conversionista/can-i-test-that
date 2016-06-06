function calculatePlot(id, arr, second) {

    var a = [],
        l = readLocal(id),
        u = l.u1,
        cr = l.c1;

    if (second === true) {
        u = l.u2;
        cr = l.c2;
    }

    $.each(arr, function(index, val) {
        var x = calculateMDU(u, cr, val);
        a.push(x * 100);
    });

    return a;
}

function renderChart(id) {
    var noWeeks = [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12],
        l = readLocal(id);
    var ctx = $('#chart');
    var d1 = calculatePlot(id, noWeeks, false),
        d2 = calculatePlot(id, noWeeks, true);


    var data = {
        labels: noWeeks,
        datasets: [{
            label: l.n1,
            tension: 0,
            backgroundColor: 'rgba(179,181,198,0.2)',
            borderColor: 'rgba(179,181,198,1)',
            pointBackgroundColor: 'rgba(179,181,198,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(179,181,198,1)',
            data: d1
        }, {
            label: l.n2,
            tension: 0,
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            pointBackgroundColor: 'rgba(255,99,132,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(255,99,132,1)',
            data: d2
        }]
    };

    var myRadarChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            tension: 0,
            title: {
                display: true,
                text: 'Custom Chart Title'
            },
            defaultFontFamily: '"Source Sans Pro", "Helvetica Neue", Helvetica, Arial, sans-serif',
            scales: {
                xAxes: [{
                    time: {
                        unit: 'week'
                    }
                }]
            }
        }
    });

}


$('#modalChart').on('show.bs.modal', function(e) {
    window.setTimeout(function() {
        var h = $('#modalChart .modal-body').innerHeight(),
            w = $('#modalChart .modal-body').innerWidth();
        w = w - 40;

        $('#chart').attr('height', h).attr('width', w);
    }, 500);
})
