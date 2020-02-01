import { prop as Property, getModelForClass } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";
@ObjectType()
export class Conteststate {
  @Field()
  @Property({ required: true })
  stateInfo: Boolean;
}

export default getModelForClass(Conteststate);
export interface NotificationPayload {
  stateInfo: Boolean;
}
