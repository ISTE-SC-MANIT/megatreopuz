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
import UserBase from "../entities/user";
@Resolver(UserBase)
export default class viewdata {
  @Query(returns => UserBase)
  async viewer(@Ctx() context: Context) {
    return await UserBase.findOne({ email: context.user.email });
  }
  @Query(returns => Question)
  async viewQuestion(@Ctx() context: Context) {
    console.log(
      await QuestionModel.findOne({
        questionNo: context.user.currentQuestion
      })
    );
    return await QuestionModel.findOne({
      questionNo: context.user.currentQuestion
    });
  }

  // @Query(returns => User)
  // async calculateMyRank(@Ctx() context: Context) {
  //   const user = UserModel.findOne({ email: context.user.email });

  //   const rank = await UserModel.find({
  //     lastAnsweredQuestionTime: {
  //       $lte: new Date((await user).lastAnsweredQuestionTime)
  //     },
  //     totalQuestionsAnswered: {
  //       $gt: (await UserModel.findOne({ email: context.user.email }))
  //         .totalQuestionsAnswered
  //     }
  //   });

  //   console.log(rank);

  //   console.log(Object.keys(rank).length);
  //   await UserModel.updateOne(
  //     { email: context.user.email },
  //     {
  //       $set: {
  //         rank: Object.keys(rank).length + 1
  //       }
  //     }
  //   );

  //   return await UserModel.findOne({ email: context.user.email });
  // }
}
// @Resolver(of => User)
// export class RankResolver {
//   // queries and mutations

//   async rank(@Ctx() context: Context) {
//     const user = UserModel.findOne({ email: context.user.email });

//     const rank = await UserModel.find({
//       lastAnsweredQuestionTime: {
//         $lte: new Date((await user).lastAnsweredQuestionTime)
//       },
//       totalQuestionsAnswered: {
//         $gt: (await UserModel.findOne({ email: context.user.email }))
//           .totalQuestionsAnswered
//       }
//     });

//     console.log(rank);
//   }
// }
