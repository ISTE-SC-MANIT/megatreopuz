import { prop as Property, getModelForClass } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";
@ObjectType()
export class Conteststate {
  @Field()
  @Property({ required: true })
  stateinfo: Boolean;
}

export default getModelForClass(Conteststate);
export interface NotificationPayload {
  stateinfo: Boolean;
}
