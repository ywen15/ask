//var host = location.origin.replace(/^http/, 'ws');
//var socket = host || io.connect('http://localhost:3000');
var socket = io();
const TRANS_EFFECT_TIME = 300;
const AJAX_TIMEOUT = 10000;
const NORMAL_ANSWER_TIME = 10000;
const ORDER_ANSWER_TIME = 15000;
const DIST_DISPLAY = 3000;
const WORST_INTERVAL = 580;
const TOP_INTERVAL = 750;
const OVERALL_INTERVAL = 700;
const PULSATE_FREQ = 10;
const PULSATE_DURATION = 1500;
const RESULT_PER_PAGE = 10;
const COLOR_PRIMARY = '#337ab7';
const COLOR_DANGER = '#d9534f';
const COLOR_SUCCESS = '#5cb85c';
const COLOR_WARNING = '#f0ad4e';

function hideLoader() {
  $('#loader').hide();
}

function showLoader() {
  $('#loader').show();
}

function pageTransition(page1, page2) {
  var def = new $.Deferred();
  $(page1).effect('drop', TRANS_EFFECT_TIME);
  setTimeout(function() {
    $(page2).effect('slide', { direction: 'right' }, TRANS_EFFECT_TIME);
    def.resolve();
  }, TRANS_EFFECT_TIME);
  return def.promise();
}