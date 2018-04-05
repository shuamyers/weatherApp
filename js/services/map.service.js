import { GoogleMapsApi } from './gmap.class.js';
import WeatherService from './whether.service.js'

const GEOCODE_KEY = 'AIzaSyBLTGWuNv67ZQBPz4eFJLo2cr-4qUCwW9o'

var map;

function initMap(lat = 32.0749831, lng = 34.9120554) {

    console.log('InitMap');

    const gmapApi = new GoogleMapsApi();
    return gmapApi.load().then(() => {
        map = new google.maps.Map(
            document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })

        console.log('Map!', map);
    });


}

function repositionMap(loc){
    map.setCenter(loc)
}


function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: map,
        animation: google.maps.Animation.DROP,
        title: 'Hello World'
    });
}
// marker.setIcon('http://icons.iconarchive.com/icons/icons-land/vista-map-markers/64/Map-Marker-Marker-Inside-Azure-icon.png');
// console.log(marker);
// markers.push(marker);

export default {
    initMap,
    addMarker,
    repositionMap,
}

