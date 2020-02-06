import UserModel, { User, Rank } from "./user";
import { Resolver, FieldResolver, Root, Int } from "type-graphql";

import "reflect-metadata";

@Resolver(of => User)
export default class UserFieldResolvers {
    @FieldResolver(returns => Rank, { nullable: true })
    async rank(
        @Root("id")
        id: User["id"],
        @Root("totalQuestionsAnswered")
        totalQuestionsAnswered: User["totalQuestionsAnswered"],
        @Root("lastAnsweredQuestionTime")
        lastAnsweredQuestionTime: User["lastAnsweredQuestionTime"]
    ): Promise<Rank> {
        if (!totalQuestionsAnswered) return null;
        const n = await UserModel.countDocuments({
            $or: [
                { totalQuestionsAnswered: { $gt: totalQuestionsAnswered } },
                {
                    totalQuestionsAnswered: { $eq: totalQuestionsAnswered },
                    lastAnsweredQuestionTime: {
                        $gte: lastAnsweredQuestionTime
                    }
                }
            ]
        });
        const rank = new Rank();
        rank.rank = n;
        rank.id = `rank-${id}`;
        return rank;
    }
}
