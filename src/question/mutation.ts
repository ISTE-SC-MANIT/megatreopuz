import QuestionModel, { Question } from "./question";
import { Context } from "../index";
import "reflect-metadata";
import { Resolver, Arg, Ctx, Mutation, Authorized } from "type-graphql";
import QuestionInput from "./questionInput";
import { v4 } from "uuid";
import { hashAnswer } from "./util";
import QuestionNumberInput from "./questionNumberInput";
import UserModel from "../user/user";
@Resolver()
export default class MutationClass {
    @Mutation(returns => Question, { nullable: true })
    @Authorized("ADMIN")
    async createQuestion(@Arg("question") question: QuestionInput) {
        const id = v4();
        const filteredAnswer = question.answer.replace(/[^0-9a-z]/gi, "");
        const ansHash = hashAnswer(filteredAnswer);
        const q = await QuestionModel.findOneAndUpdate(
            {
                questionNo: question.questionNo
            },
            {
                $set: { _id: id, ...question, answer: ansHash }
            },
            {
                new: true,
                upsert: true
            }
        );
        if (!q) return null;
        q.id = id;
        return q;
    }

    @Mutation(returns => Question, { nullable: true })
    @Authorized("ADMIN")
    async updateQuestion(@Arg("question") question: QuestionInput) {
        const filteredAnswer = question.answer.replace(/[^0-9a-z]/gi, "");
        const ansHash = hashAnswer(filteredAnswer);
        const q = await QuestionModel.findOneAndUpdate(
            {
                questionNo: question.questionNo
            },
            {
                $set: { ...question, answer: ansHash }
            },
            {
                new: true,
                upsert: true
            }
        );
        if (!q) return null;
        q.id = q._id;
        return q;
    }

    @Authorized("ADMIN")
    @Mutation(returns => Question, { nullable: true })
    async deleteQuestion(@Arg("input") input: QuestionNumberInput) {
        const question = await QuestionModel.findOneAndDelete({
            questionNo: input.questionNo
        });

        if (!question) return null;
        question.id = question._id;
        return question;
    }

    @Authorized("USER")
    @Mutation(type => Boolean, { nullable: true })
    async answerQuestion(
        @Ctx() context: Context,
        @Arg("answer") answer: string
    ) {
        const user = await UserModel.findOne({ email: context.user.email });
        const res = await QuestionModel.find({
            questionNo: { $gt: user.lastAnsweredQuestion }
        })
            .sort({ questionNo: 1 })
            .limit(1);
        const filtered = answer.replace(/[^0-9a-z]/gi, "");
        if (!res || !res.length) return null;
        const question = res[0];
        const result = hashAnswer(filtered) === question.answer;
        await UserModel.findOneAndUpdate(
            { email: context.user.email },
            {
                $set: {
                    lastAnsweredQuestion: res[0].questionNo,
                    totalQuestionsAnswered: user.totalQuestionsAnswered + 1,
                    lastAnsweredQuestionTime: new Date()
                }
            }
        );
        return result;
    }
}
