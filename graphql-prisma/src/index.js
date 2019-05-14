import '@babel/polyfill/noConflict'
import server from './server'

server.start({ port: process.env.PORT || 4000 }, () => {
  global.console.log('The server is up!')
})
