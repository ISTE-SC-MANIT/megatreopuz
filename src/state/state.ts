import { getModelForClass, prop, index } from "@typegoose/typegoose";
import { Field, ObjectType, Int } from "type-graphql";

@ObjectType()
export class ContestState {
    @prop({ required: true })
    @Field()
    active: boolean;
}

export default getModelForClass(ContestState);
