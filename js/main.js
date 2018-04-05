console.log('Main!');

import locService from './services/loc.service.js'
import mapService from './services/map.service.js'
import weatherService from './services/whether.service.js'


const GEOCODE_KEY = 'AIzaSyBLTGWuNv67ZQBPz4eFJLo2cr-4qUCwW9o'


var crrLoc = {
    lat : 32.0852999,
    lng : 34.78176759999999
};

locService.getLocs()
    .then(locs => console.log('locs', locs))

window.onload = () => {
    let url = window.location.href;
    let queryIdx = url.indexOf('?');
    if(queryIdx > -1){
       crrLoc = getUrlParms(url,queryIdx);
    } 

    mapService.initMap(crrLoc.lat,crrLoc.lng)
        .then(
            () => {
                mapService.addMarker(crrLoc);
            }
        );

    weatherService.getWeatherData(crrLoc.lat, crrLoc.lng);
}

var elLocBtn = document.querySelector('.my-loc-btn');
    elLocBtn.addEventListener('click', (ev) => {
    document.querySelector('.search-form input').value = '';
    elLocBtn.style.background = '#f2eeeead'
    locService.getPosition()
        .then(({ coords }) => {
            var { latitude: lat, longitude: lng } = coords
            mapService.repositionMap({ lat, lng });
            mapService.addMarker({ lat, lng })
            weatherService.getWeatherData(lat, lng);
            console.log('User position is:', coords);
            changeClipboardIcon(false);
        })
        .catch(err => {
            console.log('err!!!', err);
        })
})

document.querySelector('.search-form').addEventListener('submit', () => {
    elLocBtn.style.background = '#fff'
    searchAddress();
    changeClipboardIcon(false);
})

function searchAddress() {
    var address = document.querySelector('#searchInput').value;
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?&address=${address}&key=${GEOCODE_KEY}`)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            var { location } = data.results[0].geometry;
            mapService.repositionMap(location);
            mapService.addMarker(location)
            var { lat, lng } = location;
            crrLoc = { lat, lng };
            weatherService.getWeatherData(lat, lng)
        })
        .catch(err => {
            console.log('Search Err', err);
        })
}


document.querySelector('.celsius').addEventListener('click', () => {
    weatherService.getWeatherData(crrLoc.lat,crrLoc.lng);
    document.querySelector('.metric-symbol').innerText = 'C°'
   
})
document.querySelector('.fahrenheit').addEventListener('click', () => {
    weatherService.getWeatherData(crrLoc.lat, crrLoc.lng, 'imperial');
    document.querySelector('.metric-symbol').innerText = 'F°'
})


document.querySelector('.more-btn').addEventListener('click', () => {
    document.querySelector('.next-days').style.display = 'flex';
    document.querySelector('.more-btn').hidden = true;
    document.querySelector('.close-btn').hidden = false; 
})

document.querySelector('.close-btn').addEventListener('click', () => {
    document.querySelector('.next-days').style.display = 'none';
    document.querySelector('.more-btn').hidden = false;
    document.querySelector('.close-btn').hidden = true;
})


document.querySelector('.clipboard-btn').addEventListener('click', () => {
    getQueryStr ()    
})


function getQueryStr () {
    let queryStr = `http://127.0.0.1:5500/?lat=${crrLoc.lat}&lng=${crrLoc.lng}`;
    let elClipboard = document.querySelector('#clipboard');
    elClipboard.innerText = queryStr;
    elClipboard.hidden = false;
    elClipboard.select();
    try {
        let successful = document.execCommand('copy');
        changeClipboardIcon(true);
    } catch (err) {
        elClipboard.classList.add('highlight-err');
        setTimeout(()=>{
            elClipboard.classList.remove('highlight-err')
        },1000)
    }
    elClipboard.hidden = true;
}


function getUrlParms(url,queryIdx){
        let queryStr = url.slice(queryIdx + 1 ,url.length);
        let parms = queryStr.split('&');
        parms = parms.map(item => {return item.slice(4,item.length)})
        return{
            lat:parms[0]*1,
            lng:parms[1]*1
        }
}

function changeClipboardIcon(copied){
    var elClipboardIcon = document.querySelector('.clipboard-btn i');
    var elClipboard =document.querySelector('.clipboard-btn')
    if(copied){
        elClipboardIcon.classList.remove('fa-clipboard')
        elClipboardIcon.classList.add('fa-clipboard-check')
        elClipboard.classList.add('highlight-success');
        setTimeout(()=>{
            elClipboard.classList.remove('highlight-success')
        },1000)
    }else{
        elClipboardIcon.classList.remove('fa-clipboard-check')
        elClipboardIcon.classList.add('fa-clipboard')
    }
}





