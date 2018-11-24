import {
  GraphQLServer
} from 'graphql-yoga';
import uuidv4 from 'uuid/v4'

let users = [{
    id: '1',
    name: 'Andrew',
    email: 'andrew@example.com',
    age: 27,
  },
  {
    id: '2',
    name: 'Sarah',
    email: 'sarah@example.com',
  },
  {
    id: '3',
    name: 'Mike',
    email: 'mike@example.com',
  },
];

let posts = [{
    id: '10',
    title: 'GraphQL 101',
    body: 'This is how to use GraphQL...',
    published: true,
    author: '1',
  },
  {
    id: '11',
    title: 'GraphQL 201',
    body: 'This is an advanced GraphQL post...',
    published: false,
    author: '1',
  },
  {
    id: '12',
    title: 'Programming Music',
    body: '',
    published: false,
    author: '2',
  },
];

let comments = [{
    id: '101',
    text: 'This is first comment.',
    author: '3',
    post: '10',
  },
  {
    id: '102',
    text: 'Now, Coding a GraphQL.',
    author: '3',
    post: '10',
  },
  {
    id: '103',
    text: 'This post is my favorite comment.',
    author: '1',
    post: '11',
  },
  {
    id: '104',
    text: 'I am tired',
    author: '2',
    post: '12',
  },
];

// Type definitions (schema)
const typeDefs = `
  type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    comments(query: String): [Comment!]!
    me: User!
    post: Post!
  }

  type Mutation {
    createUser(data: createUserInput!): User!
    deleteUser(id: ID!): User!
    createPost(data: createPostInput!): Post!
    deletePost(id: ID!): Post!
    createComment(data: createComment!): Comment!
    deleteComment(id: ID!): Comment!
  }

  input createUserInput {
    name: String!
    email: String!
    age: Int
  }

  input createPostInput {
    title: String!
    body: String!
    published: Boolean
    author: ID!
  }

  input createComment {
    text: String!
    author: ID!
    post: ID!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    users(parent, args, ctx, info) {
      if (!args.query) {
        return users;
      }

      return users.filter((user) => {
        return user.name.toLowerCase().includes(args.query.toLowerCase());
      });
    },
    posts(parent, args, ctx, info) {
      if (!args.query) {
        return posts;
      }

      return posts.filter((post) => {
        const isTitleMatch = post.title
          .toLowerCase()
          .includes(args.query.toLowerCase());
        const isBodyMatch = post.body
          .toLowerCase()
          .includes(args.query.toLowerCase());
        return isTitleMatch || isBodyMatch;
      });
    },
    comments(parent, args, ctx, info) {
      if (!args.query) {
        return comments;
      }

      return comments.filter((comment) => {
        return comment.text.toLowerCase().includes(args.query.toLowerCase());
      });
    },
    me() {
      return {
        id: '123098',
        name: 'Mike',
        email: 'mike@example.com',
      };
    },
    post() {
      return {
        id: '092',
        title: 'GraphQL 101',
        body: '',
        published: false,
      };
    },
  },
  Mutation: {
    createUser(parent, args, ctx, info) {
      const { data } = args
      const emailTaken = users.some(user => user.email === data.email)
      if (emailTaken) throw new Error('Email taken.')
      const user = {
        id: uuidv4(),
        ...data
      }
      users.push(user)
      return user
    },
    deleteUser(parent, args, ctx, info) {
      const userIndex = users.findIndex(user => user.id === args.id)
      if (userIndex === -1) throw new Error('User not found')
      posts = posts.filter(post => {
        const match = post.author === args.id
        if (match) {
          comments = comments.filter(comment => comment.post !== post.id)
        }
        return !match
      })
      comments = comments.filter(comment => comment.authot !== args.id)
      const deletedUsers = users.splice(userIndex, 1)
      return deletedUsers[0]
    },
    createPost(parent, args, ctx, info) {
      const { data } = args
      const userExists = users.some(user => user.id === data.author)
      if (!userExists) throw new Error('User not found')
      const post = {
        id: uuidv4(),
        ...data
      }
      posts.push(post)
      return post
    },
    deletePost(parent, args, ctx, info) {
      const postIndex = posts.findIndex(post => post.id === args.id)
      if (postIndex === -1) throw new Error('Post not found')
      comments = comments.filter(comment => comment.post !== args.id)
      const deletedPosts = posts.splice(postIndex, 1)
      return deletedPosts[0]
    },
    createComment(parent, args, ctx, info) {
      const { data } = args
      const userExists = users.some(user => user.id === data.author)
      if (!userExists) throw new Error('User not found')
      const postExists = posts.some(post => post.id === data.post)
      if (!postExists) throw new Error('Post not found')
      const published = posts.some(post => post.id === data.post && post.published)
      if (!published) throw new Error('Post not published')

      const comment = {
        id: uuidv4(),
        ...data
      }
      comments.push(comment)
      return comment
    },
    deleteComment(parent, args, ctx, info) {
      const commentIndex = comments.findIndex(comment => comment.id === args.id)
      if (commentIndex === -1) throw new Error('Comment not found')
      const deletedComments = comments.splice(commentIndex, 1)
      return deletedComments[0]
    }
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author;
      });
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => {
        return comment.post === parent.id;
      });
    },
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter((post) => {
        return post.author === parent.id;
      });
    },
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author;
      });
    },
    post(parent, args, ctx, info) {
      return posts.find((post) => {
        return post.id === parent.post;
      });
    },
  },
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

server.start(() => {
  console.log('The server is up!');
});