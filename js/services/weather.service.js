const weather_API_KEY = '2877695d61c707f312e28cc68f9dc19d';


function getWeatherData(lat, lng, unit = 'metric') {
    var NUM_OF_DAYS = 7 ;
    axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=${unit}&APPID=${weather_API_KEY}`)
        .then(res => {
            renderWeatherNow(res.data);
        })
        .catch(err => {
            console.log('weather now Err', err);
        })
    axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&cnt=${NUM_OF_DAYS}&units=${unit}&APPID=${weather_API_KEY}`)
        .then(res => {
            renderWeatherMunDays(res.data);
        })
        .catch(err => {
            console.log('weather by hours Err', err);
        })
    // 2877695d61c707f312e28cc68f9dc19d
}

function renderWeatherNow(weather){
    document.querySelector('.city').innerText = weather.name;
    document.querySelector('.country-code').innerText = weather.sys.country;
    document.querySelector('.temp').innerText = Math.round(weather.main.temp) + '°';
    document.querySelector('.status').innerText = weather.weather[0].main;
    document.querySelector('.humidity span').innerText = weather.main.humidity + '%'; 
    document.querySelector('.weather-img img').src=`https://openweathermap.org/img/w/${weather.weather[0].icon}.png`
    var elImg = document.querySelector('.weather-img img');
    var elweatherNow = document.querySelector('.weather-now');
    var day = weather.weather[0].icon.indexOf('d');
    if(day > -1){
        elweatherNow.style.backgroundImage = `url('./images/day.jpg')`
    }else{
        elweatherNow.style.backgroundImage = 'url("./images/night.jpg")'
    }
    let sunsetObj = new Date(weather.sys.sunset);
    document.querySelector('.sunset span').innerText = sunsetObj.getHours() + ':' + sunsetObj.getMinutes();
    var elWind = document.querySelector('.wind span').innerText = weather.wind.speed;
}

function renderWeatherMunDays(weathers){
    var weather = weathers.list; 
    let strHtmls = weathers.list.map((strHtml,idx) => {
        let date =new Date((weather[idx].dt_txt))
        return strHtml = `
        <div class="day day${idx}">
            <h2>${date.getHours()}:00</h2>
            <p>${weather[idx].weather[0].main}</p>
            <img src="https://openweathermap.org/img/w/${weather[idx].weather[0].icon}.png" alt="">
            <h2>${Math.round(weather[idx].main.temp) + '°'}</h2>
        </div>
        `        
    });
    document.querySelector('.next-days').innerHTML = strHtmls.join('');
   
}

export default{
    getWeatherData
}
