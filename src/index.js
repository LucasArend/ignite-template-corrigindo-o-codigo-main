const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());
app.use(cors());

const repositories = [];

function checksExistsPost(request, response, next) {
  const { id } = request.params;

  const repository = repositories.find(repository => repository.id === id);

  if (!repository) {
    return response.status(404).json({ error: 'Post does not exists' });
  }

  request.repository = repository;

  return next();
}

app.get("/repositories", (request, response) => {

  return response.json(repositories);
  
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuidv4(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository)

  return response.status(201).json(repositories);
});

app.put("/repositories/:id", checksExistsPost, (request, response) => {
  const { repository } = request;
  const { title, url, techs } = request.body  

  if(title != undefined){
    repository.title = title;
  }

  if(url != undefined){
    repository.url = url;
  }

  if(techs != undefined){
    repository.techs = techs;
  }
  
  

  return response.json(repository);
});

app.delete("/repositories/:id", checksExistsPost, (request, response) => {
  const { id } = request.params;

    const repository = repositories.findIndex(repository => repository.id === id);

  if (!repository) {
    return response.status(404).json({ error: 'Post does not exists' });
  }
  repositories.splice(repository, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", checksExistsPost, (request, response) => {
  const { repository } = request;

  // const likes = ++repositories[repository].likes;
  repository.likes = ++repository.likes;

  return response.json(repository);
});

module.exports = {
  app,
  checksExistsPost
}
