import {
  prop as Property,
  getModelForClass,
  arrayProp as ArrayProperty
} from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";
import { Question } from "./question";
import QuestionModel from "./question";
@ObjectType()
export class UserBase {
  @Field()
  @Property({ required: true })
  id: string;

  @Field()
  @Property({ required: true })
  userName: string;
  @Field()
  @Property({ required: true })
  name: string;

  @Field({ nullable: true })
  @Property({ required: true })
  email?: string;

  @Field()
  @Property({ required: true })
  phone?: string;

  @Field()
  @Property({ required: true })
  college?: string;

  @Field()
  @Property({ required: true })
  year?: string;

  @Field()
  @Property({})
  lastAnsweredQuestionTime: Date;

  @Field()
  @Property({ required: true })
  country?: string;

  @Field()
  @Property({ required: true })
  admin?: boolean;

  @Field()
  @Property()
  currentQuestion: number;

  @Field()
  @Property({ default: 0 })
  lastAnsweredQuestion: number;

  @Field()
  @Property({ default: 0 })
  totalQuestionsAnswered: number;

  @Field(type => [Question])
  @ArrayProperty({ items: Question, default: [], ref: Question })
  ratings: Question[];
}

export default getModelForClass(UserBase);

export class User extends UserBase {
  @Field()
  @Property({ default: 0 })
  rank: number;
}
