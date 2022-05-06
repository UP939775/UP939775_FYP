const socket = io();
let dom = {};

let parkRefresh
let facility = {}

let communityPost = {};

function createCardElement(elemName, elType, className, content, where){
    elemName = document.createElement(elType);
    elemName.textContent = content;
    elemName.className = className;
    where.append(elemName);
}

function getLocationID() {
    return window.location.hash.substring(1);
}

async function loadParkDetails(park) {
    dom.parkTitle.textContent = park.park_name
    dom.parkAddress.textContent = `${park.park_address}, ${park.park_town}, ${park.park_postcode} `;
    dom.locationImage.src = `./images/park-images/${getLocationID()}.jpg`
    dom.parkDescription.textContent = park.park_description;


}


// async function createFacilities(park) {
    
//     const id = getLocationID();
//     const response = await fetch(`get-facilities/${id}`);
//     if (response.ok) {
//         park = await response.json();

        
//         } else {
//         park = { error: 'This location cannot be found. Please return to the home page' };
//         dom.parkTitle.textContent = park.error
//     }

//     let facilitiesArray = []

//     for (const [key, value] of Object.entries(park)) {
//         facilitiesArray.push(value);
//     }

//     facilitiesArray.shift();


//     for (let i = 0; i <= facilitiesArray.length + 1; i++) {
//         if(facilitiesArray[i] === 1){
//             dom.facilityOptions[i].innerHTML = '&#10003;';
//         } else if(facilitiesArray[i] === 0){
//             dom.facilityOptions[i].innerHTML = '&#10007;'
//         }  
//    }    
// }

async function generalInformation(){
    const id = getLocationID();
    const response = await fetch(`get-general-information/${id}`);
    if (response.ok) {
        park = await response.json();

        
        } else {
        park = { error: 'This location cannot be found. Please return to the home page' };
        dom.parkTitle.textContent = park.error
    }

    let i = 0;

    for (const [key, value] of Object.entries(park)) {
        
        if(value === 1) {
            dom.generalInfoValues[i].textContent = 'Yes';
            i++
        } else if (value === 0) {
            dom.generalInfoValues[i].textContent = 'No';
            i++
        }
    }


    
    // if(park.toilet === 1) {dom.generalInfoValues[0].textContent = 'Yes';} else {dom.generalInfoValues[1].textContent = 'No';}
    // if(park.toilet === 1) {dom.generalInfoValues[1].textContent = 'Yes';} else {dom.generalInfoValues[1].textContent = 'No';}
    // if(park.toilet === 1) {dom.generalInfoValues[2].textContent = 'Yes';} else {dom.generalInfoValues[1].textContent = 'No';}
    // if(park.toilet === 1) {dom.generalInfoValues[3].textContent = 'Yes';} else {dom.generalInfoValues[1].textContent = 'No';}
    // if(park.toilet === 1) {dom.generalInfoValues[4].textContent = 'Yes';} else {dom.generalInfoValues[1].textContent = 'No';}
    // if(park.toilet === 1) {dom.generalInfoValues[5].textContent = 'Yes';} else {dom.generalInfoValues[1].textContent = 'No';}
    // if(park.toilet === 1) {dom.generalInfoValues[6].textContent = 'Yes';} else {dom.generalInfoValues[1].textContent = 'No';}
    // if(park.toilet === 1) {dom.generalInfoValues[7].textContent = 'Yes';} else {dom.generalInfoValues[1].textContent = 'No';}
    // if(park.toilet === 1) {dom.generalInfoValues[8].textContent = 'Yes';} else {dom.generalInfoValues[1].textContent = 'No';}
    
}

async function initMap() {
    const id = getLocationID();
    const response = await fetch(`get-park/${id}`);
    let park;
    if (response.ok) {
        park = await response.json();

    } else {
        park = { error: 'This location cannot be found. Please return to the home page' };
        alert(park.error);
    }

    map = new google.maps.Map(document.getElementById('location-map'), {
        center: {lat: parseFloat(park.park_lan), lng: parseFloat(park.park_lon)},
        zoom: 17,
        mapTypeControl: false,
        fullscreenControl: false,
    });

    const contentString = `<div id="marker-content"><h3><a href="https://www.google.com/maps/@${park.park_lan},${park.park_lon},18z" target='_blank'>Get Directions</h3></div>`;

    let marker = new google.maps.Marker({
        position: {lat: parseFloat(park.park_lan), lng: parseFloat(park.park_lon)},
        map: map,

    });

    const infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    marker.addListener("click", () => {
        infowindow.open({
            anchor: marker,
            map,
            shouldFocus: false,
        });
    });

}


