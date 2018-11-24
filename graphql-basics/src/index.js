import {
  GraphQLServer,
  PubSub
} from 'graphql-yoga';
import path from 'path'

import * as resolvers from './resolvers'
import db from './db'

const pubsub = new PubSub()

const server = new GraphQLServer({
  typeDefs: path.resolve(__dirname, './schema.graphql'),
  resolvers,
  context: {
    db,
    pubsub
  }
});

server.start(() => {
  console.log('The server is up!');
});