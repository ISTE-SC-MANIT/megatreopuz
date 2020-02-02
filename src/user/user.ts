import { getModelForClass, prop, index } from "@typegoose/typegoose";
import { Field, ObjectType, Int } from "type-graphql";

@index({ email: 1 }, { unique: true })
@ObjectType()
export class User {
  @Field()
  @prop({ required: true })
  id: string;

  @Field()
  @prop({ required: true })
  userName: string;

  @Field()
  @prop({ required: true })
  name: string;

  @Field()
  @prop({ required: true })
  email: string;

  @Field()
  @prop({ required: true })
  phone: string;

  @Field()
  @prop({ required: true })
  college: string;

  @Field()
  @prop({ required: true })
  year: string;

  @Field()
  @prop()
  lastAnsweredQuestionTime?: Date;

  @Field()
  @prop({ required: true })
  country: string;

  @Field()
  @prop({ default: false })
  admin: boolean;

  @Field()
  @prop({ default: 0 })
  lastAnsweredQuestion: number;

  @Field()
  @prop({ default: 0 })
  totalQuestionsAnswered: number;
}

export default getModelForClass(User);
