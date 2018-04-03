import { GoogleMapsApi } from './gmap.class.js';

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
        title: 'Hello World!'
    });
}



export default {
    initMap,
    addMarker,
    repositionMap
}

