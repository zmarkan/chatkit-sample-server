const express = require("express");
const bodyParser = require("body-parser");
const Chatkit = require("@pusher/chatkit-server");
const AuthenticationClient = require("auth0").AuthenticationClient;

const app = express();
const port = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const auth0 = new AuthenticationClient({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET
});

const chatkit = new Chatkit.default({
  instanceLocator: process.env.CHATKIT_INSTANCE_LOCATOR,
  key: process.env.CHATKIT_KEY
});

app.get("/", (req, res) => {
  res.send("I am a silly server.");
});

app.post("/token", async (req, res) => {
  try {
    const { token, user_id } = req.query;
    const userId = user_id;
    const accessToken = token;

    const auth0Profile = await auth0.getProfile(accessToken);
    if (auth0Profile.email != userId) {
      console.log("Auth0 profile doesn't match provided ID");

      res.status(401).send("Auth0 profile doesn't match provided ID");
    }

    const authData = chatkit.authenticate({ userId: userId });
    console.log("authData thing");
    console.log(authData);
    res.status(authData.status).send(authData.body);
  } catch (e) {
    console.log(e);
    res.send(400, e);
  }
});

//Don't remove this - this is a webhook that allows us to push to github and refresh the project in Glitch.
app.post("/deployhook", (req, res) => {
  if (req.query.secret === process.env.secret) {
    const exec = require("child_process").exec;
    exec("git pull; refresh", (error, stdout) => {
      console.log(error);
      console.log(stdout);
    });
    res.send();
  } else {
    res.sendStatus(401);
  }
});

app.listen(port, () => {
  console.log(`Listening on: ${port}`);
});
