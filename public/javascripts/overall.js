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
  Q_under10.reverse();
  if(Q_under10.length >= 2) {
    Q_top10 = Q_under10.splice(-1, 1)[0];
    Q_top5 = Q_top10.splice(5, 5);
    winner = Q_top5.splice(-1, 1);
  }
  return def.promise();
}

function ready() {
  $('.row').height($(window).height() / RESULT_PER_PAGE - 10);
  hideLoader();
  //console.log(Q_under10)
}

function showPage(pageIndex, pageArray) {
  $('.page' + pageIndex).css('display', 'block');

  $.each(pageArray, function(index, value) {
    setTimeout(function() {
      $('#' + value).css('visibility', 'visible');
    }, index * OVERALL_INTERVAL);
  });

  if(pageIndex > 1) {
    setTimeout(function() {
      $('.page' + pageIndex).css('display', 'none');
    }, OVERALL_PAGE_TRANS + pageArray.length * OVERALL_INTERVAL);
  }
  else {
    setTimeout(function() {
      audio_overall.pause();
    }, (pageArray.length + 1) * OVERALL_INTERVAL);
  }
}

function showUnder10() {
  $('#titleOverall').css('display', 'block');
  audio_overall.play();
  var rows = Q_under10[0].length;

  $.each(Q_under10, function(index, value) {
    if(index > 0) rows = value.length;
    setTimeout(function() {
      showPage(Q_under10.length-index, value);
    }, index * OVERALL_INTERVAL * rows);
  });
}

function showTop10() {
  $('.page1').css('display', 'none');
  $('.page0').css('display', 'block');

  audio_top.play();
  audio_top.currentTime = 4.5;
  $.each(Q_top10, function(index, value) {
    setTimeout(function() {
      $('#' + value).css('visibility', 'visible');
    }, OVERALL_INTERVAL * index);
  });
  setTimeout(function() {
    audio_top.pause();
  }, OVERALL_INTERVAL * (Q_top10.length + 1));
}

function showTop5() {
  audio_top.currentTime = 11;

  audio_top.play();
  $('#' + Q_top5[Q_top5.length - state]).css('visibility', 'visible');
  setTimeout(function() {
    audio_top.pause();
  }, TOP5_DURATION);
}

function showWinner() {
  var $winner = $('#' + winner[0]);

  audio_top.currentTime = 11;
  audio_top.play();

  $winner.children().css('background', '#D50F77');
  $winner.css('visibility', 'visible');
  $winner.effect('pulsate', { times: PULSATE_FREQ }, PULSATE_DURATION);
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