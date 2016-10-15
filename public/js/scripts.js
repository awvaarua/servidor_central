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

function DeleteScript(id) {
    $.ajax({
        url: '/script/'+id+'/delete',
        type: 'POST',
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

var num_arguments_add = 0;
function AddArgument() {
    var arg = "<div id='argumentoadd_"+num_arguments_add+"' class=\"argumento input-group\">" +
"                            <div class=\"col-xs-5 col-sm-5 col-md-5\">" +
"                                <input id=\"nombre_arg\" class=\"form-control\" name=\"fields\" type=\"text\" placeholder=\"Nombre que se mostrará\" />" +
"                            </div>" +
"                            <div class=\"col-xs-5 col-sm-5 col-md-5\">" +
"                                <select id=\"tipo_arg\" class=\"form-control\" id=\"sel_sensor\" name=\"tipo_condicion\">" +
"                                    <option value=\"text\">Tipo</option>" +
"                                    <option value=\"number\">Numérico</option>" +
"                                    <option value=\"text\">Texto</option>" +
"                                </select>" +
"                            </div>" +
"                            <div class=\"col-xs-2 col-sm-2 col-md-2\">" +
"                                <button onclick='RemoveArgument("+num_arguments_add+")' class=\"btn btn-danger\" data-title=\"Delete\" data-toggle=\"modal\" data-target=\"#delete\"><span class=\"glyphicon glyphicon-trash\"></span></button>" +
"                            </div>" +
"                        </div>";
    num_arguments_add ++;
    $('.argumentos_add').append(arg);

}

var num_arguments_add = 0;
function RemoveArgument(i) {

    num_arguments_add --;
    $('#argumentoadd_'+i).remove();

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
}