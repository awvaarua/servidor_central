function AddNewScript() {
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

function GestionScripts() {
    $.ajax({
        url: '/scripts/',
        type: 'GET',
        success: function (response) {
            $('#page-wrapper').html(response);
            return false;
        }
    });
    return false;
}

function AddArgument() {
    var arg = "<div class=\"argumento input-group\">" +
        "                                <div class=\"col-xs-6 col-md-6 col-lg-6\">" +
        "                                    <input id=\"nombre_arg\" class=\"form-control\" name=\"fields\" type=\"text\" placeholder=\"Nombre que se mostrará\" />" +
        "                                </div>" +
        "                                <div class=\"col-xs-6 col-md-6 col-lg-6\">" +
        "                                    <select id=\"tipo_arg\" class=\"form-control\" id=\"sel_sensor\" name=\"tipo_condicion\">" +
        "                                        <option value=\"text\">Tipo</option>" +
        "                                        <option value=\"number\">Numérico</option>" +
        "                                        <option value=\"text\">Texto</option>" +
        "                                    </select>" +
        "                                </div>" +
        "                            </div>";
    $('.argumentos_add').append(arg);

}


function GuardarDatosScript(filename) {
    var script = {};
    script.fichero = filename;
    script.nombre = $('#script_nombre').val();
    script.argumentos = [];
    $('.argumentos_add').find('.argumento').each(function (i, arg) {
        var argumento = {};
        argumento.orden = i;
        argumento.nombre = $(arg).find('#nombre_arg').val();
        argumento.tipo = $(arg).find('#tipo_arg').val();
        script.argumentos.push(argumento);
    });
    $.ajax({
        url: '/script/add',
        type: 'POST',
        data: script,
        success: function (response) {
            var str = "";
            if (response.ok == "false") {
                str = "<div class=\"col-sm-6 col-sm-offset-3\">" +
                    "            <div class=\"alert alert-success\">" +
                    "              Usuario registrado correctamente" +
                    "            </div>" +
                    "        </div>";
            } else {
                var str = "<div class=\"col-sm-6 col-sm-offset-3\">" +
                    "            <div class=\"alert alert-success\">" +
                    "              Script añadido correctament" +
                    "            </div>" +
                    "        </div>";
            }
            $('#page-wrapper').html(str);
            return false;
        }
    });
    console.log(script);
}