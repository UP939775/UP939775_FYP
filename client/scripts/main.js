const socket = io();
let dom = {};
let homeavail = [];

function createCardElement(elemName, elType, className, content, where){
    elemName = document.createElement(elType);
    elemName.textContent = content;
    elemName.className = className;
    where.append(elemName);
}

async function displayLocations(locations){

    for (const location of locations) {
        const locationCard = document.createElement('div');
        locationCard.className = 'location-card';
        dom.listView.append(locationCard);


        locationCard.addEventListener('click', function() {
            window.location.href = `/park-location.html#${location.park_id}`
        })

        const locationImage = document.createElement('img');
        locationImage.src = `./images/park-images/${location.park_id}.jpg`
        locationImage.className = 'location-card-image';
        locationCard.append(locationImage);
        
        createCardElement('locationTitle', 'h2', 'location-card-text', location.park_name, locationCard);

        const addressContainer = document.createElement('div');
        addressContainer.className = 'card-address-container'
        locationCard.append(addressContainer);
        
        createCardElement('locationAddress', 'p', 'location-card-text card-address', 
            `${location.park_address}, ${location.park_town}, ${location.park_city}, ${location.park_postcode}`, 
            addressContainer);

        createCardElement('locationDescription', 'p', 'location-card-text card-description', `${location.park_description.substring(0,150)}...`, locationCard);

        dom.facilitiesContainer = document.createElement('ul');
        dom.facilitiesContainer.className = 'facilities-container-home';
        locationCard.append(dom.facilitiesContainer);
        dom.facilitiesContainer.id = location.park_id;


        
        const response = await fetch(`/home-availibility/${location.park_id}`)
        let facilities
        if (response.ok) {
            facilities = await response.json();
        } else {
            facilities = { error: 'This location cannot be found. Please return to the home page' };
        }


        for (const [key, value] of Object.entries(facilities[0])) {
            if(value === 1){
                dom.facility = document.createElement('li');
                dom.facility.classList = 'facility-home facility-home-available';
                dom.facility.id = `${location.park_id.substring(0,8).toUpperCase()}-${key.match(/[A-Z]/g).join('').toUpperCase()}`
                dom.facility.textContent = key;
                dom.facilitiesContainer.append(dom.facility);

            } if (value === 0) {
                dom.facility = document.createElement('li');
                dom.facility.classList = 'facility-home facility-home-unavailable';
                dom.facility.id = `${location.park_id.substring(0,8).toUpperCase()}-${key.match(/[A-Z]/g).join('').toUpperCase()}`
                dom.facility.textContent = key;
                dom.facilitiesContainer.append(dom.facility);
            }
        }

        homeavail.push(dom.facilitiesContainer.innerHTML);
    }
    initMap()
}



async function homeAvailibility(result) {
    dom.homeAvailibilitySignals = document.querySelectorAll('.facility-home');

    for(signal of dom.homeAvailibilitySignals) {
        if(result[3] === signal.id && result[4] === true){
            signal.classList = 'facility-home facility-home-available';
        } else if(result[3] === signal.id && result[4] === false){
            signal.classList = 'facility-home facility-home-unavailable';
        }
    }
}




async function loadLocations() {
    dom.userLocation.textContent = localStorage.getItem('userLocation')
    const response = await fetch(`locations/${localStorage.getItem('userLocation')}`);
    let locations;
    if (response.ok) {
        locations = await response.json();
    } else {
        locations = [{ msg: 'Unable to load park locations, please refresh page' }];
    }

      displayLocations(locations);

      if(sessionStorage.getItem('pageView') === 'map'){
          displayMap();
      }
    return locations
}

async function initMap(locations, searchValue) {

    const response = await fetch(`/home-availibility/${location.park_id}`)
        let facilities
        if (response.ok) {
            facilities = await response.json();
        } else {
            facilities = { error: 'This location cannot be found. Please return to the home page' };
        }

    const coordinates = {
        'bristol': [51.455239778004014, -2.588871638061535],
        'portsmouth': [50.80691578710422, -1.07415043650875]
    }


    if(localStorage.getItem('userLocation')==='Bristol'){
        lat = coordinates.bristol[0];
        lng = coordinates.bristol[1];
        zoom = 13
    } else if(localStorage.getItem('userLocation')==='Portsmouth'){
        lat = coordinates.portsmouth[0];
        lng = coordinates.portsmouth[1];
        zoom = 12
    }
    
    if (lat === undefined || lng === undefined) {
        lat = 50.80691578710422;
        lng = -1.07415043650875;
        zoom = 4;
    }

    if(locations === undefined) {
        const response = await fetch(`locations/${localStorage.getItem('userLocation')}`);
        if (response.ok) {
            locations = await response.json();
          } else {
            locations = [{ msg: 'Unable to load park locations, please refresh page' }];
        }
    }

    map = new google.maps.Map(document.getElementById('main-map'), {
        center: {lat: lat, lng: lng},
        zoom: zoom,
        mapTypeControl: false,
        fullscreenControl: false,
    });



    
    for (let i = 0; i < locations.length; i++) {
        


        

        const contentString =
            `<div id="marker-content">
                <h1 id="marker-heading" class="firstHeading">${locations[i].park_name}</h1>
                <div class="map-availibilty">
                    <ul>
                        ${homeavail[i]} 
                    </ul>
                </div>

                <div id="marker-body">
                    <a href="/park-location.html#${locations[i].park_id}"><h3 id='view-park-map'>View Park</h3></a> 
                </div>
                
            </div>`;

            for (const [key, value] of Object.entries(locations[i])) {
                if(value.toUpperCase().includes(dom.searchBar.value.toUpperCase()) || homeavail[i].toUpperCase().includes(dom.searchBar.value.toUpperCase()) ) {
                    let marker = new google.maps.Marker({
                        position: {lat: parseFloat(locations[i].park_lan), lng: parseFloat(locations[i].park_lon)},
                        map: map,
            
                    });
            
                    const infowindow = new google.maps.InfoWindow({
                                content: contentString
                    });
            
                    marker.addListener("click", () => {
                        infowindow.open({
                          anchor: marker,
                          map,
                          shouldFocus: true,
                        });
                    });

                }

            }
    }
};



