const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const agencyProtoPath = 'agency.proto';
const clientProtoPath = 'client.proto';
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
const clientAgencies = new agencyProto.AgencyService('localhost:50051', grpc.credentials.createInsecure());
const clientClients = new clientProto.ClientService('localhost:50052', grpc.credentials.createInsecure());

const resolvers = {
  Query: {
    agency: (_, { id }) => {
      return new Promise((resolve, reject) => {
        clientAgencies.getAgency({ agencyId: id }, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.agency);
          }
        });
      });
    },
    agencies: () => {
      return new Promise((resolve, reject) => {
        clientAgencies.searchAgencies({}, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.agencies);
          }
        });
      });
    },
    client: (_, { id }) => {
      return new Promise((resolve, reject) => {
        clientClients.getClient({ clientId: id }, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.client);
          }
        });
      });
    },
    clients: () => {
      return new Promise((resolve, reject) => {
        clientClients.searchClients({}, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.clients);
          }
        });
      });
    },
  },
  Mutation: {
    createAgency: (_, { id, title, description }) => {
      return new Promise((resolve, reject) => {
        clientAgencies.createAgency({ agencyId: id, title: title, description: description }, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.agency);
          }
        });
      });
    },
  },
};

module.exports = resolvers;
