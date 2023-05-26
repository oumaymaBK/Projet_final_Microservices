const { gql } = require('@apollo/server');

const typeDefs = `#graphql
  type Agency {
    id: String!
    title: String!
    description: String!
  }

  type Client {
    id: String!
    title: String!
    description: String!
  }

  type Query {
    agency(id: String!): Agency
    agencies: [Agency]
    client(id: String!): Client
    clients: [Client]
  }

  type Mutation {
    createAgency(id: String!, title: String!, description: String!): Agency
  }
`;

module.exports = typeDefs;
