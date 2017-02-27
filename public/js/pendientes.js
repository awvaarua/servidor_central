function NodosPendientes() {
	$.ajax({
		url: '/pendientes/render',
		type: 'GET',
		success: function (response) {
			$('#page-wrapper').html(response);
		}
	});
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