function calculateAvailibilityTime(date, ) {
     let seconds;
 
     seconds = Math.floor((new Date - date ) / 1000);


     seconds = Number(seconds);
     let h = Math.floor(seconds / 3600);
     let m = Math.floor(seconds % 3600 / 60);
     let s = Math.floor(seconds % 3600 % 60);
 
     let hDisplay = h > 0 ? (h < 2 ? `${h} hr` : `${h} hrs  `) : "0 hrs";
     let mDisplay = m > 0 ? (m < 1 ? `${m} min  ` : `${m} mins `) : "0 mins";
     let sDisplay = s > 0 ? (s < 1 ? `${s} sec` : `${s} secs`) : "0 secs";


     return `${hDisplay}  ${mDisplay}  ${sDisplay}`; 
 }

 async function pageConfig() {
    dom.userLocation.textContent = localStorage.getItem('userLocation')
    const id = getLocationID();
    const response = await fetch(`get-park/${id}`);
    let park;
    if (response.ok) {
        park = await response.json();
        loadParkDetails(park);
        generalInformation();
        loadEvents(0,3, dom.parkTitle.textContent)
        
        // createFacilities(park);
        } else {
        park = { error: 'This location cannot be found. Please return to the home page' };
        dom.parkTitle.textContent = park.error
    }

    initMap()


    if (localStorage.getItem('info') === 'closed') {
        dom.generalInfo.style.display = 'none';
        dom.locationSections[0].classList = 'subpage-section';
    }  
    
    if (localStorage.getItem('facility') === 'closed') {
        dom.facilities.style.display = 'none';
        dom.locationSections[1].classList = 'subpage-section';
    } 
    
    if (localStorage.getItem('event') === 'closed') {
        dom.events.style.display = 'none';
        dom.locationSections[2].classList = 'subpage-section';
    }

    if (localStorage.getItem('community') === 'closed') {
        dom.community.style.display = 'none';
        dom.locationSections[3].classList = 'subpage-section';
    }
}




async function getAvailibility(park, park_avail) {
    const id = getLocationID();
    const response = await fetch(`get-facility-availibility/${id}`);
    if (response.ok) {
        park = await response.json();
        } else {
        park = { error: 'This location cannot be found. Please return to the home page' };
        dom.parkTitle.textContent = park.error
    }


    
    let x = [];

    let availibilityTime;
    for (const [key, value] of Object.entries(park)) {  
        if (value === 1 || value === 0) {

            dom.availibility = document.createElement('div');
            dom.availibility.className = 'availibility';
            dom.section[1].append(dom.availibility);

            // createCardElement(dom.facilityName, 'div', 'facility-heading', 'Facility ', dom.availibility);
            // createCardElement(dom.facilityStatus, 'div', 'facility-status', 'Status', dom.availibility)
            // createCardElement(dom.statusDuration, 'div', 'status-duration', 'Status Duration', dom.availibility)

            dom.availibilityName = document.createElement('div');
            dom.availibilityName.className = 'availibility-name'
            dom.availibilityName.textContent = key;
            dom.availibility.append(dom.availibilityName)

            dom.availibilityStatus = document.createElement('div');
            dom.availibilityStatus.className = 'availibility-status';
            dom.availibilityStatus.style.fontWeight = 'bold'
            dom.availibility.append(dom.availibilityStatus);
        
            
            if (value === 1) {
                dom.availibilityStatus.textContent = 'Available to Use';
                dom.availibilityStatus.style.color = 'green';
            } else if (value === 0) {
                dom.availibilityStatus.textContent = 'Currently In Use';
                dom.availibilityStatus.style.color = 'red';
            }

            dom.availibilityOption = document.createElement('div');
            dom.availibilityOption.className = 'availibility-option'

            let facilityID = `${getLocationID().substring(0,8).toUpperCase()}-${dom.availibilityName.textContent.match(/[A-Z]/g).join('').toUpperCase()}`
            
            dom.availibility.append(dom.availibilityOption);
            dom.availibilityOption.id = `${facilityID}`

            
            let Available = `${dom.availibilityName.textContent.match(/[A-Z]/g).join('').toLowerCase() + '_timestamp'}`

            

            availibilityTime = new Date(`${park[`${Available}`]}`);
            x.push(availibilityTime)
            
            if(value === 1) {
                dom.availibilityOption.textContent = `${calculateAvailibilityTime(availibilityTime)}`;
            } else if(value === 0) {
                dom.availibilityOption.textContent = [`${calculateAvailibilityTime(availibilityTime)}`];

            }
        }
    } 

    dom.availibilityOptions = document.querySelectorAll('.availibility-option');

 

    

    parkRefresh = setInterval(function () {
        for (let i = 0; i < dom.availibilityOptions.length; i++) {
            dom.availibilityOptions[i].textContent = `${calculateAvailibilityTime(x[i])}`;
        }
    }, 1000)
}

