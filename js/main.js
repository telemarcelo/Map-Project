var warnMap = function(){alert("The MAP could not LOAD :(");}


getImgs("72157682966060796");
var Map = function(){
  //getImgs("72157682966060796");
  this.flickrAlbum = ko.observable(72157682966060796)
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
  //creates an observable version of showMarkers
  this.showMarkersObs = ko.observable(function(){showMarkers(false)});
  //creates one instance of infoWindow that can be used repeatedly for all markers
  infoWindow = new google.maps.InfoWindow();
  var redMarker = makeMarkerIcon("FF4400"); //makes red marker
  var highMarker = makeMarkerIcon("FFFF24"); //makes highlighted marker

  
  console.log(imageURLs);
  
  //creates all the markers as part of the View Model and adds event listeners and creates 
  //some extra marker methods
  CurrentMap().locations().forEach(function(location){
    var marker = new google.maps.Marker({
      position: location.position,
      title: location.Title,
      animation: google.maps.Animation.DROP,
      icon: redMarker,
      //color:'#ff0000',
      id:1
    });
    //marker.imageURL = imageURLs[location.img-1];
    //console.log(imageURLs);
    //console.log(imgURLs[1]);
    //used to populate the infoWindow once a list item is clicked
    location.aniInfo = function(){
      populateInfoWindow(marker, infoWindow, location.img-1, location.Title);
      marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function(){marker.setAnimation(google.maps.Animation.NULL)}, 1400);
    }

    //populates the infoWindow once a marker is clicked
    marker.addListener('click', function(){
      location.aniInfo();

     // populateInfoWindow(marker, infoWindow);
     // this.setAnimation(google.maps.Animation.BOUNCE);
      //setTimeout(function(){marker.setAnimation(google.maps.Animation.NULL)}, 1400);
    });
    
    location.highlight = function(){
      marker.setIcon(highMarker);
    }

    location.dehighlight = function(){
      marker.setIcon(redMarker);
    }


    marker.addListener('onclick'),  function(){
      location.aniInfo();
    }

    location.marker = marker;

  });
  //sets up functionality for hamburger button
  $( ".hamburger" ).click(function() {
    if(document.getElementById("map").style.left == "100%"){
        document.getElementById("map").style.left = "0%";
      }
      else{
        document.getElementById("map").style.left = "100%";
      }
  });

  //filter the items using the filter text
  this.filter = ko.observable("");
  this.filteredItems = ko.computed(function() {
    hideMarkers();
    //var filter = this.filter().toLowerCase();
    if (!this.filter()) { return this.CurrentMap().locations();} 
    else {
        return ko.utils.arrayFilter(this.CurrentMap().locations(), function(item) {
            if(item.Title.toLowerCase().match(this.filter().toLowerCase())){return item}
        }); 
    }
  }, this);


  //console.log(FilteredItems());
  initMap();
}

function populateInfoWindow(marker, infowindow, imgNumber, title) {
  //console.log(marker, infowindow, imgNumber, title, imageURLs);
        // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker != marker) {
    // Clear the infowindow content to give the streetview time to load.
    //var sag = 'http://maps.googleapis.com/maps/api/streetview?location=41.40404,2.17513&size=70x70&heading=220&fov=70&pitch=40';
        //var sag = 'https://en.wikipedia.org/wiki/Angkor_Wat'
    //infowindow.setContent('<IMG BORDER="0" ALIGN="Left" SRC='+sag+'>');
        //infowindow.setContent('<a href='+sag+' target="_blank">Angkor Wat</a>');
    if(imageURLs[imgNumber]==null){imageURLs[imgNumber]="Image Not Found! Try Again Later.";}

    infowindow.setContent('<h2>'+title+'</h2>' + imageURLs[imgNumber]);
    //console.log(marker);
    infowindow.marker = marker;
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
    });
    
    // Open the infowindow on the correct marker.
    infowindow.open(map, marker);
  }
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

//shows all markers
function showMarkers(refit){
  var bounds = new google.maps.LatLngBounds();
  filteredItems().forEach(function(item){
    item.marker.setMap(map);
    bounds.extend(item.marker.position);
  });
  if(refit==true){map.fitBounds(bounds);}
}

//hides all markers
function hideMarkers(){
   CurrentMap().locations().forEach(function(item){
    item.marker.setMap(null);
  });
}

//makes icons of certain specifications
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

function getImgs(setId) {
  var URL = "https://api.flickr.com/services/rest/" +  // Wake up the Flickr API gods.
    "?method=flickr.photosets.getPhotos" +  // Get photo from a photoset. http://www.flickr.com/services/api/flickr.photosets.getPhotos.htm
    "&api_key=45a3e04b751f60243425d1d606f8fb1c" +  // API key. Get one here: http://www.flickr.com/services/apps/create/apply/
    "&photoset_id=" + setId +  // The set ID.
    "&privacy_filter=1" +  // 1 signifies all public photos.
    "&per_page=20" + // For the sake of this example I am limiting it to 20 photos.
    "&format=json&nojsoncallback=1";  // Er, nothing much to explain here.
  imageURLs = [];
  // See the API in action here: http://www.flickr.com/services/api/explore/flickr.photosets.getPhotos

  $.getJSON(URL,function(data){
    $.each(data.photoset.photo, function(i, item){
      // Creating the image URL. Info: http://www.flickr.com/services/api/misc.urls.html
      var img_src = "http://farm" + item.farm + ".static.flickr.com/" + item.server + "/" + item.id + "_" + item.secret + "_m.jpg";
      var imageSRC = '<img src='+img_src+' margin="8px">'
      //console.log(imageSRC);
      //console.log(img_thumb);
      imageURLs.push(imageSRC);
    });  
  })
  .fail(function() {
    alert( "Flickr Images Did NOT LOAD" );
  })
}

