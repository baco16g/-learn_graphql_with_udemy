import {
  GraphQLServer
} from 'graphql-yoga';
import path from 'path'

import * as resolvers from './resolvers'
import db from './db'

const server = new GraphQLServer({
  typeDefs: path.resolve(__dirname, './schema.graphql'),
  resolvers,
  context: {
    db
  }
});

server.start(() => {
  console.log('The server is up!');
});