const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const bodyParser = require('body-parser');
const cors = require('cors');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const agencyProtoPath = 'agency.proto';
const clientProtoPath = 'client.proto';

const resolvers = require('./resolvers');
const typeDefs = require('./schema');

const app = express();
app.use(bodyParser.json());

const agencyProtoDefinition = protoLoader.loadSync(agencyProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const clientProtoDefinition = protoLoader.loadSync(clientProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const agencyProto = grpc.loadPackageDefinition(agencyProtoDefinition).agency;
const clientProto = grpc.loadPackageDefinition(clientProtoDefinition).client;

const clientAgencies = new agencyProto.AgencyService(
  'localhost:50051',
  grpc.credentials.createInsecure()
);
const clientClients = new clientProto.ClientService(
  'localhost:50052',
  grpc.credentials.createInsecure()
);

const server = new ApolloServer({ typeDefs, resolvers });

server.start().then(() => {
  app.use(cors(), bodyParser.json(), expressMiddleware(server));
});

app.get('/agencies', (req, res) => {
  clientAgencies.searchAgencies({}, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.agencies);
    }
  });
});

app.post('/agency', (req, res) => {
  const { id, name, description } = req.body;
  clientAgencies.createAgency(
    { agency_id: id, name: name, description: description },
    (err, response) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(response.agency);
      }
    }
  );
});

app.get('/agencies/:id', (req, res) => {
  const id = req.params.id;
  clientAgencies.getAgency({ agencyId: id }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.agency);
    }
  });
});

app.get('/clients', (req, res) => {
  clientClients.searchClients({}, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.clients);
    }
  });
});

app.get('/clients/:id', (req, res) => {
  const id = req.params.id;
  clientClients.getClient({ clientId: id }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.client);
    }
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`API Gateway running on port ${port}`);
});
