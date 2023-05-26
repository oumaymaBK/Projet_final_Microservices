const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const agencyProtoPath = 'agency.proto';
const agencyProtoDefinition = protoLoader.loadSync(agencyProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const agencyProto = grpc.loadPackageDefinition(agencyProtoDefinition).agency;

const agencyService = {
  getAgency: (call, callback) => {
    const agency = {
      id: call.request.agency_id,
      title: 'Example Agency',
      description: 'This is an example agency.',
    };
    callback(null, { agency });
  },
  searchAgencies: (call, callback) => {
    const { query } = call.request;
    const agencies = [
      {
        id: '1',
        title: 'TunisieBooking',
        description: 'Book your flight right now.',
      },
      {
        id: '2',
        title: 'Tarif Agency',
        description: 'The best prices you can get.',
      },
      {
        id: '3',
        title: 'Tunisia Agency',
        description: 'One of the best.',
      },
      {
        id: '4',
        title: 'TravelToDo Agency',
        description: 'Cheapest prices.',
      },
    ];
    callback(null, { agencies });
  },
  createAgency: (call, callback) => {
    const agency = {
      id: call.request.agency_id,
      title: call.request.title,
      description: call.request.description,
    };
    callback(null, { agency });
  }
};

const server = new grpc.Server();
server.addService(agencyProto.AgencyService.service, agencyService);
const port = 50051;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) {
    console.error('Failed to bind server:', err);
    return;
  }
  console.log(`Server is running on port ${port}`);
  server.start();
});
console.log(`Agency microservice running on port ${port}`);
