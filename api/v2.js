'use strict';

const cwd = process.cwd();

const express = require('express');

const modelFinder = require(`${cwd}/middleware/model-finder.js`);
const bearer =require('../auth/middleware/bearer.js');
const users = require('../auth/models/users-model.js');
const can = require('../auth/middleware/acl.js');

const router = express.Router();

// Evaluate the model, dynamically
router.param('model', modelFinder.load);

// Models List
router.get('/models', async (request, response) => {
  const models = await modelFinder.list()
  response.status(200).json(models);
});

// JSON Schema for a model
router.get('/:model/schema', (request, response) => {
  response.status(200).json(request.model.jsonSchema());
});


// CRUD
router.get('/:model', bearer, can('read'), handleGetAll);
router.post('/:model', bearer, can('create'), handlePost);
router.get('/:model/:id',bearer, can('read'), handleGetOne);
router.put('/:model/:id',bearer, can('update'), handlePut);
router.delete('/:model/:id',bearer, can('delete'), handleDelete);

// Route Handlers
async function handleGetAll(request, response, next) {
  try{
   let result = await request.model.get(request.query);
    const output = {
      count: result.length,
      results: result,
    };
      response.status(200).json(output);
    
  } catch(e) {
    next('No Read Permissions');
   }
}

async function handleGetOne(request, response, next) {
  try{
    let result = await request.model.get({ _id: request.params.id })
    response.status(200).json(result[0]);
  }
  catch(e) {
    next('No Read Permissions');
  }
}

async function handlePost(request, response, next) {
  try {
    let result = await request.model.create(request.body)
    response.status(200).json(result);
  }
  catch(e){
    next('No create permissions');
  }
}

async function handlePut(request, response, next) {
  try{
    let result = await request.model.update(request.params.id, request.body)
    response.status(200).json(result);
  }
  catch(e){
    next('No update permissions');
  }
}

async function handleDelete(request, response, next) {
  try{
  let result = await request.model.delete(request.params.id)
  response.status(200).json(result);
  }
  catch(e){
    next('No delete permissions');
  }
}

module.exports = router;
