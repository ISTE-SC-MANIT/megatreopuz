import { getModelForClass, prop } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";
import { Node } from "../node";

@ObjectType({ implements: Node })
export class ContestState {
    @prop({ required: true })
    _id: string;

    @Field()
    id: string;

    @prop({ required: true })
    @Field()
    active: boolean;
}

export default getModelForClass(ContestState);
