$(document).ready(function () {
  const dict = {};
  $('ul li input').change(function () {
    const amenityId = $(this).data('id');
    const amenityName = $(this).data('name');
    if ($(this).is(':checked')) {
      dict[amenityId] = amenityName;
    } else {
      delete dict[amenityId];
    }

    const valuesArray = Object.values(dict);
    let valuesString = valuesArray.join(', ');

    if (valuesString.length >= 25) {
      valuesString = valuesString.slice(0, 25) + '...';
    }
    if (valuesArray.length === 0) {
      $('.amenities h4').html('&nbsp;');
    } else {
      $('.amenities h4').text(valuesString);
    }
  });

  $.get('http://127.0.0.1:5001/api/v1/status/', function (data) {
    if (data.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });
});
