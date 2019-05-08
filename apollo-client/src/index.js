import ApolloBoost, { gql } from 'apollo-boost'

const client = new ApolloBoost({
  uri: 'http://localhost:4000'
})

const getUsers = gql`
  query {
    users {
      name
    }
  }
`

const getPosts = gql`
  query {
    posts {
      title
      author {
        name
      }
    }
  }
`

client.query({
  query: getUsers
}).then(response => {
  const html = response.data.users.reduce((html, user) => {
    return html += `
      <div>
        <h3>${user.name}</h3>
      </div>
    `
  }, '')
  document.getElementById('users').innerHTML = html
})

client.query({
  query: getPosts
}).then(response => {
  const html = response.data.posts.reduce((html, post) => {
    return html += `
      <div>
        <h3>Title: ${post.title}</h3>
        <p>Author: ${post.author.name}</p>
      </div>
    `
  }, '')
  document.getElementById('posts').innerHTML = html
})