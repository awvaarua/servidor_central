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