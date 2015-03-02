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
