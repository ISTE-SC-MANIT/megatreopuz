import { prop as Property, Typegoose } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";
import { ObjectId } from "mongodb";
@ObjectType()
export class User extends Typegoose {
  @Field()
  readonly _id: ObjectId;

  @Field()
  @Property({ required: true })
  username: string;

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
}

export const UserModel = new User().getModelForClass(User);
