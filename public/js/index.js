var chart;
var scripts_index = [];
var temperatura_index = {
    titulo: "Temperatura",
    ejey: "Temperatura (°C)",
    fichero: "temperatura.py",
    nombre: "Temperatura"
};
scripts_index.push(temperatura_index);
var humedad_index = {
    titulo: "Humedad",
    ejey: "% Humedad",
    fichero: "humedad.py",
    nombre: "Humedad"
};
scripts_index.push(humedad_index);

function GetNumPendientes(){
    $.ajax({
		url: '/pendientes/count',
		type: 'GET',
		success: function (response) {
            $('#numpendientes').html(response.count);           
		}
	});
}
var dialog;
function GetAlertasGeneradas(){
    dialog = new BootstrapDialog({
        title: 'Alertas generadas las últimas 24 horas'
    });
    dialog.realize();    
}

function openDialogAlertas(){
    dialog.open();
}

function GetNodos(tipo, status) {
    $.ajax({
		url: '/nodos/',
		type: 'GET',
		success: function (response) {            
            if(status){
                GetStatusNodos(response.nodos);
            }else{
                GetDataNodos(response.nodos, tipo.fichero);
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
    GetNumPendientes();
    GetAlertasGeneradas();
	GetNodos(scripts_index[0], true);
    scripts_index.forEach(function(script, i){
        $('#chartbutton').append('<li><a href="#" onclick="CreateChar('+i+'); return false;">'+script.nombre+'</a></li>');
    });
    CreateChar(0);
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
                try{
                    response.datos.valores.forEach(function(data, i){
                        if(i <= 20){
                            datos.push(parseFloat(data.valor));
                        }                    
                    });
                    chart.addSeries({
                        name: nodo.nombre,
                        data: datos
                    });
                }catch(err){
                }
            }
        });
    });
}

function CreateChar(pos){
    chart = new Highcharts.Chart('container',{
        title: {
            text: scripts_index[pos].titulo,
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
                text: scripts_index[pos].ejey
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
    GetNodos(scripts_index[pos]);
}