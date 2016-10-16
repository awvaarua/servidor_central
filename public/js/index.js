function GetNodos(fichero, status) {
    $.ajax({
		url: '/nodos/',
		type: 'GET',
		success: function (response) {
            GetDataNodos(response.nodos, fichero);
            if(status){
                GetStatusNodos(response.nodos);
            }            
		}
	});
}

function GetStatusNodos(nodos){
    nodos.forEach(function(nodo){        
        $.ajax({
            url: '/nodo/' + nodo.mac + '/status',
            type: 'GET',
            success: function (response) {
                var str = "";
                if (response.status == "online") {                    
                    str = "<div class=\"row\">" +
"                                    <div class=\"col-lg-12\">" +
"                                        <h5><span><img src=\"/img/online.png\"/></span> "+nodo.nombre+"</h5>" +
"                                    </div>" +
"                                </div>";
                } else {
                    str = "<div class=\"row\">" +
"                                    <div class=\"col-lg-12\">" +
"                                        <h5><span><img src=\"/img/offline.png\"/></span> "+nodo.nombre+"</h5>" +
"                                    </div>" +
"                                </div>";
                }
                $('#statuslist').append(str);
            }
        });
    });
}

$( document ).ready(function() {
	GetNodos("temperatura.py", true);
});

function GetDataNodos(nodos, tipo) {    
    nodos.forEach(function(nodo){
        $.ajax({
            url: '/data/'+nodo.mac,
            data: {
                fichero: tipo,
                data: 30
            },
            type: 'POST',
            success: function (response) {
                var datos = [];
                response.datos.valores.forEach(function(data, i){
                    if(i <= 30){
                        datos.push(parseFloat(data.valor));
                    }                    
                });
                chart.addSeries({
                    name: nodo.nombre,
                    data: datos,
                    point: {
                        events: {
                            hover: function (e) {
                                hs.htmlExpand(null, {
                                    headingText: this.series.name,
                                    maincontentText: Highcharts.dateFormat('%A, %b %e, %Y', this.x) + ':<br/> ',
                                    width: 200
                                });
                            }
                        }
                    }
                });
            }
        });
    });
}

function CreateChar(fichero){
    chart = new Highcharts.Chart('container',{
        title: {
            text: 'Temperatura diaria',
            x: -20 //center
        },
        subtitle: {
            text: 'Últimas muestras',
            x: -20
        },
        xAxis: {
            categories: []
        },
        yAxis: {
            title: {
                text: 'Temperature (°C)'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: '°C'
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        }
    });
    GetNodos(fichero);
}

var chart;

$(function () {
    chart = new Highcharts.Chart('container',{
        title: {
            text: 'Temperatura diaria',
            x: -20 //center
        },
        subtitle: {
            text: 'Últimas muestras',
            x: -20
        },
        xAxis: {
            categories: []
        },
        yAxis: {
            title: {
                text: 'Temperature (°C)'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: '°C'
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        }
    });
});