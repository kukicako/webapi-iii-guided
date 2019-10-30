const express = require('express'); // importing a CommonJS module
const helmet = require('helmet');
const hubsRouter = require('./hubs/hubs-router.js');
const morgan = require('morgan')


const server = express();

function dateLogger(req, res, next) {
  console.log(new Date().toISOString());

  next()
}

function gitLogger(req, res, next) {
  console.log(` ${req.method} to ${req.url}`)

  next()
}

function gateKeeper(req, res, next){
  const password = req.headers.password || '';

  if(password.toLowerCase() === ' mellon '){
    next();
  } else{
    res.status(400).json({ you: 'cannot pass'})
  }
  if(password === ''){
    next();
  } else {
    res.status(401).json({you:'did not enter a password'})
  }
}

//global middleware
server.use(helmet());
server.use(express.json());
server.use(gateKeeper);
server.use(dateLogger);
server.use(gitLogger);
server.use(morgan('dev'));

server.use('/api/hubs', hubsRouter);


server.get('/', (req, res) => {
  const nameInsert = (req.name) ? ` ${req.name}` : '';

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
    `);
});

module.exports = server;
