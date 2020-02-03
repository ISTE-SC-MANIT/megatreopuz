import { Context } from "../index";
import { Subscription, Int, Authorized, Root, Ctx } from "type-graphql";
import UserModel from "./user";
export default class SubscriptionClass {
    @Authorized("USER")
    @Subscription(returns => Int, {
        topics: "RANK"
    })
    async rank(@Ctx() context: Context) {
        // Trigerred whenever a question is answered correctly
        const {
            totalQuestionsAnswered,
            lastAnsweredQuestionTime
        } = await UserModel.findOne({ email: context.user.email });
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
