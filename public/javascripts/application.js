(function() {
  var Filter, Map,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.onload = function() {
    return new Filter;
  };

  Filter = (function() {
    function Filter() {
      this.map = new Map;
      this.getData();
    }

    Filter.prototype.getData = function() {
      var self;
      self = this;
      return $.getJSON('public/json/data.json', function(response) {
        self.data = response;
        self.getStates();
        self.map.setMarkers(response.shoppings);
        return self.populate({
          loop: response.shoppings,
          target: "#shoppings"
        });
      });
    };

    Filter.prototype.getStates = function() {
      var self;
      self = this;
      return this.populate({
        loop: self.data.states,
        target: "#states"
      });
    };

    Filter.prototype.getCities = function(state) {
      var cities, self, shoppings;
      self = this;
      cities = _.where(self.data.cities, {
        "state": state
      });
      shoppings = _.where(self.data.shoppings, {
        "state": state
      });
      self.map.setMarkers(shoppings);
      this.populate({
        loop: cities,
        target: "#cities"
      });
      return this.populate({
        loop: shoppings,
        target: "#shoppings"
      });
    };

    Filter.prototype.getShoppings = function(city) {
      var self, shoppings;
      self = this;
      shoppings = _.where(self.data.shoppings, {
        "city": city
      });
      self.map.setMarkers(shoppings);
      return this.populate({
        loop: shoppings,
        target: "#shoppings"
      });
    };

    Filter.prototype.getShopping = function(name) {
      var self, shopping;
      self = this;
      shopping = _.where(self.data.shoppings, {
        "name": name
      });
      return self.map.setMarkers(shopping);
    };

    Filter.prototype.populate = function(data) {
      var html, item, _i, _len, _ref;
      html = " <option value=\"\">Select</option> ";
      _ref = data.loop;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        html += " <option value=\"" + item.name + "\">" + item.name + "</option> ";
      }
      $(data.target).html(html);
      return this.find();
    };

    Filter.prototype.find = function() {
      var self;
      self = this;
      $('select').off('change');
      return $('select').on('change', function() {
        var $element, filter, type;
        $element = $(this);
        filter = $element.val();
        type = $element.data('type');
        switch (type) {
          case 'state':
            return self.getCities(filter);
          case 'city':
            return self.getShoppings(filter);
          case 'shopping':
            return self.getShopping(filter);
        }
      });
    };

    return Filter;

  })();

  Map = (function() {
    function Map() {
      this.clearMarkers = __bind(this.clearMarkers, this);
      this.setMarkers = __bind(this.setMarkers, this);
      this.arrMarkers = [];
      this.mount();
    }

    Map.prototype.mount = function() {
      var mapOptions;
      mapOptions = {
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      return this.map = new google.maps.Map(document.getElementById("map"), mapOptions);
    };

    Map.prototype.setMarkers = function(markers) {
      var bounds, i, marker, _i, _ref;
      bounds = new google.maps.LatLngBounds();
      this.clearMarkers();
      for (i = _i = 0, _ref = markers.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        marker = new google.maps.Marker({
          position: new google.maps.LatLng(markers[i].lat, markers[i].lng),
          map: this.map
        });
        this.arrMarkers.push(marker);
        bounds.extend(marker.position);
      }
      return this.map.fitBounds(bounds);
    };

    Map.prototype.clearMarkers = function() {
      var i, _i, _ref, _results;
      if (this.arrMarkers.length > 0) {
        _results = [];
        for (i = _i = 0, _ref = this.arrMarkers.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          _results.push(this.arrMarkers[i].setMap(null));
        }
        return _results;
      }
    };

    return Map;

  })();

}).call(this);

/*
//@ sourceMappingURL=application.js.map
*/