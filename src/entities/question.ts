import { prop as Property, getModelForClass } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";
@ObjectType()
export class Question {
  @Field()
  @Property({ required: true })
  QuestionNo: Number;

  @Field()
  @Property({ required: true })
  Description: string;

  @Field()
  @Property({ required: true })
  Answer: string;

  @Field()
  @Property({ required: true })
  ImgUrl: string;
}

export default getModelForClass(Question);
