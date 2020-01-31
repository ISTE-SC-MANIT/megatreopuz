import { Context } from "./../index";
import UserModel, { User } from "./../entities/user";
import QuestionModel, { Question } from "./../entities/question";

import "reflect-metadata";
import {
  Resolver,
  Query,
  Arg,
  Root,
  ResolverInterface,
  Ctx,
  Args,
  Mutation
} from "type-graphql";
@Resolver(User)
export default class viewdata {
  @Query(returns => User)
  async Viewer(@Ctx() context: Context) {
    return await UserModel.findOne({ email: context.user.email });
  }
  @Query(returns => Question)
  async ViewQuestion(@Ctx() context: Context) {
    console.log(
      await QuestionModel.findOne({
        questionno: context.user.currentquestion
      })
    );
    return await QuestionModel.findOne({
      questionno: context.user.currentquestion
    });
  }

  @Query(returns => [User])
  async leaderboard(@Ctx() context: Context): Promise<User[]> {
    const user = UserModel.findOne({ email: context.user.email });

    return await UserModel.find({}).sort({ currentquestion: -1 });
  }

  @Query(returns => User)
  async CalculateMyRank(@Ctx() context: Context) {
    const user = UserModel.findOne({ email: context.user.email });

    const rank = await UserModel.aggregate([
      {
        $match: {
          $and: [
            {
              LastAnsweredQuestion: { $gt: (await user).LastAnsweredQuestion }
            },
            {
              LastAnsweredQuestionTime: {
                $lt: new Date((await user).LastAnsweredQuestionTime)
              }
            }
          ]
        }
      }
    ]);
    console.log(Object.keys(rank).length);
    await UserModel.updateOne(
      { email: context.user.email },
      {
        $set: {
          Rank: Object.keys(rank).length + 1
        }
      }
    );

    return await UserModel.findOne({ email: context.user.email });
  }
}
