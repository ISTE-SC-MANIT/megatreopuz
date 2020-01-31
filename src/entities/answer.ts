import { prop as Property, getModelForClass } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";
@ObjectType()
export class Answer {
  @Field()
  @Property({ required: true })
  QuestionNo: Number;

  @Field()
  @Property({ required: true })
  UserId: string;

  @Field()
  @Property({ required: true })
  Answer: string;
  @Field()
  @Property({ required: true })
  Message: string;
}

export default getModelForClass(Answer);
