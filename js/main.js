console.log('Main!');

import locService from './services/loc.service.js'
import mapService from './services/map.service.js'


const GEOCODE_KEY = 'AIzaSyBLTGWuNv67ZQBPz4eFJLo2cr-4qUCwW9o'
const weather_API_KEY = '2877695d61c707f312e28cc68f9dc19d';

var crrLoc;

locService.getLocs()
    .then(locs => console.log('locs', locs))

window.onload = () => {
    var lat = 32.0749831;
    var lng =  34.9120554;
    crrLoc ={lat,lng}
    mapService.initMap()
        .then(
            () => {
                mapService.addMarker({
                    lat,
                    lng
                });
            }
        );
    // locService.getPosition()
    //     .then(pos => {
    //         mapService.repositionMap(pos.coords.latitude,pos.coords.longitude);
    //         console.log('User position is:', pos.coords);
    //     })
    //     .catch(err => {
    //         console.log('err!!!', err);
    //     })
    getWeatherData(lat, lng);
}



// document.querySelector('.btn1').onclick =  () => {
//     console.log('Thanks!');
// }


document.querySelector('.my-loc-btn').addEventListener('click', (ev) => {
    locService.getPosition()
        .then(({ coords }) => {
            var { latitude: lat, longitude: lng } = coords
            mapService.repositionMap({ lat, lng });
            mapService.addMarker({ lat, lng })
            getWeatherData(lat, lng);
            console.log('User position is:', coords);
        })
        .catch(err => {
            console.log('err!!!', err);
        })
})

document.querySelector('.search-form').addEventListener('submit', () => {
    searchAddress();
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
            getWeatherData(lat, lng)

        })

}

document.querySelector('.celsius').addEventListener('click', () => {
    getWeatherData(crrLoc.lat,crrLoc.lng);
    document.querySelector('.metric-symbol').innerText = 'C°'
})
document.querySelector('.fahrenheit').addEventListener('click', () => {
    getWeatherData(crrLoc.lat, crrLoc.lng, 'imperial');
    document.querySelector('.metric-symbol').innerText = 'F°'
})

function getWeatherData(lat, lng, unit = 'metric') {
    var NUM_OF_DAYS = 7 ;
    axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=${unit}&APPID=${weather_API_KEY}`)
        .then(res => {
            console.log('weather data is', res.data)
            renderweatherNow(res.data);
        });
    axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&cnt=${NUM_OF_DAYS}&units=${unit}&APPID=${weather_API_KEY}`)
        .then(res => {
            console.log('weather data is num of days', res.data)
            renderweatherMunDays(res.data);
        });
    // 2877695d61c707f312e28cc68f9dc19d
}

function renderweatherNow(weather){
   
    var elCity = document.querySelector('.city');
    elCity.innerText = weather.name;

    var elCountryCode = document.querySelector('.country-code');
    elCountryCode.innerText = weather.sys.country;

    var elTemp = document.querySelector('.temp');
    elTemp.innerText =Math.round(weather.main.temp) + '°';

    var elStatus = document.querySelector('.status');
    elStatus.innerText = weather.weather[0].main;
    
    var elHumidity = document.querySelector('.humidity span');
    elHumidity.innerText = weather.main.humidity + '%'; 

    var elImg = document.querySelector('.whether-img img');
    elImg.src=`http://openweathermap.org/img/w/${weather.weather[0].icon}.png`

     var sunsetObj = new Date(weather.sys.sunset);
     var elSunset =document.querySelector('.sunset span');
     elSunset.innerText = sunsetObj.getHours() + ':' + sunsetObj.getMinutes();

     var elWind = document.querySelector('.wind span');
     elWind.innerText = weather.wind.speed;
     
    // renderBackground(weather.sys.sunrise,weather.sys.sunset);
}

function renderweatherMunDays(weathers){
    var weather = weathers.list; 
    var strHtmls = weathers.list.map((strHtml,idx) => {
        var date =new Date((weather[idx].dt_txt))
        return strHtml = `
        <div class="day day${idx}">
            <h2>${date.getHours()}:00</h2>
            <p>${weather[idx].weather[0].main}</p>
            <img src="http://openweathermap.org/img/w/${weather[idx].weather[0].icon}.png" alt="">
            <h2>${Math.round(weather[idx].main.temp) + '°'}</h2>
        </div>
        `        
    });
    console.log(strHtmls);
    var elNextDays =document.querySelector('.next-days');
    elNextDays.innerHTML = strHtmls.join('');

}

function renderBackground(sunrise,sunset){
    var elWhetherSec = document.querySelector('.whether-sec');
    if(Date.now < sunrise && Date.now < sunset){
        elWhetherSec.style.backgroundImage = `url('../images/day.jpg')`
    }else{
        elWhetherSec.style.backgroundImage = `url('../images/night.jpg')`
    }
}


// google api key AIzaSyBLTGWuNv67ZQBPz4eFJLo2cr-4qUCwW9o