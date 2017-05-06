
var Map = function(){
  this.locations = ko.observableArray([
    {Title: 'Angled Tower', position: {lat: 13.412805, lng: 103.866947}},
    {Title: 'Angkor Wat Panorama', position: {lat: 13.413805, lng: 103.865947}},
    {Title: 'Bayon Temple of Faces', position: {lat: 13.444195,lng: 103.859051}},
    {Title: 'Bayon Face', position: {lat:13.443692, lng:103.859707}},
    {Title: 'Devatas', position: {lat: 13.411805,lng:  103.867947}},
    {Title: 'Holy Monks', position: {lat: 13.412305,lng:  103.866947}},
    {Title: 'Devata', position: {lat: 13.411405,lng:  103.867447}},
    {Title: 'Meditation Place', position: {lat: 13.412305,lng:  103.866147}},
    {Title: 'Ta Prohm: Tomb Raider', position: {lat: 13.434251, lng:103.888145}},
    {Title: 'Preah Khan: Octopuss Temple', position: {lat:13.462949, lng:103.872680}},
    {Title: 'Neak Pean', position: {lat: 13.462223, lng: 103.896248}},
    {Title: 'East Barray', position: {lat:13.449814, lng: 103.922946}}]);
  this.locations().forEach(function(item){item.visibility = true;});
}

var ViewModel = function(){
  //var self = this;
  this.CurrentMap = ko.observable(new Map());
  //filter the items using the filter text
  this.Filter = ko.observable("");
  this.FilteredItems = ko.computed(function() {
    //var filter = this.filter().toLowerCase();
    if (!this.Filter()) {
        CurrentMap().locations().forEach(function(item){item.visibility = true;});
        return this.CurrentMap().locations();
    } else {
        return ko.utils.arrayFilter(this.CurrentMap().locations(), function(item) {
            if(item.Title.toLowerCase().match(this.Filter().toLowerCase())){
              item.visibility = true;
              return item.Title}
            item.visibility = false;
            //return item.Title.match(filter);
        }); 
    }
  }, this);
}

ko.applyBindings(ViewModel());

function initMap() {
  //constructor creates a new map - only  center and zoom are required.
  
  var styles =
    [{"featureType":"all","elementType":"all","stylers":[{"saturation":"2"},{"hue":"#ff0000"}]},{"featureType":"all","elementType":"labels.text.fill","stylers":[{"color":"#d8bf25"}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"color":"#ff0000"}]},{"featureType":"administrative","elementType":"all","stylers":[{"color":"#ffda00"},{"visibility":"on"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#ff0000"}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#d8bf25"}]},{"featureType":"administrative","elementType":"labels.text.stroke","stylers":[{"color":"#000000"}]},{"featureType":"administrative","elementType":"labels.icon","stylers":[{"color":"#d8bf25"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#003500"}]},{"featureType":"landscape.man_made","elementType":"all","stylers":[{"color":"#023208"}]},{"featureType":"landscape.natural","elementType":"all","stylers":[{"color":"#0b5300"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"},{"color":"#000000"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45},{"color":"#d8bf25"}]},{"featureType":"road","elementType":"geometry","stylers":[{"color":"#eceb91"}]},{"featureType":"road","elementType":"labels","stylers":[{"color":"#c6ca6e"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"},{"saturation":"79"},{"lightness":"-7"},{"gamma":"1.19"},{"weight":"1.00"},{"color":"#d8bf25"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#000025"},{"visibility":"on"}]}];

  map = new google.maps.Map(document.getElementById('map'),{
    center: {lat: 13.4325,lng:  103.9070},
    zoom: 13,
    styles: styles,
    mapTypeControl: false
  });

  markers = [];

  var largeInfoWindow = new google.maps.InfoWindow();

  var defaultIcon = makeMarkerIcon("0091ff");

  var highlightedIcon = makeMarkerIcon("FFFF24");

  CurrentMap().locations().forEach(function(location){
    var marker = new google.maps.Marker({
      position: location.position,
      title: location.Title,
      animation: google.maps.Animation.DROP,
      icon: 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png',
      color:'#ff0000',
      id:1
    });
    marker.addListener('click', function(){
      populateInfoWindow(this, largeInfoWindow);
    });

    console.log(location);
    markers.push(marker);
    //bounds.extend(marker.position);

    marker.addListener('click',function(){
      populateInfoWindow(this, largeInfoWindow);
    });

    marker.addListener('mouseover', function() {
      this.setIcon(highlightedIcon);
    });

    marker.addListener('mouseout', function() {
      this.setIcon('http://maps.google.com/mapfiles/ms/icons/orange-dot.png');
    });
    
  });
  showMarkers();
}

function populateInfoWindow(marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker != marker) {
    // Clear the infowindow content to give the streetview time to load.
    //var sag = 'http://maps.googleapis.com/maps/api/streetview?location=41.40404,2.17513&size=70x70&heading=220&fov=70&pitch=40';
    var sag = 'https://en.wikipedia.org/wiki/Angkor_Wat'
    //infowindow.setContent('<IMG BORDER="0" ALIGN="Left" SRC='+sag+'>');
    infowindow.setContent('<a href='+sag+' target="_blank">Angkor Wat</a>');
    infowindow.marker = marker;
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
    });
    var streetViewService = new google.maps.StreetViewService();
    var radius = 8000;
    // In case the status is OK, which means the pano was found, compute the
    // position of the streetview image, then calculate the heading, then get a
    // panorama from that and set the options
    function getStreetView(data, status) {
      if (status == google.maps.StreetViewStatus.OK) {
        var nearStreetViewLocation = data.location.latLng;
        var heading = google.maps.geometry.spherical.computeHeading(
          nearStreetViewLocation, marker.position);
          infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
          var panoramaOptions = {
            position: nearStreetViewLocation,
            pov: {
              heading: heading,
              pitch: 30
            }
          };
        var panorama = new google.maps.StreetViewPanorama(
          document.getElementById('pano'), panoramaOptions);
      } else {
        infowindow.setContent('<div>' + marker.title + '</div>' +
          '<div>No Street View Found</div>');
      }
    }
    // Use streetview service to get the closest streetview image within
    // 50 meters of the markers position
    //streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
    // Open the infowindow on the correct marker.
    infowindow.open(map, marker);
  }
  }

function showMarkers(){
  hideMarkers();
  var bounds = new google.maps.LatLngBounds();
  for(i=0; i<markers.length;i++){
    console.log(CurrentMap().locations()[i].visibility);
    if(CurrentMap().locations()[i].visibility==true){
      markers[i].setMap(map);
      bounds.extend(markers[i].position);
    }
  };
  map.fitBounds(bounds);
  console.log('break');
}

function hideMarkers(){
  var bounds = new google.maps.LatLngBounds();
  markers.forEach(function(marker){
    marker.setMap(null);
  });
}

function loadStreet(){
  console.log("test");
}
$('#form-container').submit(loadStreet);

function makeMarkerIcon(markerColor) {
var markerImage = new google.maps.MarkerImage(
      'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
      '|40|_|%E2%80%A2',
    new google.maps.Size(21, 34),
    new google.maps.Point(0, 0),
    new google.maps.Point(10, 34),
    new google.maps.Size(21,34));
  return markerImage;
}

