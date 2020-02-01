import { InputType, Field } from "type-graphql";

@InputType()
export class UserInput {
    @Field({ nullable: true })
    college?: String;

    @Field({ nullable: true })
    phone?: String;

    @Field({ nullable: true })
    year?: String;

    @Field({ nullable: true })
    country?: String;
}
