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