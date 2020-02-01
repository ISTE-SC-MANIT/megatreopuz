import UserModel, { User } from "../user/user";
import { Resolver, FieldResolver, Root, Int, ResolverInterface } from "type-graphql";

import "reflect-metadata";

@Resolver(of => User)
export default class UserFieldResolvers{
    @FieldResolver(type => Int, { nullable: true })
    async lastAnswerTime(
        @Root("lastAnsweredQuestion")
        lastAnsweredQuestion: User["lastAnsweredQuestion"],
        @Root("lastAnsweredQuestionTime")
        lastAnsweredQuestionTime: User["lastAnsweredQuestionTime"]
    ) {
        if (!lastAnsweredQuestion || !lastAnsweredQuestionTime) return null;
        return lastAnsweredQuestionTime.getTime();
    }

    @FieldResolver(returns => Int, { nullable: true })
    async rank(
        @Root("totalQuestionsAnswered")
        totalQuestionsAnswered: User["totalQuestionsAnswered"],
        @Root("lastAnsweredQuestionTime")
        lastAnsweredQuestionTime: User["lastAnsweredQuestionTime"]
    ) {
        if (!totalQuestionsAnswered) return null;
        return UserModel.count({
            lastAnsweredQuestion: { $ne: 0 },
            $or: [
                { totalQuestionsAnswered: { $lt: totalQuestionsAnswered } },
                {
                    totalQuestionsAnswered: { $eq: totalQuestionsAnswered },
                    lastAnsweredQuestionTime: {
                        $gt: { lastAnsweredQuestionTime }
                    }
                }
            ]
        });
    }
}
