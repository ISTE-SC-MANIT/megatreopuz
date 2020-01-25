import express from "express";
import env from "dotenv";
import mongoose from "mongoose";
import { OAuth2Client } from "google-auth-library";
import User from "./models/users";
import graphqlHttp from "express-graphql";
import { buildSchema, emitSchemaDefinitionFile } from "type-graphql";
import viewdata from "./resolver/viewdata";
import expressPlayground from "graphql-playground-middleware-express";

env.config();

const app = express();

app.use("/static", express.static("static"));

async function getProfileFromGoogle(token: string) {
  const client = new OAuth2Client(
    `65422568192-gsadmvg60atvtnpqvs3t0r43f213sgme.apps.googleusercontent.com`
  );

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: `65422568192-gsadmvg60atvtnpqvs3t0r43f213sgme.apps.googleusercontent.com`
  });
  return ticket.getPayload();
}

app.post("/authenticate", express.json(), async (req, res) => {
  const {
    body: { authentication: token }
  } = req;
  const client = new OAuth2Client(
    `65422568192-gsadmvg60atvtnpqvs3t0r43f213sgme.apps.googleusercontent.com`
  );

  const profile = await getProfileFromGoogle(token);
  //console.log(profile.email);
  User.findOne({ email: profile.email }).then(cureentUser => {
    console.log(cureentUser);
  });

  if (!profile || !profile.email) return;

  const user = await User.findOne({ email: profile.email });
  //console.log(profile.name);
  if (user) {
    res.json({ exists: true });
  } else {
    res.json({ exists: false });
    // new User({
    //   username: profile.name,
    //   email: profile.email
    // })
    //   .save()
    //   .then(newUser => {
    //     console.log("new user created" + newUser);
    //   });
  }
});

app.use(express.json({ limit: "20mb" }));
app.post("/signUp", express.json(), async (req, res) => {
  const {
    body: { token, college, year, phone, country }
  } = req;
  // console.log(req.body);

  // 400, bad request
  if (!token || !college || !year || !phone || !country) {
    console.log("1st check");
    res.sendStatus(400);

    return;
  }

  const profile = await getProfileFromGoogle(token);

  if (!profile || !profile.email) {
    console.log("2nd check");
    res.sendStatus(400);
    return;
  }
  console.log(profile);
  var a;
  const newuser = User.findOne({ email: profile.email }).then(cureentUser => {
    console.log(cureentUser);

    if (cureentUser) {
      // console.log(newuser);
      res.sendStatus(400);
      return;
    }

    const newUser = new User({
      username: profile.given_name,
      email: profile.email,
      college: college,
      phone: phone
    })
      .save()
      .then(newUser => {
        console.log("new user created" + newUser);
      });
  });
});

app.use("/graphql", async (req, res, next) => {
  // req - header -> authentication : token

  // const token = req.get("access_token");
  // if (!token) {
  //   res.sendStatus(401);

  //   return null;
  // }
  // console.log("got token");
  // // Check -> 1. Valid google account
  // const profile = await getProfileFromGoogle(token);
  // if (!profile) {
  //   res.sendStatus(401);
  //   return next;
  // }
  // let exists = false;
  // // Check -> 2. User exists
  // const x = User.findOne({ email: profile.email });
  // if (!x) {
  //   res.sendStatus(400);
  //   return next;
  // }
  const schema = await buildSchema({
    resolvers: [viewdata]
  });
  console.log(schema);
  return graphqlHttp({ schema });
  //return graphhttp(req res next){schema,context:user as }
});
app.get("/playground", expressPlayground({ endpoint: "/graphql" }));

mongoose
  .connect(
    "mongodb+srv://Devansh:Devansh@cluster0-ixpyc.mongodb.net/beta?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() =>
    app.listen(process.env.PORT || 3000, () =>
      console.log(`listening on port ${process.env.PORT || 3000}`)
    )
  )
  .catch(error => {
    console.error(error);
  });
