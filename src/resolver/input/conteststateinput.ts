import { InputType, Field } from "type-graphql";

@InputType()
export class ConteststateInput {
  @Field()
  conteststate: string;
  @Field()
  id: string;
}
