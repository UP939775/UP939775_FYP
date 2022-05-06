const socket = io();
let dom = {}
let x = [];



function getLocationID() {
    return window.location.hash.substring(1);
}

function randomise() {

    
    // for (const tickbox of dom.allTickboxes) {
    //     let random = Math.random() < 0.5;

    //     if(random === true) {
    //         console.log(getInfo(tickbox))

    //     } 

    //     let timeStamp = new Date();
    //     timeStamp = timeStamp.toString().substring(0,25);
        
    // }
    
}

async function getTestData(parks) {
    const response = await fetch(`../test-data`);
    if (response.ok) {
        parks = await response.json();
        } else {
        parks = { error: 'This location cannot be found. Please return to the home page' };
        dom.parkTitle.textContent = parks.error
    }
    let counter = 0

    let array = [];

    for (const park of parks) {
        dom.park = document.createElement('div');
        dom.park.className = 'park-test';
        dom.park.id = park['Park ID']
        dom.container.append(dom.park);

        dom.parkName = document.createElement('h3');
        dom.parkName.className = 'park-name-test';
        dom.parkName.textContent = `Park Name: ${park['Park Name']}   -   Park ID: ${park['Park ID']}`;
        dom.park.append(dom.parkName);

        counter++

        for (const [key, value] of Object.entries(park)) {
            if(value === 1 || value === 0){
                dom.checkboxTest = document.createElement('div');
                dom.checkboxTest.className = `park-checkbox-test ${park['Park ID']}`;
                dom.park.append(dom.checkboxTest);

                dom.checkboxLabel = document.createElement('label');
                dom.checkboxLabel.textContent = `${key}`;
                dom.checkboxLabel.for = 'checkbox';
                dom.checkboxTest.append(dom.checkboxLabel);

                dom.tickbox = document.createElement('input');
                dom.tickbox.type = 'checkbox'
                dom.tickbox.id = `${park['Park ID'].substring(0,8).toUpperCase()}-${dom.checkboxLabel.textContent.match(/[A-Z]/g).join('').toUpperCase()}`;
                dom.tickbox.className = 'tickbox';

                if(value === 1) {
                    dom.tickbox.checked = true;
                }
                dom.checkboxTest.append(dom.tickbox);
            }
            array.push(value);
        }
        x.push(array)
        array = [];    
    }

    dom.tickboxes = document.querySelectorAll('.tickbox');
    for (const tickbox of dom.tickboxes) {
        tickbox.addEventListener('change', getTickbox); 
    }

    dom.tickboxes = document.querySelectorAll('.park-test');
    
}

function getInfo(tickboxElement) {
    dom.tickboxes = document.querySelectorAll('.tickbox');

    let avName = tickboxElement.id.substring(9,tickboxElement.id.length).toLowerCase() + '_available'
    let avTimestamp = tickboxElement.id.substring(9,tickboxElement.id.length).toLowerCase() + '_timestamp'
    let facID = `${tickboxElement.id}`;
    console.log(tickboxElement);
    let parkID = tickboxElement.parentNode.parentNode.id

    let array = [parkID, avTimestamp, avName, facID];

    return array     
}


function getTickbox() {
    let value;
    let timeStamp = new Date();
    timeStamp = timeStamp.toString().substring(0,25);

    let result = getInfo(this);

    if (this.checked) {

        value = true;

    } else if(!this.checked){

        value = false

    }
    result.push(value, timeStamp)
    console.log(result  )
    updateSystem(result)
}

function updateSystem(result){
    if(this.checked === true) {

        result[3] = true

    } else if(this.checked === false) {

        result[3] = false

    }
    socket.emit('checkbox', result);
}

//DOM ELEMENTS FUNCTION
function domElements() {
    dom.container = document.querySelector('#testing-main');
    dom.header = document.querySelector('.header');
    dom.allTickboxes = document.getElementsByTagName('input');
    dom.randomiseButton = document.querySelector('#randomise');
}

// EVENT LISTENERS FUNCTION
function prepareEventListeners() {
    dom.randomiseButton.addEventListener('click', randomise)
    
       
    
}

//PAGE LOADED FUNCTION 
function pageLoaded(){
    
    domElements();
    prepareEventListeners();
    getTestData();

    

    console.log('Page Loaded...');
}

window.addEventListener('load', pageLoaded);