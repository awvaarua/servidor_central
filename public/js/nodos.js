function NodosPendientes() {
	$.ajax({
	    url : '/nodos/pendientes',
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

function DeleteNodoPendiente(ip){
	$.ajax({
	    url : '/nodo/remove',
	    type : 'POST',
	    data: {ip:ip},
	    success : function(response) {
	        $('#page-wrapper').html(response);
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

	$.ajax({
	    url : '/nodos/confirmacion/',
	    type : 'POST',
	    data: {confirmacion:confirmacion},
	    success : function(response) {
	        $('#page-wrapper').html(response);
	        return false;
	    }
	});
  	return false;
}