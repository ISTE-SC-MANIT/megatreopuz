import { InputType, Field } from "type-graphql";

@InputType()
export class ConteststateInput {
  @Field()
  stateinfo: Boolean;
}
