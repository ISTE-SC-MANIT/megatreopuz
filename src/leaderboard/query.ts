import { Resolver, Query, Arg, Int, Authorized } from "type-graphql";
import {
    LeaderBoardConnection,
    UserEdge,
    LeaderBoardPageInfo
} from "./leaderboard";
import {
    LeaderBoardCursorScalar,
    LeaderBoardCursorObject
} from "../customScalars/leaderboardCursor";
import UserModel, { User } from "../user/user";

@Resolver()
export default class LeaderBoardQuery {
    @Query(returns => LeaderBoardConnection)
    @Authorized("USER")
    async leaderBoard(
        @Arg("first", type => Int) first: number,
        @Arg("after", type => LeaderBoardCursorScalar, { nullable: true })
        after?: LeaderBoardCursorObject
    ) {
        const edges = new LeaderBoardConnection();
        if (!after) {
            const contestants = await UserModel.find()
                .sort({
                    totalQuestionsAnswered: -1,
                    lastAnsweredQuestionTime: 1
                })
                .limit(first + 1);
            edges.edges = contestants.map((contestant: User) => {
                const u = new UserEdge();
                u.node = contestant;
                u.cursor = new LeaderBoardCursorObject(
                    contestant.totalQuestionsAnswered,
                    contestant.lastAnsweredQuestionTime.getTime().toString()
                );
                return u;
            });
        } else {
            const middle = await UserModel.find({
                $or: [
                    {
                        totalQuestionsAnswered: {
                            $lt: after.totalQuestionsAnswered
                        }
                    },
                    {
                        totalQuestionsAnswered: {
                            $eq: after.totalQuestionsAnswered
                        },
                        lastAnsweredQuestionTime: {
                            $gt: after.lastAnsweredQuestionTime
                        }
                    }
                ]
            })
                .sort({
                    totalQuestionsAnswered: -1,
                    lastAnsweredQuestionTime: 1
                })
                .limit(first + 1);
            edges.edges = middle.map((contestant: User) => {
                const u = new UserEdge();
                u.node = contestant;
                u.cursor = new LeaderBoardCursorObject(
                    contestant.totalQuestionsAnswered,
                    contestant.lastAnsweredQuestionTime.getTime().toString()
                );
                return u;
            });
        }
        if (edges.edges.length === first + 1) edges.edges.pop();
        edges.pageInfo = new LeaderBoardPageInfo();
        edges.pageInfo.hasNextPage = edges.edges.length === first + 1;

        const lastUser = edges.edges[edges.edges.length - 1];
        if (lastUser) {
            edges.pageInfo.endCursor = new LeaderBoardCursorObject(
                lastUser.node.totalQuestionsAnswered,
                lastUser.node.lastAnsweredQuestionTime.getTime().toString()
            );
        } else edges.pageInfo.endCursor = new LeaderBoardCursorObject(0, "0");
        return edges;
    }
}
