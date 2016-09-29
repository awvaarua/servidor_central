function NodosPendientes() {
	$.ajax({
	    url : '/pendientes/',
	    type : 'GET',
	    success : function(response) {
	        $('#page-wrapper').html(response);
	        return false;
	    }
	});
  	return false;
}

var filas_por_tabla = [];
function AddRow(tabla){
	if (typeof filas_por_tabla[tabla] === 'undefined') {
		filas_por_tabla[tabla] = 1;
	}else{
		filas_por_tabla[tabla] = filas_por_tabla[tabla] + 1;
	}
	var fila = filas_por_tabla[tabla];
	$('#tabla'+tabla+' tbody').append('<tr id="tb'+tabla+'_'+fila+'">'+
                        '<td>'+
                        '<select class="form-control">'+
	                    '<option value="0">Temperatura</option>'+
	                    '<option value="1">Humedad</option>'+
	                    '<option value="2">Luminosidad</option>'+
	                    '</select>'+
                        '</td>'+
                        '<td><input type="text" id="pins" class="form-control" /></td>'+
                        '<td><input type="text" id="frec" class="form-control" /></td>'+
                        '<td>'+
                        '<button onclick="DeleteRow('+tabla+', '+fila+')" type="button" class="btn btn-danger glyphicon-minus '+
                        'addBtnRemove"></button></td></tr>');
}

function DeleteRow(tabla, fila){
	$('#tb'+tabla+'_'+fila).remove();
}

function DeleteNodoPendiente(ip, i){
	$.ajax({
	    url : '/pendiente/remove',
	    type : 'POST',
	    data: {ip:ip},
	    success : function(response) {
	        $('#panel'+i).remove();
	        return false;
	    },
	    error : function(response, err){
	    	return false;
	    }
	});
  	return false;	
}

function SendConfirmation(tabla, ip){	

	var confirmacion =  new Object();
	confirmacion.ip = ip;
	confirmacion.scripts = [];
	$('#tabla'+tabla).find('tbody tr').each (function(tabla) {
		var script = new Object();
		script.tipo = $(this).find('td select').val();
		script.pins = $(this).find('td input#pins').val().split(',');
		script.pins = JSON.stringify(script.pins);
		script.frec = $(this).find('td input#frec').val();
		confirmacion.scripts.push(script);
	});

	$('#panel_cuerpo'+tabla).html('<img class="loading" src="http://'+window.location.host+'/public/img/load.gif"></img>');

	$.ajax({
	    url : '/pendiente/confirmacion/',
	    type : 'POST',
	    dataType: 'json',
	    data: {confirmacion:confirmacion},
	    success : function(response) {
	    	console.log(response);
	        if (response.ok == "true") {
	        	$('#panel_cuerpo'+tabla).html('<div class="alert alert-success">'+
	  					'<h1>Nodo iniciado correctamente</h1>'+
	  					'<p>'+JSON.stringify(response.data)+'</p>'+
						'</div>');
	        }else{
	        	$('#panel_cuerpo'+tabla).html('<div class="alert alert-danger">'+
	  					'<h1>Se ha producido un error</h1>'+
	  					'<p>'+response.message+'</p>'+
						'</div>');
	        }
	    }
	});
  	return false;
}

function GestionNodos() {
	$.ajax({
	    url : '/nodos/',
	    type : 'GET',
	    success : function(response) {
	        $('#page-wrapper').html(response);
	        return false;
	    }
	});
  return false;
}

function CheckScriptsStatus(ip){
	$.ajax({
        url : '/nodo/'+ip+'/scripts',
        type : 'GET',
        success : function(data) {
        	data.data.scripts.forEach(function(script){
        		$.ajax({
			        url : '/nodo/'+ip+'/script/'+script.pid+'/status',
			        type : 'GET',
			        success : function(data) {
		        		console.log(data.status);
		        		if (data.status == "online") {
		        			$('.bt'+script.pid).prop('disabled', false);
		        			$('#load_estado_'+script.pid).html('<p><img src="/img/online.png"/> Ejecutándose</p>');
		        		}else{
		        			$('#load_estado_'+script.pid).html('<p><img src="/img/offline.png"/> Parado</p>');
		        		}
			        }
			    });
        	});
        }
    });
}

function CheckStatus(ip) {
    $.ajax({
        url : '/nodo/'+ip+'/status',
        type : 'GET',
        success : function(response) {
            if (response.status == "online") {
            	$('#load_estado').remove();
            	$('#estado_nodo').append('<p><img src="/img/online.png"/> Online</p>');
            	$('.buttonnode').prop('disabled', false);
                $('#countdown').removeClass('hide');
                CheckScriptsStatus(ip);
            }else{
            	$('#load_estado').remove();
            	$('#estado_nodo').append('<p><img src="/img/offline.png"/> Offline</p>');
                $('#countdown').html('<p>-</p>');
                $('#countdown').removeClass('hide');
                $('.loadscript').html('<p>-</p>');
            }
        }
    });
    return false;
}

function DeleteScriptNodo(ip, pid){
	$.ajax({
        url : '/nodo/'+ip+'/script/'+pid+'/delete',
        type : 'POST',
        success : function(response) {
        	if (response.ok == "true") {
        		$('div#'+pid).remove();
        	}else{
        		console.log(response.message);
        	}
        }
    });
}

function DeleteNodo(ip){
	$.ajax({
        url : '/nodo/'+ip+'/delete',
        type : 'POST',
        success : function(response) {
        	if (response.ok == "true") {
        		$('div#'+pid).remove();
        	}else{
        		console.log(response.message);
        	}
        }
    });
}

$(document).on('change','#select_nodo',function(){
	var ip = $('#select_nodo').val();
	if (ip == 0) {
		$('#cuerpo_nodos').html("");
	}else{
		$.ajax({
		    url : '/nodo/'+ip,
		    type : 'GET',
		    success : function(response) {
		        $('#cuerpo_nodos').html(response);
		        CheckStatus(ip);
		        return false;
		    }
		});
	}
  	return false;
});


function getTime(start){
	var d = new Date(start);

	$('#countdown').countup({
	    start: new Date(d)
	});
}