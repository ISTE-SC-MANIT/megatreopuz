import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
export class Notification {
  @Field({ nullable: true })
  id: number;

  @Field({ nullable: true })
  message?: string;

  @Field(type => Date)
  date: Date;
}

export interface NotificationPayload {
  id: number;
  message?: string;
}
