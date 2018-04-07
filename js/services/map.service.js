import { GoogleMapsApi } from './gmap.class.js';
import WeatherService from './whether.service.js'

const GEOCODE_KEY = 'AIzaSyBLTGWuNv67ZQBPz4eFJLo2cr-4qUCwW9o'

var map;
var marker;

function initMap(lat = 32.0749831, lng = 34.9120554) {

    console.log('InitMap');

    const gmapApi = new GoogleMapsApi();
    return gmapApi.load().then(() => {
        map = new google.maps.Map(
            document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
    });


}

function repositionMap(loc){
    map.setCenter(loc)
}


function addMarker(loc) {
    marker = new google.maps.Marker({
        position: loc,
        map: map,
        animation: google.maps.Animation.DROP,
        title: 'whether location'
    });
    marker.setIcon('../../images/map-marker.png');
}


export default {
    initMap,
    addMarker,
    repositionMap,
}

