function NodosPendientes() {
	$.ajax({
		url: '/pendientes/',
		type: 'GET',
		success: function(response) {
			$('#page-wrapper').html(response);
			return false;
		}
	});
	return false;
}

var filas_por_tabla = [];

function AddRow(tabla) {
	if (typeof filas_por_tabla[tabla] === 'undefined') {
		filas_por_tabla[tabla] = 1;
	} else {
		filas_por_tabla[tabla] = filas_por_tabla[tabla] + 1;
	}
	var fila = filas_por_tabla[tabla];
	$('#tabla' + tabla + ' tbody').append('<tr id="tb' + tabla + '_' + fila + '">' +
		'<td>' +
		'<select class="form-control">' +
		'<option value="0">Temperatura</option>' +
		'<option value="1">Humedad</option>' +
		'<option value="2">Luminosidad</option>' +
		'</select>' +
		'</td>' +
		'<td><input type="text" id="pins" class="form-control" /></td>' +
		'<td><input type="text" id="frec" class="form-control" /></td>' +
		'<td>' +
		'<button onclick="DeleteRow(' + tabla + ', ' + fila + ')" type="button" class="btn btn-danger glyphicon-minus ' +
		'addBtnRemove"></button></td></tr>');
}

function DeleteRow(tabla, fila) {
	$('#tb' + tabla + '_' + fila).remove();
}

function DeleteNodoPendiente(ip, i) {
	$.ajax({
		url: '/pendiente/remove',
		type: 'POST',
		data: {
			ip: ip
		},
		success: function(response) {
			$('#panel' + i).remove();
			return false;
		},
		error: function(response, err) {
			return false;
		}
	});
	return false;
}

function SendConfirmation(tabla, ip) {

	var confirmacion = new Object();
	confirmacion.ip = ip;
	confirmacion.scripts = [];
	$('#tabla' + tabla).find('tbody tr').each(function(tabla) {
		var script = new Object();
		script.tipo = $(this).find('td select').val();
		script.pin = $(this).find('td input#pins').val();
		script.frec = $(this).find('td input#frec').val();
		confirmacion.scripts.push(script);
	});

	$('#panel_cuerpo' + tabla).html('<img class="loading" src="http://' + window.location.host + '/public/img/load.gif"></img>');

	$.ajax({
		url: '/nodo/add/',
		type: 'POST',
		dataType: 'json',
		data: {
			confirmacion: confirmacion
		},
		success: function(response) {
			if (response.ok == "true") {
				$('#panel_cuerpo' + tabla).html('<div class="alert alert-success">' +
					'<h1>Nodo iniciado correctamente</h1>' +
					'<p>' + JSON.stringify(response.data) + '</p>' +
					'</div>');
			} else {
				$('#panel_cuerpo' + tabla).html('<div class="alert alert-danger">' +
					'<h1>Se ha producido un error</h1>' +
					'<p>' + response.message + '</p>' +
					'</div>');
			}
		}
	});
	return false;
}

function GestionNodos() {
	$.ajax({
		url: '/nodos/',
		type: 'GET',
		success: function(response) {
			$('#page-wrapper').html(response);
			return false;
		}
	});
	return false;
}

function CheckScriptsStatus(ip) {
	$.ajax({
		url: '/nodo/' + ip + '/scripts',
		type: 'GET',
		success: function(data) {
			data.data.scripts.forEach(function(script) {
				$.ajax({
					url: '/nodo/' + ip + '/script/' + script.pid + '/status',
					type: 'GET',
					success: function(data) {
						if (data.status == "online") {
							$('.bt' + script.pid).prop('disabled', false);
							$('#load_estado_' + script.pid).html('<p><img src="/img/online.png"/> Ejecutándose</p>');
						} else {
							$('#load_estado_' + script.pid).html('<p><img src="/img/offline.png"/> Parado</p>');
						}
					}
				});
			});
		}
	});
}

