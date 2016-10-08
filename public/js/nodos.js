function NodosPendientes() {
	$.ajax({
		url: '/pendientes/',
		type: 'GET',
		success: function (response) {
			$('#page-wrapper').html(response);
			return false;
		}
	});
	return false;
}

function DeleteNodoPendiente(mac) {
	$.ajax({
		url: '/pendiente/' + mac + '/remove',
		type: 'POST',
		success: function (response) {
			$('.panel-group').remove();
			$("#select_pendiente option[value='" + mac + "']").remove();
			return false;
		},
		error: function (response, err) {
			return false;
		}
	});
	return false;
}

function SendConfirmation(ip, mac) {

	var confirmacion = new Object();
	confirmacion.ip = ip;
	confirmacion.mac = mac;
	confirmacion.scripts = new Array(0);
	confirmacion.nombre = $('#pendiente_nombre').val();
	confirmacion.descripcion = $('#pendiente_descripcion').val();

	$('#pendiente_comun').html('<img class="loading" src="http://' + window.location.host + '/public/img/load.gif"></img>');
	$('#pendiente_comun1').remove();

	$.ajax({
		url: '/nodo/add/',
		type: 'POST',
		dataType: 'json',
		data: {
			confirmacion: confirmacion
		},
		success: function (response) {
			if (response.ok == "true") {
				$('#pendiente_comun').html('<div class="alert alert-success">' +
					'<h1>Nodo iniciado correctamente</h1>' +
					'</div>');
				ProcesarScripts(ip, mac);
			} else {
				$('#pendiente_comun').html('<div class="alert alert-danger">' +
					'<h1>Se ha producido un error</h1>' +
					'<p>' + response.error.message + '</p>' +
					'</div>');
			}
		}
	});
	return false;
}

function ProcesarScripts(ip, mac){

	$('.panelscripts').each(function (i, panel) {
		var script = new Object();
		script.argumentos = [];
		script.script_id = $(panel).find('.script_id').attr('id');
		script.fichero = $(panel).find('.script_fichero').attr('id');
		script.nombre = $(panel).find('.script_nombre').attr('id');

		$(panel).find('.argument').each(function (j, input) {
			script.argumentos.push({
				nombre: $(input).attr('name'),
				valor: $(input).val(),
				orden: $(input).attr('id')
			});
		});

		$(panel).html('<img class="loading" src="http://' + window.location.host + '/public/img/load.gif"></img>');

		$.ajax({
			url: '/nodo/'+mac+'/script/add',
			type: 'POST',
			dataType: 'json',
			data: {
				script: script
			},
			success: function (response) {
				if (response.ok == "true") {
					$(panel).html('<div class="alert alert-success">' +
						'<h1>Script iniciado</h1>' +
						'</div>');
				} else {
					$(panel).html('<div class="alert alert-danger">' +
						'<h1>Se ha producido un error</h1>' +
						'<p>' + response.message + '</p>' +
						'</div>');
				}
			}
		});
	});
}

function GestionNodos() {
	$.ajax({
		url: '/nodos/',
		type: 'GET',
		success: function (response) {
			$('#page-wrapper').html(response);
			return false;
		}
	});
	return false;
}

function CheckScriptsStatus(mac) {
	$.ajax({
		url: '/nodo/' + mac + '/scripts',
		type: 'GET',
		success: function (data) {
			data.data.scripts.forEach(function (script) {
				$.ajax({
					url: '/nodo/' + mac + '/script/' + script.pid + '/status',
					type: 'GET',
					success: function (data) {
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

function CheckStatus(mac) {
	$.ajax({
		url: '/nodo/' + mac + '/status',
		type: 'GET',
		success: function (response) {
			if (response.status == "online") {
				$('#load_estado').remove();
				$('#estado_nodo').append('<p><img src="/img/online.png"/> Online</p>');
				$('.buttonnode').prop('disabled', false);
				$('#countdown').removeClass('hide');
				CheckScriptsStatus(mac);
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
		success: function (response) {
			if (response.ok == "true") {
				$('div#' + pid).remove();
			} else {
				console.log(response.message);
			}
		}
	});
}

function DeleteNodo(mac) {
	$.ajax({
		url: '/nodo/' + mac + '/delete',
		type: 'POST',
		success: function (response) {
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

function ReiniciarNodo(mac) {
	$.ajax({
		url: '/nodo/' + mac + '/restart',
		type: 'POST',
		success: function (response) {
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
		success: function (response) {
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
		success: function (response) {
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
	$('#pins_' + old).attr('id', 'pins_' + newpid);
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
	$('#tabla' + tabla).find('tbody tr').each(function (tabla) {
		var script = new Object();
		script.tipo = $(this).find('td select').val();
		script.pin = $(this).find('td input#pins').val();
		script.frec = $(this).find('td input#frec').val();
		scripts.push(script);
	});

	$('#panel_cuerpo' + tabla).html('<img class="loading" src="http://' + window.location.host + '/public/img/load.gif"></img>');

	$.ajax({
		url: '/nodo/' + ip + '/scripts/add/',
		type: 'POST',
		dataType: 'json',
		data: {
			scripts: scripts
		},
		success: function (response) {
			if (response.ok == "true") {
				$('#tabla0').html('<div id="alert0" class="alert alert-success">' +
					'<h1>Scripts iniciados correctamente</h1>' +
					'<p>' + JSON.stringify(response.data) + '</p>' +
					'</div>');
			} else {
				$('#tabla0').html('<div id="alert0" class="alert alert-danger">' +
					'<h1>Se ha producido un error</h1>' +
					'<p>' + response.message + '</p>' +
					'</div>');
			}
		}
	});
	return false;
}

$(document).on('change', '#select_nodo', function () {
	var mac = $('#select_nodo').val();
	if (mac == 0) {
		$('#cuerpo_nodos').html("");
	} else {
		$.ajax({
			url: '/nodo/' + mac,
			type: 'GET',
			success: function (response) {
				$('#cuerpo_nodos').html(response);
				CheckStatus(mac);
				return false;
			}
		});
	}
	return false;
});

$(document).on('change', '#select_pendiente', function () {
	var mac = $('#select_pendiente').val();
	if (mac == 0) {
		$('#cuerpo_nodos').html("");
	} else {
		$.ajax({
			url: '/pendiente/' + mac,
			type: 'GET',
			success: function (response) {
				$('#cuerpo_nodos').html(response);
				return false;
			}
		});
	}
	return false;
});

function OpenClose(){
	$("#add_scripts_nodo").toggle();
}

function getTime(start) {
	var d = new Date(start);

	$('#countdown').countup({
		start: new Date(d)
	});
}

var num_scripts = 0;

function PaintScriptid() {
	$('.panelscripts').removeClass('in');
	var id = $('#select_scripts').val();
	if (id == 0) { return; }
	$.ajax({
		url: '/script/' + id + '/render/' + num_scripts,
		type: 'GET',
		success: function (response) {
			$('#lista_scripts').append(response);
			return false;
		}
	});
	num_scripts++;
}

function UnpaintScriptid(pos) {
	num_scripts--;
	$('#panel' + pos).remove();
}