import UserModel, { User } from "./user";
import { Resolver, FieldResolver, Root, Int } from "type-graphql";

import "reflect-metadata";

@Resolver(of => User)
export default class UserFieldResolvers {
    @FieldResolver(returns => Int, { nullable: true })
    async rank(
        @Root("totalQuestionsAnswered")
        totalQuestionsAnswered: User["totalQuestionsAnswered"],
        @Root("lastAnsweredQuestionTime")
        lastAnsweredQuestionTime: User["lastAnsweredQuestionTime"]
    ) {
        if (!totalQuestionsAnswered) return null;
        return UserModel.countDocuments({
            $or: [
                { totalQuestionsAnswered: { $lt: totalQuestionsAnswered } },
                {
                    totalQuestionsAnswered: { $eq: totalQuestionsAnswered },
                    lastAnsweredQuestionTime: {
                        $gte: lastAnsweredQuestionTime
                    }
                }
            ]
        });
    }
}