function CheckStatus(ip) {
	$.ajax({
		url: '/nodo/' + ip + '/status',
		type: 'GET',
		success: function(response) {
			if (response.status == "online") {
				$('#load_estado').remove();
				$('#estado_nodo').append('<p><img src="/img/online.png"/> Online</p>');
				$('.buttonnode').prop('disabled', false);
				$('#countdown').removeClass('hide');
				CheckScriptsStatus(ip);
			} else {
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

function DeleteScriptNodo(ip, pid) {
	$.ajax({
		url: '/nodo/' + ip + '/script/' + pid + '/delete',
		type: 'POST',
		success: function(response) {
			if (response.ok == "true") {
				$('div#' + pid).remove();
			} else {
				console.log(response.message);
			}
		}
	});
}

function DeleteNodo(ip) {
	$.ajax({
		url: '/nodo/' + ip + '/delete',
		type: 'POST',
		success: function(response) {
			if (response.ok == "true") {
				$('#cuerpo_nodos').html('<div class="alert alert-success">' +
					'<h1>Nodo eliminado correctamente</h1>' +
					'<h4>Scripts eliminados</h4>' +
					'<p>' + JSON.stringify(response.data) + '</p>' +
					'</div>');
				$("#select_nodo option[value='" + ip + "']").remove();
			} else {
				$('#cuerpo_nodos').html('<div class="alert alert-danger">' +
					'<h1>Se ha producido un error</h1>' +
					'<h4>Error</h4>' +
					'<h4>Scripts eliminados</h4>' +
					'<p>' + response.error + '</p>' +
					'</div>');
			}
		}
	});
}

function ReiniciarNodo(ip) {
	$.ajax({
		url: '/nodo/' + ip + '/restart',
		type: 'POST',
		success: function(response) {
			if (response.ok == "true") {
				$('#cuerpo_nodos').html('<div class="alert alert-success">' +
					'<h1>El nodo se está reiniciando...</h1>' +
					'</div>');
			} else {
				$('#cuerpo_nodos').html('<div class="alert alert-danger">' +
					'<h1>Imposible reiniciar</h1>' +
					'<p>' + response.error + '</p>' +
					'</div>');
			}
		}
	});
}

function UpdateFrec(ip, pid) {
	$('.bt' + pid).prop('disabled', true);
	var frec = $('#frec_' + pid).val();
	$.ajax({
		url: '/nodo/' + ip + '/script/' + pid + '/update',
		data: {
			cambio: {
				tipo: "frec",
				valor: frec
			}
		},
		type: 'POST',
		success: function(response) {
			if (response.ok == "true") {
				$('#frec_' + pid).val(frec);
				$('#pid_' + pid).html(response.data.pid);
				UpdatePidHTML(pid, response.data.pid, ip);
				$('.bt' + response.data.pid).prop('disabled', false);
			} else {
				$('.bt' + pid).prop('disabled', false);
				$('#cuerpo_nodos').html('<div class="alert alert-danger">' +
					'<h1>Se ha producido un error</h1>' +
					'<p>' + response.error + '</p>' +
					'</div>');
			}
		}
	});
}

function UpdatePin(ip, pid) {
	$('.bt' + pid).prop('disabled', true);
	var pin = $('#pins_' + pid).val();
	$.ajax({
		url: '/nodo/' + ip + '/script/' + pid + '/update',
		data: {
			cambio: {
				tipo: "pin",
				valor: pin
			}
		},
		type: 'POST',
		success: function(response) {
			console.log(response);
			if (response.ok == "true") {
				$('#pins_' + pid).val(pin);
				$('#pid_' + pid).html(response.data.pid);
				UpdatePidHTML(pid, response.data.pid, ip);
				$('.bt' + response.data.pid).prop('disabled', false);
			} else {
				$('.bt' + script.pid).prop('disabled', false);
				$('#cuerpo_nodos').html('<div class="alert alert-danger">' +
					'<h1>Se ha producido un error</h1>' +
					'<p>' + response.error + '</p>' +
					'</div>');
			}
		}
	});
}

function UpdatePidHTML(old, newpid, ip) {
	$('#' + old).attr('id', newpid);
	$('#pid_' + old).attr('id', 'pid_' + newpid);
	$('#frec_' + old).attr('id', 'frec_' + newpid);
	$('#pins_' + old).attr('id', 'frec_' + newpid);
	$('.bt' + old).removeClass('bt' + old).addClass('bt' + newpid);
	$('#act_frec_' + old).attr('onclick', 'UpdateFrec("' + ip + '","' + newpid + '");');
	$('#act_pins_' + old).attr('onclick', 'UpdatePin("' + ip + '","' + newpid + '");');
	$('#delete_' + old).attr('onclick', 'DeleteScriptNodo("' + ip + '","' + newpid + '");');
	$('#act_frec_' + old).attr('id', 'act_frec_' + newpid);
	$('#act_pins_' + old).attr('id', 'act_pins_' + newpid);
	$('#delete_' + old).attr('id', 'delete_' + newpid);
}

function AddScripts(tabla, ip) {
	scripts = [];
	$('#tabla' + tabla).find('tbody tr').each(function(tabla) {
		var script = new Object();
		script.tipo = $(this).find('td select').val();
		script.pin = $(this).find('td input#pins').val();
		script.frec = $(this).find('td input#frec').val();
		scripts.push(script);
	});

	$('#panel_cuerpo' + tabla).html('<img class="loading" src="http://' + window.location.host + '/public/img/load.gif"></img>');

	$.ajax({
		url: '/nodo/'+ip+'/scripts/add/',
		type: 'POST',
		dataType: 'json',
		data: {
			scripts: scripts
		},
		success: function(response) {
			if (response.ok == "true") {
				$('#panel_cuerpo' + tabla).html('<div class="alert alert-success">' +
					'<h1>Nodo iniciado correctamente</h1>' +
					'<p>' + JSON.stringify(response.data) + '</p>' +
					'</div>');
			} else {
				$('#panel_cuerpo' + tabla).html('<div class="alert alert-danger">' +
					'<h1>Se ha producido un error</h1>' +
					'<p>' + response.message + '</p>' +
					'</div>');
			}
		}
	});
	return false;
}

$(document).on('change', '#select_nodo', function() {
	var ip = $('#select_nodo').val();
	if (ip == 0) {
		$('#cuerpo_nodos').html("");
	} else {
		$.ajax({
			url: '/nodo/' + ip,
			type: 'GET',
			success: function(response) {
				$('#cuerpo_nodos').html(response);
				CheckStatus(ip);
				return false;
			}
		});
	}
	return false;
});


function getTime(start) {
	var d = new Date(start);

	$('#countdown').countup({
		start: new Date(d)
	});
}