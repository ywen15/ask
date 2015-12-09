// 7->begin, 6->top10, 5->5, 4->4, 3->3, 2->2, 1->1
var state = 7;
var Q = null;
var Q_under10 = [];
var Q_top10 = null;
var Q_top5 = null;
var winner = null;

var audio_overall = new Audio();
var audio_top = new Audio();

function getOverall() {
  var def = new $.Deferred();
  $.ajax({
    url: '/api/getOverall'
  }).done(function(data) {
    Q = data;
    def.resolve();
  });
  return def.promise();
}

function appendOverall() {
  var def = new $.Deferred();
  var page = [];
  var HTMLs = '';

  for(var i=0; i<Math.ceil(Q.length / 10); ++i) {
    $('#rows').append('<div class="page page' + i + '">');
  }

  $.each(Q, function(index, value) {
    var displayIndex = index + 1;
    var html = '';
    var div = null;

    page.push(value.userid);
    div = Q_under10.length;

    $('.page' + div).loadTemplate('/templates/_overall.html', {
      'row': value.userid,
      'place': index + 1,
      'name': value.name,
      'span-type': '(' + value.type + ')',
      'time': value.corrects,
      'span-avg': (value.points / value.corrects).toFixed(2)
    }, {
      append: true,
      async: false,
      complete: function() {
        if(page.length == 10 || Q.length == displayIndex) {
          Q_under10.push(page.reverse());
          page = [];
        }
        if(index == Q.length - 1) def.resolve();
      }
    });
  });
  return def.promise();
}

function ready() {
  hideLoader();
  //console.log(Q_under10)
}

function showUnder10() {
  $('#titleOverall').css('display', 'block');
  var intObj = setInterval(show, OVERALL_INTERVAL);

  function show() {
    if(Q.length <= 10) {
      clearInterval(intObj);
      return;
    }
    var row = Q.pop();
    //
  }
}

function showTop10() {
  //
}

function showTop5() {
  //
}

function showWinner() {
  //
}

$(document).ready(function() {
  $.when(getOverall()).then(appendOverall).then(ready);
  audio_overall.src = '/sounds/overall.mp3';
  audio_top.src = '/sounds/top.mp3';

  $(window).keypress(function(e) {
    if(e.which == 13) {
      if(state == 7) {
        --state;
        showUnder10();
      }
      else if(state == 6) {
        --state;
        showTop10();
      }
      else if(state > 1) {
        --state;
        showTop5();
      }
      else if(state == 1) {
        showWinner();
      }
    }
  });
});