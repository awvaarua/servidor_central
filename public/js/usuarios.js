function AddNewUser() {
  $.ajax({
    url: '/signup',
    type: 'GET',
    success: function(response) {
      $('#page-wrapper').html(response);
    }
  });
  return false;
}

function GestionUsuarios() {
  $.ajax({
    url: '/users',
    type: 'GET',
    success: function(response) {
      $('#page-wrapper').html(response);
    }
  });
  return false;
}

function Delete(email) {
  $.ajax({
    url: '/user/unlink',
    data: {
      email: email
    },
    type: 'POST',
    success: function(response) {
      $('#page-wrapper').html(response);
    }
  });
  return false;
}

function UpdateUser(email, pos) {
  var selected = $('select[id=sel_tipo' + pos + ']').val();
  $.ajax({
    url: '/user/update',
    data: {
      email: email,
      tipo: selected
    },
    type: 'POST',
    success: function(response) {
      $('#page-wrapper').html(response);
    }
  });
  return false;
}