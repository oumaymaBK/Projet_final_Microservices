const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');


const clientProtoPath = 'client.proto';
const clientProtoDefinition = protoLoader.loadSync(clientProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const clientProto = grpc.loadPackageDefinition(clientProtoDefinition).client;

const clientService = {
  getClient: (call, callback) => {
    
    const client = {
      id: call.request.client_id,
      title: 'Example Client',
      description: 'This is an example client.',
    };
    callback(null, { client });
  },
  searchClients: (call, callback) => {
    const { query } = call.request;
  
    const clients = [
      {
        id: '1',
        title: ' Ahmed Ahmed',
        description: 'A loyal client.',
      },
      {
        id: '2',
        title: 'Oumayma Oumayma',
        description: 'Best selling client.',
      },
    ];
    callback(null, { clients });
  },
};

const server = new grpc.Server();
server.addService(clientProto.ClientService.service, clientService);
const port = 50052;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error('Failed to bind server:', err);
      return;
    }
  
    console.log(`Server is running on port ${port}`);
    server.start();
  });
console.log(`Client microservice running on port ${port}`);
