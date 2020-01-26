import { Context } from "./../index";
import UserModel, { User } from "./../entities/user";
import QuestionModel, { Question } from "../entities/question";
import AnswerModel, { Answer } from "./../entities/answer";
import { userInput } from "../resolver/input/updateinput";
import { QuestionInput } from "../resolver/input/questioninput";
import { AnswerInput } from "../resolver/input/answerinput";

import "reflect-metadata";
import { Resolver, Arg, Ctx, Mutation } from "type-graphql";

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

    if (
      UserInput.collge &&
      UserInput.country &&
      UserInput.phone &&
      UserInput.year
    ) {
      UserModel.updateOne(
        { email: context.user.email },
        {
          $set: {
            college: UserInput.collge,
            year: UserInput.year,
            country: UserInput.country,
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
    if (UserInput.collge && UserInput.country && UserInput.phone) {
      UserModel.updateOne(
        { email: context.user.email },
        {
          $set: {
            college: UserInput.collge,
            year: UserInput.year,
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
    if (UserInput.collge && UserInput.country) {
      UserModel.updateOne(
        { email: context.user.email },
        {
          $set: {
            college: UserInput.collge,

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
    console.log((await userquestion).answer);
    if ((await userquestion).answer == answerInput.answer) {
      return answer.save().then(() => {
        return UserModel.updateOne(
          { email: context.user.email },
          {
            $set: {
              currentquestion: context.user.currentquestion + 1
            }
          }
        );
      });
    } else {
      console.log("wrong answer");
    }
  }
}
