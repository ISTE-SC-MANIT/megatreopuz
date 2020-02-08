import { GraphQLScalarType, Kind } from "graphql";

export class LeaderBoardCursorObject {
    constructor(question: number, time: string) {
        this.totalQuestionsAnswered = question;
        this.lastAnsweredQuestionTime = new Date(Number.parseInt(time));
    }
    totalQuestionsAnswered: number;
    lastAnsweredQuestionTime: Date;
}

export const LeaderBoardCursorScalar = new GraphQLScalarType({
    name: "LeaderBoardCursorScalar",
    description: "this is scalar type of leaderboard cursor",
    parseValue(value: string) {
        try {
            const o = JSON.parse(Buffer.from(value, "base64").toString());
            return new LeaderBoardCursorObject(
                parseInt(o["totalQuestionsAnswered"]),
                o["lastAnsweredQuestionTime"]
            );
        } catch (e) {
            return null;
        }
    },
    serialize(value: LeaderBoardCursorObject) {
        try {
            const o = {
                totalQuestionsAnswered: value.totalQuestionsAnswered,
                lastAnsweredQuestionTime: value.lastAnsweredQuestionTime.getTime()
            };
            return Buffer.from(JSON.stringify(o)).toString("base64");
        } catch (e) {
            return null;
        }
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.STRING) {
            try {
                const o = JSON.parse(
                    Buffer.from(ast.value, "base64").toString()
                );
                return new LeaderBoardCursorObject(
                    parseInt(o["totalQuestionsAnswered"]),
                    o["lastAnsweredQuestionTime"]
                );
            } catch (e) {
                return null;
            }
        }
        return null;
    }
});
