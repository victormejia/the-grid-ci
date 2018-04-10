const functions = require('firebase-functions');
const db = require('./db.json');

const getById = id => db.hackers.filter(hacker => hacker.id === id);

const getByTerm = term =>
  db.hackers.filter(hacker => hacker.name.includes(term) || hacker.status.includes(term));

exports.hackers = functions.https.onRequest((request, response) => {
  const searchTerm = request.query.q;
  const id = request.query.id;

  if (id) {
    return response.json(getById(id));
  }

  if (searchTerm) {
    return response.json(getByTerm(searchTerm));
  }

  return response.json(db.hackers);
});
