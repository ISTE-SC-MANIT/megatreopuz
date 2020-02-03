import { prop as Property, getModelForClass } from "@typegoose/typegoose";
import { Field, ObjectType, Int } from "type-graphql";
@ObjectType()
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

    @Field()
    @Property({ required: true })
    answer: string;

    @Field()
    @Property({ required: true })
    imgUrl: string;
}

export default getModelForClass(Question);
