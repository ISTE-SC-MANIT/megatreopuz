import { InputType, Field } from "type-graphql";

@InputType()
export class QuestionInput {
  @Field()
  questionno: Number;

  @Field()
  description: string;

  @Field()
  answer: string;

  @Field()
  imgurl: string;
}
