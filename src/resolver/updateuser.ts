import { Context } from "./../index";
import UserModel, { User } from "./../entities/user";
import QuestionModel, { Question } from "../entities/question";
import AnswerModel, { Answer } from "./../entities/answer";
import ConeteststateModel, {
  Conteststate,
  NotificationPayload
} from "./../entities/conteststate";
import { UserInput } from "../resolver/input/updateinput";
import { QuestionInput } from "../resolver/input/questioninput";
import { AnswerInput } from "../resolver/input/answerinput";

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
  async updateUser(
    @Arg("UserInfo") UserInput: UserInput,
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
  async createQuestion(
    @Arg("QuestionInfo") questionInput: QuestionInput,
    @Ctx() context: Context
  ) {
    const question = new QuestionModel({
      QuestionNo: questionInput.questionNo,
      Description: questionInput.description,
      Answer: questionInput.answer,
      ImgUrl: questionInput.imgUrl
    });

    return question.save().then(result => {
      return result;
    });
  }
  @Mutation(returns => Conteststate)
  async createConteststate() {
    const conteststate = new ConeteststateModel({
      stateinfo: true
    });

    return conteststate.save().then(result => {
      return result;
    });
  }

  // @Mutation(returns => Conteststate)
  // async PubSubMutation(
  //   @PubSub() pubSub: PubSubEngine,
  //   @Arg("CurrentState") currentstate: string
  // ) {
  //   const payload: NotificationPayload = {
  //     stateinfo: "Megatreopuz 2020",
  //     currentstate
  //   };
  //   await pubSub.publish("NOTIFICATIONS", payload);

  //   const updatedstate = await ConeteststateModel.updateOne(
  //     { stateinfo: "Megatreopuz 2020" },
  //     {
  //       $set: {
  //         currentstate: currentstate
  //       }
  //     }
  //   );
  //   return await ConeteststateModel.findOne({
  //     stateinfo: "Megatreopuz 2020"
  //   });
  // }

  @Subscription({ topics: "NOTIFICATIONS" })
  stateChangeSubscription(
    @Root() { stateInfo }: NotificationPayload
  ): Conteststate {
    console.log("its here");
    return { stateInfo };
  }

  @Mutation(returns => Conteststate)
  async changeContestState(
    @Arg("StateInfo") stateInput: ConteststateInput,
    @PubSub() pubSub: PubSubEngine
  ) {
    await ConeteststateModel.updateOne(
      { _id: "5e3309dc60385c117868b158" },
      {
        $set: {
          stateinfo: stateInput.stateInfo
        }
      }
    );
    return ConeteststateModel.findOne({
      _id: "5e3309dc60385c117868b158"
    });
  }
  @Mutation(returns => Answer)
  async answerQuestion(
    @Arg("AnswerInfo") answerInput: AnswerInput,
    @Ctx() context: Context
  ) {
    const answer = new AnswerModel({
      questionNo: context.user.currentQuestion,
      answer: answerInput.answer,
      userId: context.user.id
    });

    const userquestion = QuestionModel.findOne({
      questionNo: context.user.currentQuestion
    });

    console.log((await userquestion).answer);
    if ((await userquestion).answer == answerInput.answer) {
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
      UserModel.findOneAndUpdate(
        { email: context.user.email },
        {
          totalQuestionsAnswered: context.user.totalQuestionsAnswered + 1,
          lastAnsweredQuestion: context.user.currentQuestion - 1,
          lastAnsweredQuestionTime: new Date()
        },
        function(err, data) {
          if (data) {
            console.log(data);
          } else {
            console.log(err);
          }
        }
      );
      console.log("right answer");
      answer.message = "Correct answer";
      await UserModel.updateOne(
        { email: context.user.email },
        {
          $set: {
            currentQuestion: context.user.currentQuestion + 1
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
