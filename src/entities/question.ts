import { prop as Property, getModelForClass } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";
@ObjectType()
export class Question {
  @Field()
  @Property({ required: true })
  questionno: Number;

  @Field()
  @Property({ required: true })
  description: string;

  @Field()
  @Property({ required: true })
  answer: string;

  @Field()
  @Property({ required: true })
  imgurl: string;
}

export default getModelForClass(Question);
