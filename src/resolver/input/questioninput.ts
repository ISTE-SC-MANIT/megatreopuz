import { InputType, Field } from "type-graphql";

@InputType()
export class QuestionInput {
  @Field()
  QuestionNo: Number;

  @Field()
  Description: string;

  @Field()
  Answer: string;

  @Field()
  ImgUrl: string;
}
