import express from "express";
import env from "dotenv";
import mongoose from "mongoose";
import { OAuth2Client } from "google-auth-library";
import { SubscriptionServer } from "subscriptions-transport-ws";
import User, { User as UserClass } from "./user/user";
import graphqlHttp from "express-graphql";
import { buildSchema } from "type-graphql";
import UserQuery from "./user/query";
import { execute, subscribe } from "graphql";
import UserMutation from "./user/mutation";
import QuestionMutation from "./question/mutation";
import expressPlayground from "graphql-playground-middleware-express";
import uuid from "uuid/v4";
import cors from "cors";
import { authorizationLevel } from "./auth";
import UserFieldResolvers from "./user/userFields";
import QuestionQuery from "./question/query";
import StateQuery from "./state/query";
import StateMutation from "./state/mutation";
import StateSubscription from "./state/subscription";
import { createServer } from "http";
import UserSubscription from "./user/subscription";
env.config();

const app = express();
// TODO: Restrict to istemanit.in
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
    body: { email }
  } = req;
  if (!email) {
    res.sendStatus(400);
    return;
  }
  const user = await User.findOne({ email: email });
  if (user) {
    res.json({ exists: true });
  } else {
    res.json({ exists: false });
  }
});

app.post("/authenticateWithToken", express.json(), async (req, res) => {
  const {
    body: { token }
  } = req;
  if (!token) {
    res.sendStatus(400);
    return;
  }
  try {
    const u = await getProfileFromGoogle(token);

    const user = await User.findOne({ email: u.email });
    if (user) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
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

  try {
    const profile = await getProfileFromGoogle(token);
    if (!profile || !profile.email) {
      res.sendStatus(401);
      return;
    }
    await new User({
      _id: uuid(),
      userName: username,
      name: profile.name,
      email: profile.email,
      phone: phone,
      college: college,
      year: year,
      country: country,
      admin: false,
      currentQuestion: 1,
      totalQuestionsAnswered: 0,
      lastAnsweredQuestion: 0,
      lastAnsweredQuestionTime: "2020-02-01T16:42:50.859Z"
    })
      .save()
      .then(newUser => {
        res.sendStatus(201);
      });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
    return;
  }
});

const schema = buildSchema({
  validate: false,
  resolvers: [
    UserQuery,
    UserFieldResolvers,
    UserMutation,
    UserSubscription,
    QuestionQuery,
    QuestionMutation,
    StateQuery,
    StateMutation,
    StateSubscription
  ],
  dateScalarMode: "timestamp",
  authChecker: authorizationLevel
});

export interface Context {
  user?: UserClass;
}

app.use("/graphql", async (req, res, next) => {
  const token = req.get("authorization");
  let user: UserClass | null = null;
  if (token) {
    try {
      const u = await getProfileFromGoogle(token);
      if (!u) {
        res.sendStatus(400);
        return null;
      }
      user = await User.findOne({ email: u.email });
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
      return null;
    }
  }
  const resolvedSchema = await schema;
  return graphqlHttp({
    schema: resolvedSchema,
    context: {
      user
    }
  })(req, res);
});

app.get(
  "/playground",
  expressPlayground({
    endpoint: "/graphql",
    subscriptionEndpoint: "/subscriptions"
  })
);

const server = createServer(app);
mongoose
  .connect(
    "mongodb+srv://Devansh:Devansh@cluster0-ixpyc.mongodb.net/beta?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    }
  )
  .then(() =>
    server.listen(process.env.PORT || 8000, async () => {
      const resolvedSchema = await schema;
      new SubscriptionServer(
        {
          execute,
          subscribe,
          schema: resolvedSchema
        },
        {
          server,
          path: "/subscriptions"
        }
      );
      console.log(`listening on port ${process.env.PORT || 8000}`);
    })
  )
  .catch(error => {
    console.error(error);
  });
