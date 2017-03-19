function SendConfirmation(ip, mac) {

	var confirmacion = {
		ip: ip,
		mac: mac,
		scripts: [],
		nombre: $('#pendiente_nombre').val(),
		usuario: $('#pendiente_usuario').val(),
		contrasenya: $('#pendiente_contrasenya').val()
	};

	var res = $('#pendiente_comun').html();
	var res1 = $('#pendiente_comun1').html();
	$('#pendiente_comun').html('<img class="loading" src="/public/img/load.gif"></img>');
	$('#pendiente_comun1').html("");

	$.ajax({
		url: '/nodo/add/',
		type: 'POST',
		dataType: 'json',
		data: {
			confirmacion: confirmacion
		},
		success: function (response) {
			if (response.ok == "true") {
				$('#pendiente_comun').html('<div class="alert alert-success"><h1>Nodo creado correctamente</h1></div>');
				$('#pendiente_comun1').remove();
				$('#botones').remove();
				ProcesarScripts(ip, mac);
			} else {
				$('#responsecontent').html('<div class="alert alert-danger"><h1>Se ha producido un error</h1><p>' + response.error + '</p></div>');
				$('#pendiente_comun').html(res);
				$('#pendiente_comun1').html(res1);
			}
		}
	});
}

function ProcesarScripts(ip, mac){

	$('.panelscripts').each(function (i, panel) {
		var script = {
			argumentos: [],
			script_id: $(panel).find('.script_id').attr('id'),
			fichero: $(panel).find('.script_fichero').attr('id'),
			nombre: $(panel).find('.script_nombre').attr('id')
		};
		try {
			$(panel).find('.argument').each(function (j, input) {
				script.argumentos.push({
					nombre: $(input).attr('name'),
					valor: $(input).val(),
					orden: $(input).attr('id')
				});
			});			
		} catch (error) {}
		$(panel).html('<img class="loading" src="/public/img/load.gif"></img>');

		$.ajax({
			url: '/nodo/'+mac+'/script/add',
			type: 'POST',
			dataType: 'json',
			data: {
				script: script
			},
			success: function (response) {
				if (response.ok == "true") {
					$(panel).html('<div class="alert alert-success"><h1>Script iniciado</h1></div>');
				} else {
					$(panel).html('<div class="alert alert-danger"><h1>Se ha producido un error</h1><p>' + response.message + '</p></div>');
				}
			}
		});
	});
}

function GestionNodos() {
	$.ajax({
		url: '/nodos/render',
		type: 'GET',
		success: function (response) {
			$('#page-wrapper').html(response);
		}
	});
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
							$('.bt' + script.pid).prop('disabled', false);
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
}

function DeleteScriptNodo(mac, pid) {
	$('div#' + pid).find('.panel-body').html('<img class="loading" src="/public/img/load.gif"></img>');
	$.ajax({
		url: '/nodo/' + mac + '/script/' + pid + '/delete',
		type: 'POST',
		success: function (response) {
			if (response.ok == "true") {
				$('div#' + pid).remove();
			} else {
				alert(response.message);
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
				$('#cuerpo_nodos').html('<div class="alert alert-success"><h1>Nodo eliminado correctamente</h1><h4>Scripts eliminados</h4><p></div>');
				$("#select_nodo option[value='" + ip + "']").remove();
			} else {
				$('#cuerpo_nodos').html('<div class="alert alert-danger"><h1>Se ha producido un error</h1><h4>Error</h4><h4>Scripts eliminados</h4><p>' + response.error + '</p></div>');
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
				$('#cuerpo_nodos').html('<div class="alert alert-success"><h1>El nodo se está reiniciando...</h1></div>');
			} else {
				$('#cuerpo_nodos').html('<div class="alert alert-danger"><h1>Imposible reiniciar</h1><p>' + response.error + '</p></div>');
			}
		}
	});
}

function PendienteNodo(mac) {
	$.ajax({
		url: '/nodo/' + mac + '/pendiente',
		type: 'POST',
		success: function (response) {
			if (response.ok == "true") {
				$('#cuerpo_nodos').html('<div class="alert alert-success"><h1>Cuando el nodo se reinicie estará en pendientes</h1></div>');
			} else {
				$('#cuerpo_nodos').html('<div class="alert alert-danger"><h1>Se ha producido un error</h1><p>' + response.error + '</p></div>');
			}
		}
	});
}

function Update(mac, pid, orden) {
	$('.bt' + pid).prop('disabled', true);
	var val = $('#' + pid + '_' + orden).val();
	$.ajax({
		url: '/nodo/' + mac + '/script/' + pid + '/update',
		data: {
			cambio: {
				tipo : "argumentos",
				orden: orden,
				valor: val
			}
		},
		type: 'POST',
		success: function (response) {
			if (response.ok == "true") {
				$('#pid_' + pid).html(response.data.pid);
				UpdatePidHTML(pid, response.data.pid, mac);
				$('.bt' + response.data.pid).prop('disabled', false);
			} else {
				$('.bt' + pid).prop('disabled', false);
				$('#cuerpo_nodos').html('<div class="alert alert-danger"><h1>Se ha producido un error</h1><p>' + response.message + '</p></div>');
			}
		}
	});
}

function UpdatePidHTML(old, newpid, mac) {
	$('#' + old).attr('id', newpid);
	$('#load_estado_' + old).attr('id', newpid);
	$('#pid_' + old).attr('id', 'pid_' + newpid);
	$('.bt' + old).removeClass('bt' + old).addClass('bt' + newpid);
	$('#delete_' + old).attr('onclick', 'DeleteScriptNodo("' + mac + '","' + newpid + '");');
	$('#delete_' + old).attr('id', 'delete_' + newpid);
	$('#'+newpid).find('.arg').each(function(i, arg){
		var orden = $(arg).attr('id').split('_')[1];
		 $(arg).attr('id', newpid+ '_' + orden);
	});
	$('#'+newpid).find('.argbt').each(function(i, arg){
		var orden = $(arg).attr('id');
		 $(arg).attr('onclick', 'Update("' + mac + '","' + newpid + '", "'+orden+'");');
	});
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

	$('#panel_cuerpo' + tabla).html('<img class="loading" src="/public/img/load.gif"></img>');

	$.ajax({
		url: '/nodo/' + ip + '/scripts/add/',
		type: 'POST',
		dataType: 'json',
		data: {
			scripts: scripts
		},
		success: function (response) {
			if (response.ok == "true") {
				$('#tabla0').html('<div id="alert0" class="alert alert-success"><h1>Scripts iniciados correctamente</h1><p>' + JSON.stringify(response.data) + '</p></div>');
			} else {
				$('#tabla0').html('<div id="alert0" class="alert alert-danger"><h1>Se ha producido un error</h1><p>' + response.message + '</p></div>');
			}
		}
	});
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
			url: '/pendiente/' + mac + '/render',
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