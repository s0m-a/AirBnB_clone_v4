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

  function fetchPlaces(am_data) {
    $.ajax({
      url: 'http://127.0.0.1:5001/api/v1/places_search/',
      method: 'POST',
      dataType: 'json',
      contentType: 'application/JSON',
      data: JSON.stringify(am_data),
      success: function (data) {
        $('.places').empty();
        $.each(data, function (k, place) {
          $(`
        <article>
          <div class="title_box">
            <h2>${place.name}</h2>
            <div class="price_by_night">${place.price_by_night}</div>
          </div>
          <div class="information">
            <div class="max_guest">${place.max_guest} Guests</div>
                <div class="number_rooms">${place.number_rooms} Bedrooms</div>
                <div class="number_bathrooms">${place.number_bathrooms} Bathrooms</div>
          </div>
          <div class="user">
              </div>
              <div class="description">
            ${place.description}
              </div>
        </article>`).appendTo('.places');
        });
      }
    });
  }

  fetchPlaces({});

  $('button').click(function() {
    console.log("clicked");
    let res = [];
    $('.amenities li input').each((idx, elem) => {
      if (elem.checked) {
        res.push(elem.dataset.id);
      }
    });
    if (res.length) {
      fetchPlaces({amenities: res});
    }
  });

});