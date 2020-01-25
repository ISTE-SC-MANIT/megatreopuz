import { Context } from "./../index";
import UserModel, { User } from "./../entities/user";
import { userInput } from "../resolver/input/updateinput";
import { QuestionInput } from "../resolver/input/questioninput";
import "reflect-metadata";
import { Resolver, Arg, Ctx, Mutation } from "type-graphql";
import QuestionModel, { Question } from "../entities/question";

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
}
