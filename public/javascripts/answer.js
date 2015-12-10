var start = 0;
var end = 0;
var current = null;
var userid = null;
var answerable = true;
var to = null;

socket.on('start', function(data) {
  clearTimeout(to);
  current = data;
  if(current.enable == 'force' || current.type == 'order') answerable = true;
  else if(current.slowest == userid) answerable = false;
  start = +new Date();
  end = 0;
  if(!answerable) return;
  hideLoader();
  to = setTimeout(function() {
    showLoader();
    if(end == 0) answerable = false;
  }, (current.type == 'normal') ? NORMAL_ANSWER_TIME : ORDER_ANSWER_TIME);
});

function setupButtons() {
  var diameter = Math.min($(window).width(), $(window).height()) / 2;
  $('.button').css({
    'marginTop': $(window).height() / 4 - diameter / 2,
    'width': diameter,
    'height': diameter
  });
}

function enableButton() {
  $('.button').removeClass('disabled');
}

function disableButton(btn) {
  btn.addClass('disabled');
}

function submitAns(answer) {
  showLoader();
  enableButton();
  if(current.type == 'normal' && answer != current.answer) answerable = false;
console.log(answerable);
  $.ajax({
    url: '/api/submitAns/',
    type: 'POST',
    data: {
      userid: userid,
      period: current.period,
      question: current.question,
      answer: answer,
      time: (end-start) / 1000
    },
    timeout: AJAX_TIMEOUT
  });

  if(answer == current.answer) {
    $.ajax({
      url: '/api/updateStat/',
      type: 'POST',
      data: {
        userid: userid,
        time: (end-start) / 1000
      },
      timeout: AJAX_TIMEOUT
    });
  }
}

$(document).ready(function() {
  setupButtons();
  var $choice = $('#choice');
  userid = $('#userid').val();

  $('.button').click(function() {
    var $btn = $(this);
    disableButton($btn);

    if(current.type == 'normal') {
      end = +new Date();
      submitAns($btn.attr('id'));
    }
    else {
      $choice.val($choice.val() + $btn.attr('id'));
      if($choice.val().length == 4) submitAns($choice.val());
    }
  });
});