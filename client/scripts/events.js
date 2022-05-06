let dom = {};

function createCardElement(elemName, elType, className, content, where){
    elemName = document.createElement(elType);
    elemName.textContent = content;
    elemName.className = className;
    where.append(elemName);
}

async function loadEvents() {
    dom.userLocation.textContent = localStorage.getItem('userLocation')
    const todaysDate = new Date();

    const response = await fetch(`get-events/${todaysDate}/${localStorage.getItem('userLocation')}`);
    let events;
    if (response.ok) {
        events = await response.json();
    } else {
        events = [{ msg: 'Unable to load park locations, please refresh page' }];  
    }


    let futureEvents = []

    for(parkEvent of events) {
        let dateOfEvent = Date.parse(new Date(`${parkEvent.event_date}T00:00:00Z`));
        let now = Date.now()
        if(dateOfEvent > now){
            futureEvents.push(parkEvent)
        }
    }

    for (const event of futureEvents) {

        const viewButtonLink = document.createElement('a');
        viewButtonLink.href = `/view-event.html#${event.event_id}`;
        dom.container.append(viewButtonLink);

        eventCard = document.createElement('div');
        eventCard.className = 'event-card';
        viewButtonLink.append(eventCard);

        

        eventImage = document.createElement('img');
        eventImage.className = 'event-image';
        eventCard.append(eventImage);

        const eventTitle = document.createElement('h2');
        eventTitle.className = 'event-title';
        eventCard.append(eventTitle);
        eventTitle.textContent = event.event_name;

        const eventType = document.createElement('p');
        eventType.className = 'event-type';
        eventCard.append(eventType);
        eventType.textContent = `${event.event_type} Event`.toUpperCase();


        if(event.event_type.toLowerCase() === 'recreational') {
            eventImage.src = './images/805074_birthday_512x512.png';
            eventType.style.color = 'Green';
        } else if (event.event_type.toLowerCase() === 'competitive') {
            eventImage.src = './images/istockphoto-1025281982-612x612.jpeg';
            eventType.style.color = 'Red';
        } else if (event.event_type.toLowerCase() === 'educational') {
            eventImage.src = './images/global-education-icon-vector.jpeg';
            eventType.style.color = 'Orange';
        }

        console.log(event)
        
        

        const eventLocation = document.createElement('h3');
        eventLocation.className = 'event-location';
        eventCard.append(eventLocation);
        eventLocation.textContent = `${event.event_location}`;

        const eventDate = document.createElement('p');
        eventDate.className = 'event-date';
        eventDate.textContent = `Date & Time: `;
        eventCard.append(eventDate);
        dateValue = document.createElement('span');
        eventDate.append(dateValue);
        dateValue.textContent = `${event.event_date} ${event.event_start_time} - ${event.event_end_time}`

        // const time = document.createElement('p');
        // time.className = 'event-date';
        // time.textContent = `Time: `;
        // eventCard.append(time);
        // timeValue = document.createElement('span');
        // time.append(timeValue);
        // timeValue.textContent = `${event.event_start_time} - ${event.event_end_time}`

        const time = document.createElement('p');
        time.className = 'event-description';
        time.textContent = `${event.event_description.substring(0,200)}... `;
        eventCard.append(time);


        // const time = document.createElement('p');
        // time.className = 'event-date';
        // time.textContent = `Time: `;
        // eventCard.append(time);
        // timeValue = document.createElement('span');
        // time.append(timeValue);
        // timeValue.textContent = `${event.event_start_time} - ${event.event_end_time}`



        // const viewButton = document.createElement('div');
        // viewButton.textContent = 'View Event';
        // viewButton.className = 'view-event-button';
        // viewButtonLink.append(viewButton);



    }
}


function expandFilters(){
    
    if(dom.eventFilters.style.display === 'flex'){
        dom.eventFilters.style.display = 'none';
        dom.filterEvents.style.backgroundColor = 'white'
        
    } else {
        dom.eventFilters.style.display = 'flex';
        dom.filterEvents.style.backgroundColor = 'rgba(144, 238, 144, 0.594)'
    }
    

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
    
    window.location.href = '/events.html'
}

function searchFunction(){
    dom.allEventCards = document.querySelectorAll('.event-card')
    let searchValue = this.value.toUpperCase();

    

    for (let i = 0; i < dom.allEventCards.length; i++) {
        let parkTitle = dom.allEventCards[i].innerHTML.toUpperCase();

        if(!parkTitle.includes(searchValue)) {
            dom.allEventCards[i].style.display = 'none';
            
        } else if(parkTitle.includes(searchValue)){
            dom.allEventCards[i].style.display = 'block';
        }
    }
}




//DOM ELEMENTS FUNCTION
function domElements() {
    dom.container = document.querySelector('#events-container');
    //dom.filterEvents = document.querySelector('#filter-events');
    //dom.eventFilters = document.querySelector('#event-filters');
    dom.searchBar = document.querySelector('#search-home');

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
    
    //dom.filterEvents.addEventListener('click', expandFilters);
    dom.searchBar.addEventListener('keyup', searchFunction);

}

//PAGE LOADED FUNCTION 
function pageLoaded(){
    domElements();
    prepareEventListeners();
    loadEvents(0,10);
    console.log('Page Loaded...');
}

window.addEventListener('load', pageLoaded);