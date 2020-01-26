import express from "express";

import env from "dotenv";
import mongoose from "mongoose";
import { OAuth2Client } from "google-auth-library";
import User, { User as UserType } from "./entities/user";
import graphqlHttp from "express-graphql";
import { buildSchema, emitSchemaDefinitionFile } from "type-graphql";
import viewdata from "./resolver/viewdata";
import deleteuser from "./resolver/delete";
import updateuser from "./resolver/updateuser";
import expressPlayground from "graphql-playground-middleware-express";
import uuid from "uuid/v4";
import cors from "cors";
env.config();

const app = express();
app.use(cors());

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
  const profile = await getProfileFromGoogle(token);

  if (!profile || !profile.email) return;

  const user = await User.findOne({ email: profile.email });
  if (user) {
    res.json({ exists: true });
  } else {
    res.json({ exists: false });
  }
});

app.post("/signUp", express.json(), async (req, res) => {
  const {
    body: { token, college, year, phone, country, username }
  } = req;
  if (!token || !college || !year || !phone || !country || !username) {
    res.sendStatus(400);
    return;
  }

  const profile = await getProfileFromGoogle(token);

  if (!profile || !profile.email) {
    res.sendStatus(401);
    return;
  }
  const currentUser = await User.findOne({ email: profile.email });

  if (currentUser) {
    res.sendStatus(409);
    return;
  }

  await new User({
    id: uuid(),
    name: profile.given_name,
    username: username,
    email: profile.email,
    college: college,
    phone: phone,
    admin: false,
    currentquestion: 1
  })
    .save()
    .then(newUser => {
      res.sendStatus(201);
    })
    .catch(err => res.status(500).json(err));
});

const schema = buildSchema({
  resolvers: [viewdata, deleteuser, updateuser]
});

export interface Context {
  user: UserType;
}

app.use("/graphql", async (req, res, next) => {
  const token = req.get("authorization");

  if (!token) {
    res.sendStatus(401);
    return null;
  }
  const profile = await getProfileFromGoogle(token);
  if (!profile) {
    res.sendStatus(401);
    return null;
  }
  const user = await User.findOne({ email: profile.email });
  if (!user) {
    res.sendStatus(400);
    return null;
  }

  const resolvedSchema = await schema;
  return graphqlHttp({
    schema: resolvedSchema,
    context: {
      user
    }
  })(req, res);
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
