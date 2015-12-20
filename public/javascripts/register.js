function viewForSearch() {
  $('#userid').attr('disabled', 'disabled');
  $('#searching').effect('fade', TRANS_EFFECT_TIME);
  $('#notFound, #duplicated, #forbidden').hide('slide', { direction: 'top' }, 'fast');
}

function popError(elementId) {
  $(elementId).effect('slide', { direction: 'down' }, TRANS_EFFECT_TIME);
  $('#userid').val('').removeAttr('disabled');
}

function findUser(userid) {
  $.ajax({
    url: '/api/findUser/' + userid
  }).done(function(data) {
    $('#searching').hide('fade', TRANS_EFFECT_TIME);

    if(!data) { popError('#notFound'); }
    else if(data.cookie) { popError('#duplicated'); }
    else { showUser(data); }
  });
}

function showUser(user) {
  $('#result-userid').text(user.userid);
  $('#result-name').text(user.name);
  $('#result-year').text(user.type);
  $('#result-competency').text(user.competency);
  $('#start').attr('href', '/api/register/' + user.userid);
  $('#result').delay(TRANS_EFFECT_TIME).effect('slide', { direction: 'down' }, TRANS_EFFECT_TIME);
}

$(document).ready(function() {
  $('#userid').keyup(function() {
    var userid = $(this).val();
    if(userid.length == 6) {
      viewForSearch();
      findUser(userid);
    }
  });
});