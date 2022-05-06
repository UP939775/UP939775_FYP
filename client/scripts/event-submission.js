

let dom = {};
let _event = {};

function capitalise(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

async function loadLocations() {
    dom.userLocation.textContent = localStorage.getItem('userLocation')
    const response = await fetch(`locations/${localStorage.getItem('userLocation')}`);
    let park;
    if (response.ok) {
        park = await response.json();
    } else {
        park = { error: 'This location cannot be found. Please return to the home page' };
        alert(park.error);
    }
    
    for (let i = 0; i < park.length; i++) {
        dom.locationOption = document.createElement('option');
        dom.locationOption.textContent = park[i].park_name;
        dom.locationOption.value = park[i].park_name;
        dom.eventLocation.append(dom.locationOption);
    }
}

async function submitEvent(){
    _event.organiserName =  capitalise(dom.organiserName.value);
    _event.organiserEmail = dom.organiserEmail.value; 
    _event.organiserNumber = dom.organiserNumber.value; 
    _event.eventName = capitalise(dom.eventName.value); 
    _event.locationName = dom.eventLocation.value;
    _event.eventDemographic = dom.eventDemographic.value;
    _event.eventType = dom.eventType.value; 
    _event.eventDate = dom.eventDate.value; 
    _event.startTime = dom.startTime.value;
    _event.endTime = dom.endTime.value;
    _event.description = dom.description.value;
    _event.city = localStorage.getItem('userLocation'); 

    console.log(_event);

    const payload = { msg: _event }

    const response = await fetch('submit-event', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
    });
}

function goHome() {
    window.location.href = "/";
}

function inputValidation(){

    let invalidFields = 0;

    for(const input of dom.invalidInput) {
        input.textContent = '';
    }


    //Name validation
    if(dom.organiserName.value.length < 3) {
        dom.invalidInput[0].textContent = 'This name is too short. Please input your full name'
        
        invalidFields++;
    } else if(dom.organiserName.value.length > 30) {
        dom.invalidInput[0].textContent = 'This name is too long. Please shorten your input'
        
        
        invalidFields++;
    }

    //email validation
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
    if(re.test(String(dom.organiserEmail.value).toLowerCase()) === false) {
        dom.invalidInput[1].textContent = 'Please input a valid email address'
        invalidFields++;
    }

    //submission title validation
    if(dom.organiserNumber.value.length < 10) {
        dom.invalidInput[2].textContent = 'This number is too short. Please enter a valid number';
        invalidFields++;
    } else if(dom.organiserNumber.value.length > 12) {
        dom.invalidInput[2].textContent = 'This number is too long. Please enter a valid number';
        invalidFields++;
    }

    //Event Name validation
    if(dom.eventName.value.length < 5) {
        dom.invalidInput[3].textContent = 'This name is too short. Please input a longer event name';
        invalidFields++;
    } else if(dom.eventName.value.length > 30) {
        dom.invalidInput[3].textContent = 'This name is too long. Please input a shorter event name';
        invalidFields++;
    }

    //submission topic validation
    if(dom.eventLocation.value === ''){
        dom.invalidInput[4].textContent = 'Please select a location for the event';
        invalidFields++;
    }

     //submission topic validation
     if(dom.eventDemographic.value === ''){
        dom.invalidInput[5].textContent = 'Please select a demographic for the event';
        invalidFields++;
    }

    //submission topic validation
    if(dom.eventType.value === ''){
        dom.invalidInput[6].textContent = 'Please select a type for the event';
        invalidFields++;
    }

    //date validation

    let GivenDate = dom.eventDate.value;
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);

    if(GivenDate < today.toISOString().substring(0,10)){
        dom.invalidInput[7].textContent = 'This date is in the past, please select a date in the future';
        invalidFields++;
    } else if (GivenDate === '') {
        dom.invalidInput[7].textContent = 'Please select a valid date';
        invalidFields++;
    }

       //submission topic validation
    if(dom.startTime.value === ''){
        dom.invalidInput[8].textContent = 'Please select a time for the event to start';
        invalidFields++;
    }

           //submission topic validation
    if(dom.endTime.value === ''){
        dom.invalidInput[9].textContent = 'Please select a time for the event to start';
        invalidFields++;
    }

    if (dom.description.value.length > 500) {
        dom.invalidInput[10].textContent = 'Your description should not exceed 500 characters';
        invalidFields++;
        
    } else if (dom.description.value.length < 200) {
        dom.invalidInput[10].textContent = 'Your description should exceed 200 characters';
        invalidFields++;
    }

    console.log(invalidFields);

    
    if (invalidFields === 0) {
        submitEvent();
        goHome()
        
    }
}

function descriptionWordCount() {
    dom.wordCount.textContent = `(${dom.description.value.length}/500)`;

    if (dom.description.value.length > 500 || dom.description.value.length < 200) {
        dom.wordCount.style.color = 'red';
    } else {
        dom.wordCount.style.color = 'white';
    }
}

function changeLocationModal(){
    dom.modal.style.display = "block";
}

function getUserLocation() {
    if(dom.modalLocation.value.toUpperCase() === 'bristol'.toUpperCase() || dom.modalLocation.value.toUpperCase() === 'portsmouth'.toUpperCase()) {
        dom.modal.style.display = "none";
        localStorage.setItem('userLocation', dom.modalLocation.value);
        dom.userLocation.textContent = localStorage.getItem('userLocation')

    } else {
        dom.invalidModalSelection.style.display = 'block';
    }
}

//DOM ELEMENTS FUNCTION
function domElements() {
    

    dom.organiserName = document.querySelector('#org-name');
    dom.organiserEmail = document.querySelector('#email-address');
    dom.organiserNumber = document.querySelector('#contact-number')
    dom.eventName = document.querySelector('#event-name');
    dom.eventLocation = document.querySelector('#event-location');
    dom.eventDemographic = document.querySelector('#event-demographic');
    dom.eventType = document.querySelector('#event-type');
    dom.eventDate = document.querySelector('#event-date');
    dom.startTime = document.querySelector('#start-time');
    dom.endTime = document.querySelector('#end-time');
    dom.description = document.querySelector('#event-description');

    dom.submitButton = document.querySelector('#submit-button');


    dom.invalidInput = document.querySelectorAll('.invalid-warning');
    dom.wordCount = document.querySelector('#word-count');

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
    
    dom.submitButton.addEventListener('click', inputValidation);
    dom.description.addEventListener('keyup', descriptionWordCount)
}

//PAGE LOADED FUNCTION 
function pageLoaded(){
    domElements();
    prepareEventListeners();
    loadLocations();

    console.log('Page Loaded...');
}

window.addEventListener('load', pageLoaded);