const express = require('express');
const cors    = require('cors');

const { uuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function midValidateReposId(request, response, next) {
  const { id } = request.params;

  const reposIndex = repositories.findIndex(repos => repos.id === id);

  if (reposIndex < 0)
    return response.status(400).json({ error: 'Repository not found.' });

  return next();
}

app.use('/repositories/:id', midValidateReposId);

app.get('/repositories', (req, res) => {
  return res.json(repositories);
});

app.post('/repositories', (req, res) => {
  const { title, url, techs } = req.body;

  const repos = {
    id: uuid(),
    likes: 0,
    title, url, techs,
  };

  repositories.push(repos);

  return res.status(201).json(repos);
});

app.put('/repositories/:id', (req, res) => {
  const { id } = req.params;
  const { title, url, techs } = req.body;

  const reposIndex = repositories.findIndex(repos => repos.id === id);

  repositories[reposIndex] = {
    id,
    likes: repositories[reposIndex].likes,
    title,
    url,
    techs,
  };

  return res.json(repositories[reposIndex]);
});

app.delete('/repositories/:id', (req, res) => {
  const { id } = req.params;

  const reposIndex = repositories.findIndex(repos => repos.id === id);

  repositories.splice(reposIndex, 1);

  return res.status(204).send();
});

app.post('/repositories/:id/like', (req, res) => {
  const { id } = req.params;

  const reposIndex = repositories.findIndex(repos => repos.id === id);

  repositories[reposIndex].likes++;

  return res.json(repositories[reposIndex]);
});

module.exports = app;
