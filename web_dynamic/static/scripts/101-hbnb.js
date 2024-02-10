$(document).ready(function () {
  const amenityDict = {};
  const stateDict = {};
  const cityDict = {};

  function handleCheckboxChange(checkboxClass, dataDict, updateSelector) {
    $(checkboxClass).change(function () {
      const itemId = $(this).data('id');
      const itemName = $(this).data('name');
      if ($(this).is(':checked')) {
        dataDict[itemId] = itemName;
      } else {
        delete dataDict[itemId];
      }

      const valuesArray = Object.values(dataDict);
      let valuesString = valuesArray.join(', ');

      if (valuesString.length >= 25) {
        valuesString = valuesString.slice(0, 25) + '...';
      }
      if (valuesArray.length === 0) {
        $(updateSelector).html('&nbsp;');
      } else {
        $(updateSelector).text(valuesString);
      }
    });
  }

  handleCheckboxChange('.amenity_checkbox', amenityDict, '.amenities h4');
  handleCheckboxChange('.state_checkbox', stateDict, '.locations h4');
  handleCheckboxChange('.city_checkbox', cityDict, '.locations h4');

  $.get('http://127.0.0.1:5001/api/v1/status/', function (data) {
    if (data.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });

  function fetchPlaces(dict_data) {
    $.ajax({
      url: 'http://127.0.0.1:5001/api/v1/places_search/',
      method: 'POST',
      dataType: 'json',
      contentType: 'application/JSON',
      data: JSON.stringify(dict_data),
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

            <div class="description">
                ${place.description}
            </div>

            <div class="reviews">
                <h2>Reviews</h2><span data-id="${place.id}">show</span>
                <ul id="${place.id}"></ul>
            </div>
        </article>`).appendTo('.places');
        });
        $(".reviews span").click(function() {
            const place_id = this.dataset.id;
            const url = 'http://127.0.0.1:5001/api/v1/places/' + place_id + '/reviews'
            if ($(this).text() === "show") {
                $(this).text("hide");
                $.get(url, function(data) {
                    data.forEach(review => {
                        const user_id = review.user_id;
                        const url = 'http://127.0.0.1:5001/api/v1/users/'+ user_id;
                        $.get(url, function(user) {
                            $(`#${place_id}`).append(`
                            <li>
                                <h3>${user.first_name} ${user.last_name}</h3>
                                <p>${review.text}</p>
                            </li>
                            `)
                        })
                    });
                })
            } else {
                $(this).text("show");
                $(`#${place_id}`).empty()
            }
        })
      }
    });
  }

  fetchPlaces({});

  $('button').click(function() {
    let amenity_list = [];
    let state_list = [];
    let city_list = [];
    $('.amenity_checkbox').each((idx, elem) => {
      if (elem.checked) {
        amenity_list.push(elem.dataset.id);
      }
    });
    $('.state_checkbox').each((idx, elem) => {
      if (elem.checked) {
        state_list.push(elem.dataset.id);
      }
    });
    $('.city_checkbox').each((idx, elem) => {
      if (elem.checked) {
        city_list.push(elem.dataset.id);
      }
    });
    if (amenity_list.length || state_list.length || city_list.length) {
      fetchPlaces({
        amenities: amenity_list,
        states: state_list,
        cities: city_list
      });
    }
  });

});