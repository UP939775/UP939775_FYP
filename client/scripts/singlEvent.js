let dom = {};

function getLocationID() {
    return window.location.hash.substring(1);
}



async function loadEvent() {
    dom.userLocation.textContent = localStorage.getItem('userLocation')
    const response = await fetch(`get-event/${getLocationID()}`);
    let event;
    if (response.ok) {
        event = await response.json();
    } else {
        event = [{ msg: 'Unable to load park locations, please refresh page' }];  
    }


    displayEvent(event)
}

async function displayEvent(event) {
    dom.eventType.textContent = ` - ${event.event_type} Event -`.toUpperCase();

    if(event.event_type.toLowerCase() === 'recreational') {
        dom.eventImage.src = './images/805074_birthday_512x512.png';
        dom.eventType.style.color = 'Green';

    } else if (event.event_type.toLowerCase() === 'competitive') {
        dom.eventImage.src = './images/istockphoto-1025281982-612x612.jpeg';
        dom.eventType.style.color = 'Red';
    } else if (event.event_type.toLowerCase() === 'educational') {
        dom.eventImage.src = './images/global-education-icon-vector.jpeg';
        dom.eventType.style.color = 'Orange';
    }

    dom.parkTitle.textContent = `${event.event_name}`
    dom.generalInfoValues[0].textContent = `${event.event_location}`
    dom.generalInfoValues[1].textContent = `${event.event_date}`
    dom.generalInfoValues[2].textContent = `${event.event_start_time}`
    dom.generalInfoValues[3].textContent = `${event.event_end_time}`
    dom.generalInfoValues[4].textContent = `${event.event_demographic}`
    dom.generalInfoValues[5].textContent = `${event.organiser_name}`
    dom.generalInfoValues[6].innerHTML = `<a href="mailto:${event.organiser_email}">Send Email</a>`
    dom.generalInfoValues[7].textContent = `${event.organiser_number}`

    dom.description.textContent = event.event_description;
    
}

function changeLocationModal(){
    dom.modal.style.display = "block";

}

function getUserLocation() {
    
    if(dom.modalLocation.value.toUpperCase() === 'bristol'.toUpperCase() || dom.modalLocation.value.toUpperCase() === 'portsmouth'.toUpperCase()) {
        dom.modal.style.display = "none";
        localStorage.setItem('userLocation', dom.modalLocation.value)
        dom.userLocation.textContent = localStorage.getItem('userLocation')

    } else {
        dom.invalidModalSelection.style.display = 'block';
    }
    
}



//DOM ELEMENTS FUNCTION
function domElements() {

    dom.parkTitle = document.querySelector('.subpage-title');
    dom.eventImage = document.querySelector('.single-event-image');
    dom.generalInfo = document.querySelector('#general-information');
    dom.generalInfoValues = document.querySelectorAll('.info-detail-value');
    dom.container = document.querySelector('#events-container');
    dom.description = document.querySelector('#subpage-description');
    dom.eventType = document.querySelector('#event-type');

    dom.userLocation = document.querySelector('.user-location');

    dom.modal = document.querySelector('#myModal');
    dom.modalSubmitButton = document.querySelector('#modal-submit-button')
    dom.modalLocation = document.querySelector('#modal-location');
    dom.invalidModalSelection = document.querySelector('#invalid-modal-selection');

}

// EVENT LISTENERS FUNCTION
function prepareEventListeners() {
    dom.userLocation.addEventListener('click', changeLocationModal)

    dom.modalSubmitButton.addEventListener('click', getUserLocation);


}

//PAGE LOADED FUNCTION 
function pageLoaded(){
    domElements();
    prepareEventListeners();
    loadEvent();
    console.log('Page Loaded...');
}

window.addEventListener('load', pageLoaded);

