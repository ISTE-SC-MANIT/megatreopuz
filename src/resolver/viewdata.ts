import { Context } from "./../index";
import UserModel, { User } from "./../entities/user";
import QuestionModel, { Question } from "./../entities/question";

import "reflect-metadata";
import {
  Resolver,
  Query,
  FieldResolver,
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
  async viewer(@Ctx() context: Context) {
    return await UserModel.findOne({ email: context.user.email });
  }
  @Query(returns => Question)
  async viewquestion(@Ctx() context: Context) {
    console.log(
      await QuestionModel.findOne({
        questionno: context.user.currentquestion
      })
    );
    return await QuestionModel.findOne({
      questionno: context.user.currentquestion
    });
  }
  @Query(returns => [User!]!)
  async leaderboard(@Ctx() context: Context) {
    console.log(await await UserModel.find().sort({ currentquestion: -1 }));
    return await UserModel.find()
      .then(users => {
        // return users.map(user => {
        //   return { user };
        // });
      })
      .catch(err => {
        throw err;
      });
  }
  @Query(returns => [User])
  async recipes(): Promise<User[]> {
    return await UserModel.find({}).sort({ currentquestion: -1 });
  }
}
