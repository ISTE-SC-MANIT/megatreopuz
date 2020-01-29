import { Context } from "./../index";
import UserModel, { User } from "./../entities/user";
import QuestionModel, { Question } from "../entities/question";
import AnswerModel, { Answer } from "./../entities/answer";
import ConeteststateModel, {
  Conteststate,
  NotificationPayload
} from "./../entities/conteststate";
import { userInput } from "../resolver/input/updateinput";
import { QuestionInput } from "../resolver/input/questioninput";
import { AnswerInput } from "../resolver/input/answerinput";
import { Notification } from "./subscription/notification";

import "reflect-metadata";
import {
  Resolver,
  Arg,
  Ctx,
  Mutation,
  PubSub,
  PubSubEngine,
  Subscription,
  Root,
  Args
} from "type-graphql";
import { ConteststateInput } from "./input/conteststateinput";

@Resolver(User)
export default class updateuser {
  @Mutation(returns => User)
  async updateuser(
    @Arg("userinfo") UserInput: userInput,
    @Ctx() context: Context
  ) {
    // find the recipe
    const currrentuser = await UserModel.findOne({ email: context.user.email });
    if (!currrentuser) {
      throw new Error("Invalid User");
    }

    // set the new recipe rate

    if (UserInput.collge) {
      UserModel.updateOne(
        { email: context.user.email },
        {
          $set: {
            college: UserInput.collge
          }
        },
        {
          new: true
        }
      ).catch(err => {
        console.log(err);
      });
    }
    if (UserInput.year) {
      UserModel.updateOne(
        { email: context.user.email },
        {
          $set: {
            year: UserInput.year
          }
        },
        {
          new: true
        }
      ).catch(err => {
        console.log(err);
      });
    }
    if (UserInput.phone) {
      UserModel.updateOne(
        { email: context.user.email },
        {
          $set: {
            phone: UserInput.phone
          }
        },
        {
          new: true
        }
      ).catch(err => {
        console.log(err);
      });
    }
    if (UserInput.country) {
      UserModel.updateOne(
        { email: context.user.email },
        {
          $set: {
            country: UserInput.country
          }
        },
        {
          new: true
        }
      ).catch(err => {
        console.log(err);
      });
    }
    return await UserModel.findOne({ email: context.user.email });
  }

  @Mutation(returns => Question)
  async createquestion(
    @Arg("questioninfo") questionInput: QuestionInput,
    @Ctx() context: Context
  ) {
    const question = new QuestionModel({
      questionno: questionInput.questionno,
      description: questionInput.description,
      answer: questionInput.answer,
      imgurl: questionInput.imgurl
    });

    return question.save().then(result => {
      return result;
    });
  }
  @Mutation(returns => Conteststate)
  async createconteststate() {
    const conteststate = new ConeteststateModel({
      stateinfo: "Megatreopuz 2020",
      currentstate: "will start soon"
    });

    return conteststate.save().then(result => {
      return result;
    });
  }
  // @Subscription({
  //   topics: "NOTIFICATIONS",
  //   filter: ({ payload, args }) => args.priorities.includes(payload.priority)
  // })
  // newNotification(
  //   @Root() notificationPayload: NotificationPayload
  // ): Notification {
  //   return {
  //     ...notificationPayload,
  //     date: new Date()
  //   };
  // }
  @Mutation(returns => Conteststate)
  async pubSubMutation(
    @PubSub() pubSub: PubSubEngine,
    @Arg("currentstate") currentstate: string
  ) {
    const payload: NotificationPayload = {
      stateinfo: "Megatreopuz 2020",
      currentstate
    };
    await pubSub.publish("NOTIFICATIONS", payload);

    const updatedstate = await ConeteststateModel.updateOne(
      { stateinfo: "Megatreopuz 2020" },
      {
        $set: {
          currentstate: currentstate
        }
      }
    );
    return await ConeteststateModel.findOne({
      stateinfo: "Megatreopuz 2020"
    });
  }

  @Subscription({ topics: "NOTIFICATIONS" })
  normalSubscription(
    @Root() { stateinfo, currentstate }: NotificationPayload
  ): Conteststate {
    console.log("its here");
    return { stateinfo, currentstate };
  }

  @Mutation(returns => Conteststate)
  async changeconteststate(
    @Arg("stateinfo") stateInput: ConteststateInput,
    @PubSub() pubSub: PubSubEngine
  ) {
    // here we can trigger subscriptions topics
    // const payload: NotificationPayload = {
    //   id: 2,
    //   message: stateInput.conteststate
    // };
    // console.log(pay)
    //await pubSub.publish("NOTIFICATIONS", payload);

    return await ConeteststateModel.updateOne(
      { stateinfo: "Megatreopuz 2020" },
      {
        $set: {
          currentstate: stateInput.conteststate
        }
      }
    );
  }
  @Mutation(returns => Answer)
  async answerquestion(
    @Arg("answerinfo") answerInput: AnswerInput,
    @Ctx() context: Context
  ) {
    const answer = new AnswerModel({
      questionno: context.user.currentquestion,
      answer: answerInput.answer,
      userid: context.user.id
    });

    const userquestion = QuestionModel.findOne({
      questionno: context.user.currentquestion
    });

    UserModel.findOneAndUpdate(
      { email: context.user.email },
      {
        $push: {
          ratings: {
            $each: [
              {
                _id: (await userquestion)._id
              }
            ]
          }
        }
      },
      function(err, data) {
        if (data) {
          console.log(data);
        } else {
          console.log(err);
        }
      }
    );

    console.log((await userquestion).answer);
    if ((await userquestion).answer == answerInput.answer) {
      console.log("right answer");
      answer.message = "Correct answer";
      await UserModel.updateOne(
        { email: context.user.email },
        {
          $set: {
            currentquestion: context.user.currentquestion + 1
          }
        }
      );

      const a = answer.save().then(result => {
        console.log(result + " this is coorect answer");
      });
    } else {
      answer.message = "Wrong answer, Try again";
    }
    console.log(answer);
    return answer;
  }
}
