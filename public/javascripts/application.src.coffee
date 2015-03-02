window.onload = ->
  new Filter

class Filter

  constructor: ->
    this.map = new Map
    this.getData()

  getData: ->
    self = this

    $.getJSON 'public/json/data.json', ( response )->
      self.data = response
      self.getStates()
      self.map.setMarkers( response.shoppings )
      self.populate
        loop: response.shoppings
        target: "#shoppings"

  getStates: ->
    self = this
    this.populate
      loop: self.data.states
      target: "#states"

  getCities: ( state )->
    self = this
    cities = _.where self.data.cities, { "state": state }
    shoppings = _.where self.data.shoppings, { "state": state }
    self.map.setMarkers( shoppings )

    this.populate
      loop: cities
      target: "#cities"

    this.populate
      loop: shoppings
      target: "#shoppings"

  getShoppings: ( city )->
    self = this
    shoppings = _.where self.data.shoppings, { "city": city }
    self.map.setMarkers( shoppings )

    this.populate
      loop: shoppings
      target: "#shoppings"

  getShopping: ( name )->
    self = this
    shopping = _.where self.data.shoppings, { "name": name }
    self.map.setMarkers( shopping )

  populate: ( data )->
    html = """ <option value="">Select</option> """

    for item in data.loop
      html += """ <option value="#{item.name}">#{item.name}</option> """

    $( data.target ).html html

    this.find()

  find: ->
    self = this

    $('select').off 'change'
    $('select').on 'change', ->
      $element = $(this)
      filter = $element.val()
      type = $element.data('type')

      switch type
        when 'state' then self.getCities( filter )
        when 'city' then self.getShoppings( filter )
        when 'shopping' then self.getShopping( filter )

class Map

  constructor: ->
    this.arrMarkers = []
    this.mount()

  mount: ->
    mapOptions =
      mapTypeId: google.maps.MapTypeId.ROADMAP

    this.map = new google.maps.Map(document.getElementById("map"), mapOptions)

  setMarkers: ( markers )=>
    bounds = new google.maps.LatLngBounds()

    this.clearMarkers()

    for i in [0...markers.length]

      marker = new google.maps.Marker
        position: new google.maps.LatLng( markers[i].lat, markers[i].lng )
        map: this.map

      this.arrMarkers.push( marker )

      bounds.extend( marker.position )

    this.map.fitBounds( bounds )

  clearMarkers: =>
    if this.arrMarkers.length > 0
      for i in [0...this.arrMarkers.length]
        this.arrMarkers[i].setMap( null )
