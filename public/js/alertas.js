function GestionAlertas() {
  $.ajax({
    url: '/alerts/',
    type: 'GET',
    success: function (response) {
      $('#page-wrapper').hide();
      $('#page-wrapper').html(response);
      $('#page-wrapper').show();
    }
  });
  return false;
}

$(document).on('change', '#select_script', function () {
	var id = $('#select_script').val();
	if (id == 0) {
		$('#cuerpo_script').html("");
	} else {
		$.ajax({
			url: '/script/' + id,
			type: 'GET',
			success: function (response) {
				$('#cuerpo_script').html(response);
				return false;
			}
		});
	}
	return false;
});

$(document).on('change', '#alerta_tipo_condicion', function () {
	var id = $('#alerta_tipo_condicion').val();
	if (id == 0) {
		$('#div_condicion').html("");
		$('#div_condicion_valor').html("");
	} else if(id == 1){
		var str = "<label for=\"sel_sensor\">Condición</label>" +
"                    <select id=\"alerta_condicion\" class=\"form-control\" id=\"sel_sensor\" name=\"tipo_condicion\">" +
"                        <option value=\"<\"><</option>" +
"                        <option value=\"<=\"><=</option>" +
"                        <option value=\">\">></option>" +
"                        <option value=\">=\">>=</option>" +
"                        <option value=\"=\">=</option>" +
"                    </select>";
		var str1 = "<label for=\"sel_sensor\">Valor</label>" +
"            <input id=\"alerta_valor\" type=\"number\" class=\"form-control\" name=\"valor\" placeholder=\"Valor con el que se comparará\">";
var str2 = "<div class=\"form-group\">" +
"                    <label for=\"sel_frecuencia\">Frecuencia</label>" +
"                    <input id=\"alerta_frecuencia\" type=\"number\" class=\"form-control\" name=\"valor\" placeholder=\"Tiempo que debe pasar para que se vuelva a enviar una alerta\">" +
"                </div>";
		$('#div_condicion').html(str);
		$('#div_condicion_valor').html(str1);
		$('#div_condicion_frecuencia').html(str2);
	}else{
		$('#div_condicion').html("");
		$('#div_condicion_valor').html("");
		$('#div_condicion_frecuencia').html("");
	}
	return false;
});

function DeleteAlerta(i, id) {
	$.ajax({
		url: '/alerta/'+id+'/remove',
		type: 'POST',
		success: function (response) {
			if(response.ok == 'true'){
				$('#alerta_' + i).remove();
			}			
			return false;
		},
		error: function (response, err) {
			return false;
		}
	});
	return false;
}

function AddNewAlert() {
  $.ajax({
    url: '/alerta/add',
    type: 'GET',
    success: function (response) {
      $('#page-wrapper').html(response);
    }
  });
  return false;
}

var usuarios = 0;
function AddUserToList() {
	var nombre = $('#user_input').val();
	$('#user_input').val("");
	if (nombre.charAt(0) != '@') {
		nombre = '@' + nombre;
	}
	usuarios++;
	$('#userlist').append('<li id="user_list_' + usuarios + '" class="list-group-item">' + nombre + '<span class="pull-right"><button onclick="DeleteFromList(' + usuarios + ')" class="btn btn-danger btn-xs"><span class="glyphicon glyphicon-minus"></span></button></span></li>');
}

function DeleteFromList(i) {
	usuarios--;
	$('#user_list_' + i).remove();
}

$(document).on('click', '.delblanc', function (event) {
	$(this).parents(".usuario:first").remove();
	return false;
});

$(document).on('click', '.addblanc', function (event) {
	var alertacont = $(this).parents("#contenedor_alerta:first")[0];
	var str = "<div class=\"col-md-2 vcenter usuario\">" +
"                                <div class=\"input-group maxsize\">" +
"                                    <input id='al_usuario' type=\"text\" class='form-control usuarioval' value=\""+$(alertacont).find('#adduser').val()+"\">" +
"                                    <span class=\"input-group-addon btn btn btn-danger delblanc\"><span class=\"glyphicon glyphicon-trash\"></span></span>" +
"                                </div>" +
"                            </div>";
	$(alertacont).find("#usuer_list").append(str);
	$(alertacont).find('#adduser').val("")
	return false;
});

$(document).on('click', '.actualizaralerta', function (event) {
	var alertacont = $(this).parents("#contenedor_alerta:first")[0];
	var alerta = {
		mensaje: $(alertacont).find('#alerta_mensaje').val(),
		usuarios: []
	};
	if($(alertacont).find('#alerta_tipo').val() == "1"){
		alerta.frecuencia = $(alertacont).find('#alerta_frecuencia').val();
		alerta.condicion = $(alertacont).find('#alerta_condicion').val();
		alerta.valor = $(alertacont).find('#alerta_valor').val();
	}
	$(alertacont).find('.usuarioval').each(function(i, usr){
		alerta.usuarios.push($(usr).val());
	});
	$.ajax({
    url: '/alerta/'+$(alertacont).find('#alerta_id').val()+'/update',
    type: 'POST',
		data: alerta,
    success: function (response) {
		if(response.ok == "true"){
			var str = "<div class=\"alert alert-success\">" +
"  <strong>Actualizado correctamente!</strong>" +
"</div>";
			$(alertacont).find('#response').html(str);
			setTimeout(function() {
				$(alertacont).find('#response').fadeOut(300, function(){ $(this).html("");});
				$(alertacont).find('#response').fadeIn(0);
			}, 2000);
		}else{
			var str = "<div class=\"alert alert-danger\">" +
"  <strong>Se ha producido un error!</strong>"+
"</div>";
			$(alertacont).find('#response').html(str);
			setTimeout(function() {
				$(alertacont).find('#response').fadeOut(300, function(){ $(this).html("");});
				$(alertacont).find('#response').fadeIn(0);
			}, 2000);
		}
    }
  });
	return false;
});

$(document).on('click', '.eliminaralerta', function (event) {
	var alertacont = $(this).parents("#contenedor_alerta:first")[0];
	var id = $(alertacont).find('#alerta_id').val();
	$.ajax({
		url: '/alerta/'+id+'/remove',
		type: 'POST',
		success: function (response) {
			if(response.ok == 'true'){
				$(alertacont).parents('#alertaraiz').remove();
			}			
			return false;
		},
		error: function (response, err) {
			return false;
		}
	});
	return false;
});