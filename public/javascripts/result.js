var current = null;
var dist = null;
var rank = null;
var orderAns = null;
var q = [];

var winner = null;
var worst = null;

var audio_result = new Audio();
var audio_worst = new Audio();
var audio_top = new Audio();

function waitForResult() {
  socket.on('result', function(data) {
    if(data.result == 'overall') location.href = '/overall';
    current = data;
    showLoader();
    (current.type == 'normal') ? processNormal() : processOrder();
  });
}

function getDist() {
  var def = new $.Deferred();
  $.ajax({
    url: '/api/getDist/' + current.question
  }).done(function(data) {
    dist = data;
    def.resolve();
  })
  return def.promise();
}

function getRank() {
  var def = new $.Deferred();
  $.ajax({
    url: '/api/getRank/' + current.question + '/' + current.answer + '/' + current.order
  }).done(function(data) {
    rank = data;
    def.resolve();
  })
  return def.promise();
}

function getAns() {
  var def = new $.Deferred();
  $.ajax({
    url: '/api/getAns/' + current.question + '/' + winner
  }).done(function(data) {
    orderAns = data;
    def.resolve();
  });
  return def.promise();
}

function clearView() {
  $('#dist, #rows').html('');
  $('#dist').css('display', 'block');
  $('#rank').css('display', 'none');
  $('#winner').css('display', 'none');
  if(current.order == 'worst') {
    $('#titleWorst').css('display', 'block');
    $('#titleTop').css('display', 'none');
  }
  else {
    $('#titleWorst').css('display', 'none');
    $('#titleTop').css('display', 'block');
  }
  if(worst) socket.emit('slowest', { slowest: worst });
  hideLoader();
}

function showDist() {
  audio_result.play();
  $('#dist').highcharts({
    chart: { type: 'column', height: $(window).height() - 20 },
    credits: { enabled: false },
    colors: [ COLOR_PRIMARY, COLOR_DANGER, COLOR_SUCCESS, COLOR_WARNING ],
    title: { text: '回答分布' },
    xAxis: { categories: [1, 2, 3, 4], labels: { style: { fontSize: '18pt' } } },
    yAxis: { title: { text: '回答者数(人)', style: { fontSize: '12pt' } }, labels: { style: { fontSize: '18pt' } } },
    legend: { enabled: false },
    plotOptions: { column: { minPointLength: 3 }, series: { dataLabels: { enabled: true, format: '{point.y}', style: { fontSize: '24pt' } } } },
    series: [{
      colorByPoint: true,
      data: dist
    }]
  });
}

function showAns() {
  audio_result.play();
  $('#dist').css('display', 'none');
  $('#winner').css('display', 'block');
  $('#winner span').text(orderAns._user.name);
  for(var i=0; i<4; ++i)
    $('#' + orderAns.answer.toString().charAt(i)).appendTo('#winner');
}

function appendRank() {
  var def = new $.Deferred();
  if(rank == null) def.resolve();
  var bg = '';
  $.each(rank, function(index, value) {
    q.push(value._user.userid);
    if(current.order == 'worst' && index == rank.length - 1) bg = 'bg-worst flash';
    else if(current.order == 'top' && index == 0) bg = 'bg-top flash';
    else bg = 'bg-primary';
    $('#rows').loadTemplate('/templates/_row.html', {
      'row': value._user.userid,
      'bg': bg,
      'place': index + 1,
      'name': value._user.name,
      'span': '(' + value._user.type + ')',
      'time': parseFloat(value.time).toFixed(2),
    }, {
      append: true,
      complete: function() {
        if(index == rank.length - 1) def.resolve();
      }
    });
  });
  return def.promise();
}

function showRank() {
  var interval;
  if(current.order == 'worst') {
    interval = WORST_INTERVAL;
    audio_worst.currentTime = (RESULT_PER_PAGE - rank.length) * interval / 1000;
    audio_worst.play();
    worst = q[q.length - 1];
    winner = null;
  }
  else {
    interval = TOP_INTERVAL;
    audio_top.currentTime = (RESULT_PER_PAGE - rank.length) * interval / 1000;
    audio_top.play();
    worst = null;
    if(q.length > 0) winner = q[0];
  }
  $('.row').height($(window).height() / RESULT_PER_PAGE - 10);
  $('#rank').css('display', 'block');

  var intObj = setInterval(show, interval);
  function show() {
    if(q.length == 0) {
      $('.flash').effect('pulsate', { times: PULSATE_FREQ }, PULSATE_DURATION);
      clearInterval(intObj);
      return;
    }
    var id = (current.order == 'worst') ? q.shift() : q.pop();
    $('#' + id).css('visibility', 'visible');
  }
}

function wait() {
  var def = new $.Deferred();
  setTimeout(function() {
    def.resolve();
  }, DIST_DISPLAY);
  return def.promise();
}

function processNormal() {
  $.when(getDist(), getRank())
  .then(clearView)
  .then(appendRank)
  .then(showDist)
  .then(wait)
  .then(function() {
    pageTransition('#dist', '#rank');
  })
  .then(showRank);
}

function processOrder() {
  $.when(getAns())
  .then(clearView)
  .then(showAns);
}

$(document).ready(function() {
  audio_result.src = '/sounds/dist.mp3';
  audio_worst.src = '/sounds/worst.mp3';
  audio_top.src = '/sounds/top.mp3';
  waitForResult();
});