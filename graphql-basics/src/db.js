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

const db = {
  users,
  posts,
  comments
}

export default db