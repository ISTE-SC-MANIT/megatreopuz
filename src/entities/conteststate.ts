import { prop as Property, getModelForClass } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";
@ObjectType()
export class Conteststate {
  @Field()
  @Property({ required: true })
  currentstate: String;
  @Field()
  @Property({ required: true })
  stateinfo: String;
}

export default getModelForClass(Conteststate);
export interface NotificationPayload {
  stateinfo: string;
  currentstate: String;
}
