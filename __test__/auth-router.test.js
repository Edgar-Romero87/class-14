'use strict';

const supergoose = require('@code-fellows/supergoose');
// const { app, } = require(`${rootDir}/src/app.js`);
const server = require('../server');
const user = require('../auth/models/users-model');
const request = supergoose(server.app);
const jwt = require('jsonwebtoken');
process.env.SECRET = "sauce";

describe('api server', () => {
  //beforeEach => runs before each IT
  //can also do beforeAll & AfterAll.
  afterEach(async () =>{
    await user.remove({});
    //run the command from mongoose to delete database, bring mongoose in to do it, maybe bring the users model and remove all
    //I can move object from line 30 outside of describe as long as you're nuking.  

  })
  it('should respond with a 404 on an invalid route', async() => {
      let response = await request.get('/bad');
      console.log(response.status);
      expect (response.status).toEqual(404);
  });
  it('should respond with a 404 on an invalid route', async () => {
    let response = await request.get('/bad');
    console.log(response.status);
    expect (response.status).toEqual(404);
  });
});

it('POST/ signup creates a new user and sends an object with the user and the token to the client', async() =>{
  let obj = {
    "username": "edgar",
    "password": "edgar",
    "role": "administrator"
  }
  let response = await request.post('/signup').send(obj);
  let output = response.body;
  expect(output.user.username).toBe(obj.username);
  expect(output.user.role).toBe(obj.role);
  expect(output.user.password).toBeDefined();
  expect(output.token).toBeDefined();
  expect(response.status).toEqual(200);
});

it('POST/signup token is valid', async() =>{
  let obj = {
    "username": "edgar",
    "password": "edgar",
    "role": "administrator"
  }
  let response = await request.post('/signup').send(obj);
  let jwtVar = jwt.verify(response.body.token, process.env.SECRET);

  expect(jwtVar).toBeTruthy();
  expect(response.status).toEqual(200);
});

it('POST/signup returns valid data', async() =>{
  let obj = {
    "username": "edgar",
    "password": "edgar",
    "role": "administrator"
  }
  let response = await request.post('/signup').send(obj);
  let jwtVar = jwt.verify(response.body.token, process.env.SECRET);

  expect(jwtVar.username).toBe('edgar');
  expect(jwtVar.role).toBe('administrator');
});


it('POSt/sign in with basic authentication headers log in a user and sends an object with the user and the token to the client', async() =>{
  //NEVER REQUIRED A PREVIOUS TEST OUTPUT
  let obj = {
    "username": "Al",
    "password": "1234",
    "role": "administrator"
  }
  let response = await request.post('/signup').send(obj);
  let signIn = await request.post('/signin').auth(obj.username, obj.password);
  expect(signIn.body.user.username).toBe(obj.username);
  expect(signIn.body.user.role).toBe(obj.role);
  expect(signIn.body.user.password).toBeDefined();
  expect(signIn.body.token).toBeDefined();
})

