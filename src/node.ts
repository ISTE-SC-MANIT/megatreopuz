import { InterfaceType, Field } from "type-graphql";

@InterfaceType()
export abstract class Node {
    @Field()
    id: string;
}
