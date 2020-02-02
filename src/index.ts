import express from "express";
import env from "dotenv";
import mongoose from "mongoose";
import { OAuth2Client, TokenPayload } from "google-auth-library";
import User, { User as UserClass } from "./user/user";
import graphqlHttp from "express-graphql";
import { buildSchema } from "type-graphql";
import UserQuery from "./user/query";
import UserMutation from "./user/mutation";
import expressPlayground from "graphql-playground-middleware-express";
import uuid from "uuid/v4";
import cors from "cors";
import { authorizationLevel } from "./auth";
import UserFieldResolvers from "./resolver/userFields";
import QuestionQuery from "./question/query";
// import AnswerMutation from "./answer/answerquestion";
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
    const user = await User.findOne({ email: email });
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

    try {
        const profile = await getProfileFromGoogle(token);
        if (!profile || !profile.email) {
            res.sendStatus(401);
            return;
        }
        await new User({
            id: uuid(),
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
        QuestionQuery /* , AnswerMutation */
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

app.get("/playground", expressPlayground({ endpoint: "/graphql" }));

mongoose
    .connect(
        "mongodb+srv://Devansh:Devansh@cluster0-ixpyc.mongodb.net/beta?retryWrites=true&w=majority",
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        }
    )
    .then(() =>
        app.listen(process.env.PORT || 3000, () =>
            console.log(`listening on port ${process.env.PORT || 3000}`)
        )
    )
    .catch(error => {
        console.error(error);
    });
