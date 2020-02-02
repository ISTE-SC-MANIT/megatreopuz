import { InputType, Field } from "type-graphql";

@InputType()
export class AnswerInput {
  @Field()
  answer: string;
}
