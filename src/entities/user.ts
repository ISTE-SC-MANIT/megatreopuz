import {
  prop as Property,
  getModelForClass,
  arrayProp as ArrayProperty
} from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";
import { Question } from "./question";
import QuestionModel from "./question";
@ObjectType()
export class User {
  @Field()
  @Property({ required: true })
  id: string;

  @Field()
  @Property({ required: true })
  username: string;
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
  LastAnsweredQuestionTime: Date;

  @Field()
  @Property({ required: true })
  country?: string;

  @Field()
  @Property({ required: true })
  admin?: boolean;

  @Field()
  @Property()
  currentquestion: number;

  @Field()
  @Property({ default: 0 })
  LastAnsweredQuestion: number;

  @Field()
  @Property({ default: 0 })
  TotalQuestionsAnswered: number;

  @Field()
  @Property({ default: 0 })
  Rank: number;

  @Field(type => [Question])
  @ArrayProperty({ items: Question, default: [], ref: Question })
  ratings: Question[];
}

export default getModelForClass(User);
