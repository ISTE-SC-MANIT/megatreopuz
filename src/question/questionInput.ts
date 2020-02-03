import { InputType, Field, Int } from "type-graphql";

@InputType()
export default class QuestionInput {
    @Field(type => Int)
    questionNo: number;

    @Field()
    description: string;

    @Field()
    answer: string;

    @Field()
    imgUrl: string;
}