function displayMap(){
    // dom.searchBar.style.display = 'none';

    dom.mainMap.style.display = 'block';
    dom.listView.style.display = 'none';

    dom.mapViewButton.classList = 'icon-container view-active';
    dom.listViewButton.classList = 'icon-container';


    sessionStorage.setItem("pageView", "map");

}

function displaylistView() {

    dom.mainMap.style.display = 'none';
    dom.listView.style.display = 'flex';

    dom.listViewButton.classList = 'icon-container view-active';
    dom.mapViewButton.classList = 'icon-container';

    sessionStorage.setItem("pageView", "list");


}



function displayHomeFilters(){
    dom.searchBar.style.display = 'none';

    if(dom.homeFilterContainer.style.display === 'flex'){
        dom.homeFilterContainer.style.display = 'none';
        this.classList = 'icon-container';
        
    } else {
        dom.homeFilterContainer.style.display = 'flex';
        this.classList = 'icon-container view-active';
    }

}


function searchFunction(){
    dom.allLocationCards = document.querySelectorAll('.location-card')
    let searchValue = this.value.toUpperCase();

    

    for (let i = 0; i < dom.allLocationCards.length; i++) {
        let parkTitle = dom.allLocationCards[i].innerHTML.toUpperCase();

        if(!parkTitle.includes(searchValue)) {
            dom.allLocationCards[i].style.display = 'none';
            
        } else if(parkTitle.includes(searchValue)){
            dom.allLocationCards[i].style.display = 'block';
        }
    }

    initMap()
}



async function filterLocations() {
    dom.listView.innerHTML = ' '

    if(dom.filterDropdown.value === 'Show All') {
        loadLocations();
    } else {
        const response = await fetch(`/filtered-data/${localStorage.getItem('userLocation')}/${dom.filterDropdown.value}/`);
        let locations;
        if (response.ok) {
            locations = await response.json();
        } else {
            locations = [{ msg: 'Unable to load park locations, please refresh page' }];
        }
    
        displayLocations(locations)
        initMap(locations)
    }
    dom.homeFilterContainer.style.display = 'none';
    dom.filterButtonHome.classList = 'icon-container';
}

function displayModal(){
    if(!localStorage.getItem('userLocation')){
        dom.modal.style.display = "block";

    }
}

function changeLocationModal(){
    dom.modal.style.display = "block";

}

function getUserLocation() {
    
    if(dom.modalLocation.value.toUpperCase() === 'bristol'.toUpperCase() || dom.modalLocation.value.toUpperCase() === 'portsmouth'.toUpperCase()) {
        dom.modal.style.display = "none";
        localStorage.setItem('userLocation', dom.modalLocation.value)
        dom.listView.innerHTML = ' ';
        initMap();
        loadLocations();

    } else {
        dom.invalidModalSelection.style.display = 'block';
    }
    
}


//DOM ELEMENTS FUNCTION
function domElements() {

    dom.mapViewButton = document.querySelector('#map-view'); //Button to show the map view
    dom.listViewButton = document.querySelector('#list-view');//Button to show the list view
    dom.listView = document.querySelector('.home-parks')//Continer user to create the list view
    dom.filterOptions = document.querySelector('.home-filters');
    dom.mainMap = document.querySelector('#main-map'); //Container used to create map
    dom.searchBar = document.querySelector('#search-home');
    dom.locationDropdown = document.querySelector('#location-option');

    // dom.searchBarButton = document.querySelector('#search-button-home');
    dom.filterButtonHome = document.querySelector('#filter-button-home');
    dom.homeFilterContainer = document.querySelector('.home-filter-container');
    dom.filterDropdown = document.querySelector('.home-filter-dropdown');
    dom.filterSubmitButton = document.querySelector('#home-filter-button');
    dom.userLocation = document.querySelector('.user-location');


    dom.modal = document.querySelector('#myModal');
    dom.modalSubmitButton = document.querySelector('#modal-submit-button')
    dom.modalLocation = document.querySelector('#modal-location');
    dom.invalidModalSelection = document.querySelector('#invalid-modal-selection');
}

// EVENT LISTENERS FUNCTION
function prepareEventListeners() {
    dom.mapViewButton.addEventListener('click', displayMap);
    dom.listViewButton.addEventListener('click', displaylistView);
    dom.searchBar.addEventListener('keyup', searchFunction);
    // dom.searchBarButton.addEventListener('click', displaySearchBar);
    dom.filterButtonHome.addEventListener('click', displayHomeFilters);
    dom.userLocation.addEventListener('click', changeLocationModal)

    dom.modalSubmitButton.addEventListener('click', getUserLocation);
    dom.filterSubmitButton.addEventListener('click', filterLocations);

}



//PAGE LOADED FUNCTION 
function pageLoaded(){
    domElements();
    prepareEventListeners();
    loadLocations();
    displayModal();

    socket.on('change', (result) => {
        homeAvailibility(result);
    });

    console.log('Page Loaded...');
}

window.addEventListener('load', pageLoaded);