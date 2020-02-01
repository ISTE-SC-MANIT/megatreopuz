import { Context } from "../index";
import QuestionModel, { Question } from "./question";
import UserModel from "../user/user";
import "reflect-metadata";
import { Resolver, Query, Ctx, Authorized } from "type-graphql";

@Resolver()
export default class QueryClass {
    @Query(returns => Question, { nullable: true })
    @Authorized("USER")
    async nextQuestion(@Ctx() context: Context) {
        const { lastAnsweredQuestion } = await UserModel.findOne({
            email: context.user.email
        });
        return await QuestionModel.find({
            questionNo: { $gt: lastAnsweredQuestion }
        })
            .sort({ questionNo: 1 })
            .limit(1);
    }
}