function changeAvail() {
    dom.availibilityOptions = document.querySelectorAll('.availibility-option');


    for (let i = 0; i < dom.availibilityOptions.length; i++) {
    }
    // let updateTime = setInterval(function () {

    // }, 1000)

}

function expandSection() {
    this.classList.toggle("active");
    
    let sectionDropdown = this.nextElementSibling;
    
    if (sectionDropdown.style.display === 'none') {
        sectionDropdown.style.display = 'block';
        localStorage.setItem(this.id, 'open')
    } else {
        sectionDropdown.style.display = 'none';
        localStorage.setItem(this.id, 'closed')
    };
}

async function loadEvents(number, number2, parkID) {
    const response = await fetch(`get-events-for-location/${number}/${number2}/${parkID}`);
    let events;
    if (response.ok) {
        events = await response.json();
    } else {
        events = [{ msg: 'Unable to load park locations, please refresh page' }];  
    }


    if(events.length < 1 ) {
        dom.container.textContent = 'There are no upcoming events at this location'

        
    } else {
        for (const event of events) {
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
            time.className = 'event-desctiption';
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
}


function changeLocationModal(){
    dom.modal.style.display = "block";

}

function getUserLocation() {
    
    if(dom.modalLocation.value.toUpperCase() === 'bristol'.toUpperCase() || dom.modalLocation.value.toUpperCase() === 'portsmouth'.toUpperCase()) {
        dom.modal.style.display = "none";
        localStorage.setItem('userLocation', dom.modalLocation.value)
        dom.userLocation.textContent = localStorage.getItem('userLocation')
        window.location.href = "/";

    } else {
        dom.invalidModalSelection.style.display = 'block';
    }
    
}

async function submitCommunityPost() {

    communityPost.locationID = getLocationID();
    communityPost.commentAuthor = dom.commentAuthor.value;
    communityPost.communityComment = dom.communityComment.value;
    communityPost.postDate = new Date()
    communityPost.postTime = new Date().toISOString().substring(11,16);
    communityPost.postType = dom.postType.value;


    dom.commentAuthor.value = '';
    dom.communityComment.value = '';

    dom.commentAuthor.placeholder = 'Name';
    dom.communityComment.placeholder = 'Enter your message';


    const payload = { msg: communityPost }

    
    loadCommunityPosts();

    const response = await fetch('submit-community-post', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
    });

    
    
    
    
}

async function loadCommunityPosts(comments){

    dom.filterDropdown.value = localStorage.getItem('commentFilter');
    dom.messagesContainer.innerHTML = ' '
    const id = getLocationID();

    dom.messagesContainer.style.textAlign = 'left';

    if(comments === undefined){
        const response = await fetch(`/community-posts/${id}`);
        if (response.ok) {
            comments = await response.json();
        } else {
            park = { error: 'This location cannot be found. Please return to the home page' };
            dom.parkTitle.textContent = park.error
        }

        if(comments.length < 1){
            dom.messagesContainer.textContent = 'There are no current community posts.';
            dom.messagesContainer.style.textAlign = 'center';
            dom.messagesContainer.height = '2rem';
        }
    }

    let updateCount = 0;
    let alertCount = 0;

    for (const comment of comments) {
        let commentBubble = document.createElement('div');
        if(comment.comment_type === 'general') {
            commentBubble.classList = 'general-message message';
        } else if (comment.comment_type === 'alert'){
            commentBubble.classList = 'alert-message message';
            alertCount++;
        } else if (comment.comment_type === 'update'){
            commentBubble.classList = 'update-message message';
            updateCount++
        }

        dom.messagesContainer.append(commentBubble);


        let commentText = document.createElement('p');
        commentText.classList = 'community-comment';
        commentText.textContent = comment.comment;
        commentBubble.append(commentText);


        let commentDetails = document.createElement('p');
        commentDetails.classList = 'comment-details';
        commentDetails.textContent = `Posted By ${comment.comment_author} on ${comment.comment_date.substring(0,10)} at ${comment.comment_time}`;
        commentBubble.append(commentDetails);

        
    }

    dom.alertNotification.textContent = `${alertCount} Community Alerts`;
    dom.updateNotification.textContent = `${updateCount} Community Updates`;
    newFilter();

}



function newFilter(){

    dom.messages = document.querySelectorAll('.message')

    if(dom.filterDropdown.value === 'Alerts'){
        localStorage.setItem('commentFilter', 'Alerts')
        for(message of dom.messages) {
            if(message.className.substring(0,6) === 'update' || message.className.substring(0,7) === 'general'){
                message.style.display = 'none';
            } else {
                message.style.display = 'block'
            }
        }

    } else if(dom.filterDropdown.value === 'General'){
        localStorage.setItem('commentFilter', 'General')
        for(message of dom.messages) {

            if(message.className.substring(0,5) === 'alert' || message.className.substring(0,6) === 'update'){
                message.style.display = 'none';
            } else {
                message.style.display = 'block'
            }
        }
        
    } else  if(dom.filterDropdown.value === 'Updates'){
        localStorage.setItem('commentFilter', 'Updates')
        for(message of dom.messages) {

            if(message.className.substring(0,5) === 'alert' || message.className.substring(0,7) === 'general'){
                message.style.display = 'none';
            } else {
                message.style.display = 'block'
            }
        }
    } else {
        localStorage.setItem('commentFilter', 'Show All')
        for(message of dom.messages) {
            
            message.style.display = 'block'
        }
        
    }

}



//DOM ELEMENTS FUNCTION
function domElements() {
    dom.locationSections = document.querySelectorAll('.subpage-section');
    dom.parkTitle = document.querySelector('.subpage-title');
    dom.parkAddress = document.querySelector('.subpage-address');
    dom.facilityOptions = document.querySelectorAll('.facility-option');
    dom.facilityName = document.querySelectorAll('.facility-name');
    dom.locationImage = document.querySelector('.subpage-image');

    dom.parkDescription = document.querySelector('#subpage-description');
    dom.generalInfo = document.querySelector('#general-information');
    dom.events = document.querySelector('#events');
    dom.facilities = document.querySelector('#facilities');
    dom.community = document.querySelector('#community-dropdown');

    dom.section = document.querySelectorAll('.section-dropdown');
    dom.generalInfoValues = document.querySelectorAll('.info-detail-value');

    dom.container = document.querySelector('#events-container');
    dom.userLocation = document.querySelector('.user-location');

    dom.modal = document.querySelector('#myModal');
    dom.modalSubmitButton = document.querySelector('#modal-submit-button')
    dom.modalLocation = document.querySelector('#modal-location');
    dom.invalidModalSelection = document.querySelector('#invalid-modal-selection');

    dom.commentAuthor = document.querySelector('#comment-author');
    dom.communityComment = document.querySelector('#community-post');
    dom.communitySubmitButton = document.querySelector('#submit-comment-button');
    dom.postType = document.querySelector('#post-type-dropdown');
    dom.messagesContainer = document.querySelector('.community-messages-container');




    dom.filterDropdown = document.querySelector('#comment-filter')


    dom.alertNotification = document.querySelector('#alert-notification');
    dom.updateNotification = document.querySelector('#update-notification');

    




}

// EVENT LISTENERS FUNCTION
function prepareEventListeners() {
    dom.filterDropdown.addEventListener('change', newFilter);
    dom.userLocation.addEventListener('click', changeLocationModal)

    dom.modalSubmitButton.addEventListener('click', getUserLocation);

    dom.communitySubmitButton.addEventListener('click', submitCommunityPost);



    for (let i = 0; i < dom.locationSections.length; i++) {
        dom.locationSections[i].addEventListener('click', expandSection); 
    }
}

//PAGE LOADED FUNCTION 
function pageLoaded(){
    domElements();
    prepareEventListeners();
    pageConfig();
    getAvailibility();
    changeAvail();
    loadCommunityPosts();
    


    console.log('Page Loaded...');

    socket.on('change', (result) => {
        dom.section[1].innerHTML = `<hr>
                    
        <div class="location-description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris pharetra nunc sit amet fermentum venenatis.
        </div>

        <div class="headings">
            <div class="facility-heading">
                Name of Facility: 
            </div>
            <div class="facility-heading">
                Facility Status:
            </div>
            <div class="facility-heading">
                Status Duration:
            </div>
        </div>`;
        getAvailibility();
        clearInterval(parkRefresh);
    });
}

window.addEventListener('load', pageLoaded);