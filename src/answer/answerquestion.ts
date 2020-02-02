import { Context } from "../index";

import "reflect-metadata";
import { Resolver, Arg, Ctx, Mutation, Authorized } from "type-graphql";
import { Answer } from "./answer";
import UserModel, { User } from "../user/user";
import QuestionModel, { Question } from "../question/question";

@Resolver()
export default class AnswerMutation {
  @Mutation(returns => Boolean)
  @Authorized("USER")
  async answerQuestion(
    @Ctx() context: Context,
    @Arg("Answer") Answer?: string
  ) {
    const user = UserModel.findOne({
      email: context.user.email
    });
    let currentQuestion = QuestionModel.find({
      questionNo: { $gt: (await user).lastAnsweredQuestion }
    })
      .sort({ questionNo: 1 })
      .limit(1);
    if ((currentQuestion[0].answer = Answer)) {
      UserModel.updateOne(
        { email: context.user.email },
        {
          $set: {
            //TODO: condition
            lastAnsweredQuestion: currentQuestion[0].questionNO,
            lastAnsweredQuestionTime: new Date(),
            totalQuestionsAnswered: (await user).totalQuestionsAnswered + 1
          }
        },
        {
          new: true
        }
      ).catch(err => {
        console.log(err);
      });
    }

    return true;
  }
}
