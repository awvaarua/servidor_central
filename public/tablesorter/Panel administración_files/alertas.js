function GestionAlertas() {
  $.ajax({
    url: '/alerts/',
    type: 'GET',
    success: function(response) {
   	  Init();
      $('#page-wrapper').hide();
      $('#page-wrapper').html(response);
      $('#page-wrapper').show();
    }
  });
  return false;
}

function AddNewAlert() {
  $.ajax({
    url: '/alerta/add',
    type: 'GET',
    success: function(response) {
      $('#page-wrapper').html(response);
    }
  });
  return false;
}

var usuarios = 0;
function AddUserToList(){
	var nombre = $('#user_input').val();
	if(nombre.charAt(0) != '@'){
		nombre = '@'+nombre;
	}
	usuarios++;
	$('#userlist').append('<li id="user_list_'+usuarios+'" class="list-group-item">'+nombre+'<span class="pull-right"><button onclick="DeleteFromList('+usuarios+')" class="btn btn-danger btn-xs"><span class="glyphicon glyphicon-minus"></span></button></span></li>');
}

function DeleteFromList(i){
	usuarios--;
	$('#user_list_'+i).remove();
}

function Init(){
	$(function() {

	  $.tablesorter.themes.bootstrap = {
	    // these classes are added to the table. To see other table classes available,
	    // look here: http://getbootstrap.com/css/#tables
	    table        : 'table table-bordered table-striped',
	    caption      : 'caption',
	    // header class names
	    header       : 'bootstrap-header', // give the header a gradient background (theme.bootstrap_2.css)
	    sortNone     : '',
	    sortAsc      : '',
	    sortDesc     : '',
	    active       : '', // applied when column is sorted
	    hover        : '', // custom css required - a defined bootstrap style may not override other classes
	    // icon class names
	    icons        : '', // add "icon-white" to make them white; this icon class is added to the <i> in the header
	    iconSortNone : 'bootstrap-icon-unsorted', // class name added to icon when column is not sorted
	    iconSortAsc  : 'glyphicon glyphicon-chevron-up', // class name added to icon when column has ascending sort
	    iconSortDesc : 'glyphicon glyphicon-chevron-down', // class name added to icon when column has descending sort
	    filterRow    : '', // filter row class; use widgetOptions.filter_cssFilter for the input/select element
	    footerRow    : '',
	    footerCells  : '',
	    even         : '', // even row zebra striping
	    odd          : ''  // odd row zebra striping
	  };

	  // call the tablesorter plugin and apply the uitheme widget
	  $("table").tablesorter({
	    // this will apply the bootstrap theme if "uitheme" widget is included
	    // the widgetOptions.uitheme is no longer required to be set
	    theme : "bootstrap",

	    widthFixed: true,

	    headerTemplate : '{content} {icon}', // new in v2.7. Needed to add the bootstrap icon!

	    // widget code contained in the jquery.tablesorter.widgets.js file
	    // use the zebra stripe widget if you plan on hiding any rows (filter widget)
	    widgets : [ "uitheme", "filter", "zebra" ],

	    widgetOptions : {
	      // using the default zebra striping class name, so it actually isn't included in the theme variable above
	      // this is ONLY needed for bootstrap theming if you are using the filter widget, because rows are hidden
	      zebra : ["even", "odd"],

	      // reset filters button
	      filter_reset : ".reset",

	      // extra css class name (string or array) added to the filter element (input or select)
	      filter_cssFilter: "form-control",

	      // set the uitheme widget to use the bootstrap theme class names
	      // this is no longer required, if theme is set
	      // ,uitheme : "bootstrap"

	    }
	  })
	});
}