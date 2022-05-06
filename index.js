import express from 'express'; 
import http from 'http';
import { Server } from "socket.io";
import uuid from 'uuid-random'
import * as db from "./Database/database.js";



const app = express();
const server = http.createServer(app)
const io = new Server(server)

app.use(express.static('client', { extensions: ['html'] }));
server.listen(8080, () => {
  console.log('Server Running')
});
app.use(express.json());

io.on('connection', socket => {
  let currentValue;
  socket.on('checkbox', (result) => {
    io.emit('change',  result);
    db.storeAvailibility(result);
  })
})

app.get('/locations/:userLocation', async (req, res) => {
    res.json(await db.getAllParkLocation(req.params.userLocation));
})

app.get('/get-park/:id', async (req, res) => {
  const result = await db.searchPark(req.params.id);
  if (!result) {
    res.status(404).send(`This location cannot be found. Please return to the home page`);
    return;
  }
  res.json(result);
  });
app.get('/get-facilities/:id', async (req, res) => {

  const result = await db.getParkFacilities(req.params.id);
  if (!result) {
    res.status(404).send(`This location cannot be found. Please return to the home page`);
    return;
  }
  res.json(result);
});

app.get('/get-general-information/:id', async (req, res) => {

  const result = await db.getGeneralInformation(req.params.id);
  if (!result) {
    res.status(404).send(`This location cannot be found. Please return to the home page`);
    return;
  }
  res.json(result);
});

app.get('/get-facility-availibility/:id', async (req, res) => {
  const result = await db.facility_availibility(req.params.id);
  if (!result) {
    res.status(404).send(`This location cannot be found. Please return to the home page`);
    return;
  }
  res.json(result);
});

app.get('/filter-data', async (req, res) => {
  const result = await db.getAllParkFacilities();
  res.json(result)
})

app.get('/test-data', async (req, res) => {
  const result = await db.testData();
  res.json(result)
})

app.post('/submit-event', (req, res) => {
  let event = req.body.msg;
  let eventArray = []
  eventArray.push(uuid())
  for (const [key, value] of Object.entries(event)) {
    eventArray.push(value)
  }

  db.addEvent(eventArray);
})

app.get('/get-events/:todaysDate/:userLocation', async (req, res) => {
  const result = await db.getEvents(req.params.todaysDate, req.params.userLocation);
  res.json(result)
})

app.get('/get-events-for-location/:number/:number2/:parkID', async (req, res) => {
  const result = await db.getEventsForPark(req.params.number, req.params.number2, req.params.parkID);
  res.json(result);
})


app.get('/get-event/:id', async (req, res) => {
  const result = await db.getEvent(req.params.id);
  if (!result) {
    res.status(404).send(`This event cannot be found. Please return to the home page`);
    return;
  }
  res.json(result);
});

app.get('/filtered-data/:userLocation/:filter', async (req, res) => {
  const result = await db.filterData(req.params.userLocation, req.params.filter);
  if (!result) {
    res.status(404).send(`This event cannot be found. Please return to the home page`);
    return;
  }
  res.json(result);
});

app.post('/submit-community-post', (req, res) => {
  let communityPost = req.body.msg;
  let commentArray = []

  commentArray.push(uuid())
  for (const [key, value] of Object.entries(communityPost)) {
    commentArray.push(value)
  }

  db.addCommunityPost(commentArray);
})


app.get('/community-posts/:locationID', async (req, res) => {
  const result = await db.getCommunityComments(req.params.locationID);
  if (!result) {
    res.status(404).send(`The community posts cannot be found. Please return to the home page`);
    return;
  }
  res.json(result);
});


app.get('/home-availibility/:parkid', async (req, res) => {
  const result = await db.homeAvailibility(req.params.parkid);
  res.json(result)
})