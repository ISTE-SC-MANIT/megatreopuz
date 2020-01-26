
import { InputType, Field, Int } from "type-graphql";

@InputType()
export class userInput {
  @Field({ nullable: true })
  collge?: String;

  @Field({ nullable: true })
  phone?: String;

  @Field({ nullable: true })
  year?: String;

  @Field({ nullable: true })
  country: String;
}
