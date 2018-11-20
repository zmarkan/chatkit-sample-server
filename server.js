//Auth0 sample

const express = require("express")
const bodyParser = require("body-parser")
const fetch = require("node-fetch")
const Chatkit = require("@pusher/chatkit-server")
const AuthenticationClient = require("auth0").AuthenticationClient

const app = express()
const port = process.env.PORT || 4000

app.use(bodyParser.json())

const auth0 = new AuthenticationClient({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET
})

const chatkit = new Chatkit.default({
  instanceLocator: process.env.CHATKIT_INSTANCE_LOCATOR,
  key: process.env.CHATKIT_KEY
})

app.post("/echo", (req, res) => {
  res.send(req.body)
});

app.get("/", (req, res) => {
  res.send("I am a silly server.")
})

app.listen(port, () => {console.log(`Listening on: ${port}`) })
