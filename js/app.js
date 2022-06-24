//API de OpenWeather
const api = {
    key: "33f9cd692f880057720addf0923e2ace",
    url: "https://api.openweathermap.org/data/2.5/",
}


//Declaro array vacio de lo que ingrese el usuario
const citiesEntered = [];  

const searchBox = document.querySelector('#search-box');
//Evento para cuando el usuario presione ENTER se ejecute la funcion "fetchData", luego de que termine de ejecutarse el evento se resetea el valor del input

/*Buscar ingresando el nombre de una ciudad/provincia (EJ, Palermo/Buenos Aires), o ingresando una coma separado del nombre 
de una ciudad/provincia y el codigo de pais (EJ, Palermo, AR| Santa Fe, AR)*/
searchBox.addEventListener("keypress", (searchCity)=> {
    if (searchCity.keyCode == 13) {
        requestAPI(searchBox.value);
        citiesEntered.push(searchBox.value);//Lo que ingrese el usuario se pushea al array y se guarda en el localStorage
        localStorage.setItem("city", (citiesEntered));
        searchBox.value = "";   
        notification.style.display = 'none';                                          
    } 
})

//localStorage
const savedCities = (localStorage.getItem("city"));

//Comprueba si el navegador soporta la geolocalizacion
const notification = document.querySelector('.notification');
if("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(setPosition, showError);
}else {
    notification.style.display = 'block';
    notification.innerHTML = `<p> Your browser doesn't support Geolocalization`;
}

//Obtener geolocalizacion del usuario
function setPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    fetchData(latitude, longitude);
}

//Muestra un error cuando hay un problema con al geolocalizacion
function showError(error) {
    notification.style.display = 'block';
    notification.innerHTML = `<p> ${error.message}`;
}

//Funcion para hacer un request a la API y obtener los datos en un objeto. Se debe buscar una ciudad o provincia de manera manual(sin geocalizacion)
function requestAPI(city) {
    fetch(`${api.url}weather?q=${city}&units=metric&appid=${api.key}`)
    .then(weather => {
        if(!weather.ok) {//Validacion de datos
            Swal.fire({
                icon: 'error',
                text: 'Please, enter a valid city name',
                footer: 'For example: Palermo or Buenos Aires. Or Palermo, AR(Your country code)',
                background: '#131313',
                color: '#fff',
                showconfirmButton: true,
                showCloseButton: true,
                focusConfirm: false,
                focusCancel: false,
                confirmButtonColor: "#333333",
                cancelButtonColor: "#333333",
                backdrop: 'rgba(0, 0, 0, 0.6)',
            });
        }
        return weather.json();
    }).then(displayResults);                                     
}

//Funcion para hacer un request a la API y obtener los datos en un objeto. Si el usuario acepta la geocalizacion se se ejecuta la funcion.
function fetchData(latitude, longitude) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${api.key}`)
    .then(weather => {
        return weather.json();
    }).then(displayResults);
}

//Funcion para mostrar los resultados de la busqueda o de la geocalizacion del usuario por pantalla
function displayResults(info) {
    let city = document.querySelector('.location .city');
    city.innerHTML = `${info.name}, ${info.sys.country}`;

    let currentDate = new Date(); 
    let date = document.querySelector('.location .date');
    date.innerHTML = getDate(currentDate);
 
    let temp = document.querySelector('.current-weather .temp');
    temp.innerHTML = `${Math.round(info.main.temp)}<span>°c</span>`;

    let {description, id} = info.weather[0];
    document.querySelector('.current-weather .weather').innerText = description;

    let humidity = document.querySelector('.current-weather .humidity');
    humidity.innerHTML = `<p>Humidity:</p> ${info.main.humidity}%`;

    let wind = document.querySelector('.current-weather .wind');
    wind.innerHTML = `<p>Wind:</p> ${info.wind.speed} <span>km/h</span>`;

    console.log(info);// Datos que envia la API en formato JSON

    //Dependiendo del ID del clima, se cambia el backgroundImage
    if(id == 800){
        document.body.style.backgroundImage = "url('./assets/clear.JPG')";
    }
    else if(id >= 801 && id <= 804) {
        document.body.style.backgroundImage = "url('./assets/clouds.JPG')";
    }
    else if(id >= 701 && id <= 721) {
        document.body.style.backgroundImage = "url('./assets/mist.JPG')";
    }
    else if((id >= 500 && id <= 531) || (id >= 300 && id <= 321)) {
        document.body.style.backgroundImage = "url('./assets/rain.JPG')";
    }
    else if(id >= 200 && id <= 232) {
        document.body.style.backgroundImage = "url('./assets/storm.JPG')";
    }
    else if(id >= 600 && id <= 622) {
        document.body.style.backgroundImage = "url('./assets/snow.JPG')";
    }
}

//Funcion par dar la fecha actual del usuario
function getDate(){
    let date = new Date();
    return `${date.getDate()}-${ ('0' + (date.getMonth() + 1)).slice(-2)}-${date.getFullYear()}`;
}
