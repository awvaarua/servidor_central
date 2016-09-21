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
                                '<option>Temperatura</option>'+
                                '<option>Humedad</option>'+
                                '<option>Luminosidad</option>'+
                              '</select>'+
                            '</td>'+
                            '<td><input type="text" id="email" class="form-control" /></td>'+
                            '<td><input type="text" id="password" class="form-control" /></td>'+
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