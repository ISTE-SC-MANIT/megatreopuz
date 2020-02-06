import { getModelForClass, prop, index } from "@typegoose/typegoose";
import { Field, ObjectType, Int } from "type-graphql";
import { Node } from "../node";

@ObjectType({ implements: Node })
export class Rank {
    @Field()
    id: string;

    @Field()
    rank: number;
}

@index({ email: 1 }, { unique: true })
@ObjectType({ implements: Node })
export class User {
    @prop({ required: true })
    _id: string;

    @Field()
    id: string;

    @Field()
    @prop({ required: true })
    userName: string;

    @Field()
    @prop({ required: true })
    name: string;

    @Field()
    @prop({ required: true })
    email: string;

    @Field()
    @prop({ required: true })
    phone: string;

    @Field()
    @prop({ required: true })
    college: string;

    @Field(type => Int)
    @prop({ required: true })
    year: number;

    @Field()
    @prop()
    lastAnsweredQuestionTime?: Date;

    @Field()
    @prop({ required: true })
    country: string;

    @Field()
    @prop({ default: false })
    admin: boolean;

    @Field()
    @prop({ default: 0 })
    lastAnsweredQuestion: number;

    @Field()
    @prop({ default: 0 })
    totalQuestionsAnswered: number;
}

export default getModelForClass(User);
