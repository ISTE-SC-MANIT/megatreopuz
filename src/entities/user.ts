import { prop as Property, getModelForClass } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";
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
  @Property()
  email?: string;

  @Field({ nullable: true })
  @Property()
  phone?: string;

  @Field({ nullable: true })
  @Property()
  college?: string;

  @Field({ nullable: true })
  @Property()
  year?: string;

  @Field({ nullable: true })
  @Property()
  country?: string;

  @Field({ nullable: true })
  @Property()
  admin?: boolean;

  @Field()
  @Property()
  currentquestion: number;
}

export default getModelForClass(User);
