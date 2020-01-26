import { prop as Property, getModelForClass } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";
@ObjectType()
export class Answer {
  @Field()
  @Property({ required: true })
  questionno: Number;

  @Field()
  @Property({ required: true })
  userid: string;

  @Field()
  @Property({ required: true })
  answer: string;
}

export default getModelForClass(Answer);
