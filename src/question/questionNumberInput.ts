import { InputType, Field, Int } from "type-graphql";

@InputType()
export default class QuestionNumberInput {
    @Field(type => Int)
    questionNo: number;
}
