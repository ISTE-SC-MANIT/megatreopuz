import { prop as Property, getModelForClass } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";
@ObjectType()
export class Answer {
  @Field()
  @Property({ required: true })
  questionNo: Number;

  @Field()
  @Property({ required: true })
  userId: string;

  @Field()
  @Property({ required: true })
  answer: string;
  @Field()
  @Property({ required: true })
  message: string;
}

export default getModelForClass(Answer);
