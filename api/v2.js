'use strict';

const cwd = process.cwd();

const express = require('express');

const modelFinder = require(`${cwd}/middleware/model-finder.js`);
const bearer =require('../auth/middleware/bearer');
const users = require('../auth/models/users-model');

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

router.get('/:model', bearer, handleGetAll);

// CRUD
router.post('/:model', handlePost);
router.get('/:model/:id', handleGetOne);
router.put('/:model/:id', handlePut);
router.delete('/:model/:id', handleDelete);

// Route Handlers
function handleGetAll(request, response, next) {
  request.model.get(request.query)
    .then(data => {
      const output = {
        count: data.length,
        results: data,
      };
      response.status(200).json(output);
    })
    .catch(next);
}

function handleGetOne(request, response, next) {
  request.model.get({ _id: request.params.id })
    .then(result => response.status(200).json(result[0]))
    .catch(next);
}

function handlePost(request, response, next) {
  request.model.create(request.body)
    .then(result => response.status(200).json(result))
    .catch(next);
}

function handlePut(request, response, next) {
  request.model.update(request.params.id, request.body)
    .then(result => response.status(200).json(result))
    .catch(next);
}

function handleDelete(request, response, next) {
  request.model.delete(request.params.id)
    .then(result => response.status(200).json(result))
    .catch(next);
}

module.exports = router;