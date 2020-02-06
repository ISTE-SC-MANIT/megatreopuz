import {
    prop as Property,
    getModelForClass,
    index
} from "@typegoose/typegoose";
import { Field, ObjectType, Int } from "type-graphql";
import { Node } from "../node";
@index({ questionNo: 1 }, { unique: true })
@ObjectType({ implements: Node })
export class Question {
    @Property({ required: true })
    _id: string;

    @Field()
    id: string;

    @Field(type => Int)
    @Property({ required: true })
    questionNo: number;

    @Field()
    @Property({ required: true })
    description: string;

    @Property({ required: true })
    answer: string;

    @Field()
    @Property({ required: true })
    imgUrl: string;
}

@ObjectType({ implements: Node })
export class AnswerResponse {
    @Field()
    id: string;

    @Field()
    valid: boolean;
}

export default getModelForClass(Question);
