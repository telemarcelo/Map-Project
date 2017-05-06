
var Map = function(){
  this.locations = ko.observableArray([
    {Title: 'Angled Tower', 
    position: {lat: 13.412805, lng: 103.866947},
    wiki: 'Angkor_Wat',
    img: 1
    },
    {Title: 'Angkor Wat Panorama', 
    position: {lat: 13.413805, lng: 103.871947},
    wiki: 'Angkor_Wat#/media/File:Angkor_Wat.jpg',
    img: 2
    },
    {Title: 'Bayon Temple of Faces', 
    position: {lat: 13.444195,lng: 103.859051},
    wiki: 'Bayon',
    img: 3
    },
    {Title: 'Bayon Face', 
    position: {lat:13.443692, lng:103.850707},
    wiki: 'Bayon#/media/File:Das_L%C3%A4cheln_von_Angkor.jpg',
    img: 4
    },
    {Title: 'Devatas', 
    position: {lat: 13.410805,lng:  103.863947},
    wiki: 'Devata',
    img: 5
    },
    {Title: 'Holy Monks', 
    position: {lat: 13.412305,lng:  103.863947},
    wiki: 'Buddhism_in_Cambodia',
    img: 6
    },
    {Title: 'Devata', 
    position: {lat: 13.408405,lng:  103.867447},
    wiki: 'Angkor_Wat#/media/File:Asparas_(3834096437).jpg', 
    img: 7
    },
    {Title: 'Meditation Place', 
    position: {lat: 13.410305,lng:  103.869147},
    wiki: 'Angkor_Wat#/media/File:Angkor_Wat_005.jpg',
    img: 8
    },
    {Title: 'Ta Prohm: Tomb Raider', 
    position: {lat: 13.434251, lng:103.888145},
    wiki: 'Ta_Prohm',
    img: 9
    },
    {Title: 'Preah Khan: Octopuss Temple', 
    position: {lat:13.462949, lng:103.872680},
    wiki: 'Preah_Khan',
    img: 10
    },
    {Title: 'Neak Pean', 
    position: {lat: 13.462223, lng: 103.896248},
    wiki: 'Neak_Pean',
    img: 11
    },
    {Title: 'East Baray', 
    position: {lat:13.449814, lng: 103.922946},
    wiki: 'East_Baray',
    img: 12
    }]);
}

var ViewModel = function(){
  //uses model data to creat a ko.observable
  this.CurrentMap = ko.observable(new Map());
  
  //creates all the markers as part of the View Model and adds event listeners and creates 
  //some extra marker methods
  CurrentMap().locations().forEach(function(location){
    var marker = new google.maps.Marker({
      position: location.position,
      title: location.Title,
      animation: google.maps.Animation.DROP,
      icon: makeMarkerIcon("FF4400"),
      //color:'#ff0000',
      id:1
    });
    location.largeInfoWindow = new google.maps.InfoWindow();

    location.populateInfoWindow = function(mode){   
      var infoWindow = new google.maps.InfoWindow();
      if(mode==true){
      var wiki = 'https://en.wikipedia.org/wiki/'+ location.wiki;
      var flickr = 'views/Gallery/flickr.html';
      infoWindow.setContent(
        '<h2>'+location.Title+'</h2>'+
        '<div><b><a href='+ flickr+' target=_blank>ALBUM:</a></b></div>'+
        '<div><img src=img/' + location.img + '.jpg>' +
        '<div><b><a href='+wiki+' target="_blank">WIKI:</a>,</b><div>');
      if(document.getElementById("map").style.left == "100%"){$(".hamburger").click();}
    }
      else{infoWindow.setContent(location.Title);}
      infoWindow.marker = marker;
      // Make sure the marker property is cleared if the infowindow is closed.
      infoWindow.open(map, marker);
      if(mode!=true){setTimeout(function(){infoWindow.close()}, 1400)};
  }
    

    marker.addListener('click', function(){
      location.populateInfoWindow(true);
      this.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function(){marker.setAnimation(google.maps.Animation.NULL)}, 1400);
    });
   
    location.highlight = function(){
      //this.populateInfoWindow();
      marker.setIcon(makeMarkerIcon("FFFF24"));
    }

    location.dehighlight = function(){
      marker.setIcon(makeMarkerIcon("FF4400"));
      this.largeInfoWindow.close();
    }

    location.aniInfo = function(){
      location.populateInfoWindow(true);
      marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function(){marker.setAnimation(google.maps.Animation.NULL)}, 1400);
    }

    // connect events to marker listeners
    marker.addListener('mouseover', function() {
      location.populateInfoWindow();
      //populateInfoWindow(location,marker);
      location.highlight();
    });

    marker.addListener('mouseout', function() {
      location.dehighlight();
    });

    marker.addListener('onclick'),  function(){
      location.aniInfo();
    }

    location.marker = marker;

  });
  
  //filter the items using the filter text
  this.Filter = ko.observable("");
  this.FilteredItems = ko.computed(function() {
    hideMarkers();
    //var filter = this.filter().toLowerCase();
    if (!this.Filter()) { return this.CurrentMap().locations();} 
    else {
        return ko.utils.arrayFilter(this.CurrentMap().locations(), function(item) {
            if(item.Title.toLowerCase().match(this.Filter().toLowerCase())){return item}
        }); 
    }
  }, this);
  console.log(FilteredItems());
  initMap();
}

function startApp(){
  ko.applyBindings(ViewModel());
}

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

  var defaultIcon = makeMarkerIcon("0091ff");

  var highlightedIcon = makeMarkerIcon("FFFF24");

  showMarkers(true);
}

function showMarkers(refit){
  //hideMarkers();
  var bounds = new google.maps.LatLngBounds();
  FilteredItems().forEach(function(item){
    item.marker.setMap(map);
    console.log("count");
    bounds.extend(item.marker.position);
  });
  if(refit==true){map.fitBounds(bounds);}
}

function hideMarkers(){
   CurrentMap().locations().forEach(function(item){
    item.marker.setMap(null);
  });
}

function hideMarkers(){
   CurrentMap().locations().forEach(function(item){
    item.marker.setMap(null);
  });
}

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
