function AddNewScript(){
    $.ajax({
		url: '/script/add',
		type: 'GET',
		success: function (response) {
			$('#page-wrapper').html(response);
			return false;
		}
	});
	return false;
}

function AddArgument(){
    var arg = "<div class=\"argument input-group\">" +
    "                                <div class=\"col-xs-6 col-md-6 col-lg-6\">" +
    "                                    <input id=\"user_input\" class=\"form-control\" name=\"fields\" type=\"text\" placeholder=\"Nombre que se mostrará\" />" +
    "                                </div>" +
    "                                <div class=\"col-xs-6 col-md-6 col-lg-6\">" +
    "                                    <select id=\"alerta_condicion\" class=\"form-control\" id=\"sel_sensor\" name=\"tipo_condicion\">" +
    "                                        <option value=\"numeric\">Tipo</option>" +
    "                                        <option value=\"numeric\">Numérico</option>" +
    "                                        <option value=\"text\">Texto</option>" +
    "                                    </select>" +
    "                                </div>" +
    "                            </div>";
    $('.argumentos_add').append(arg);

}