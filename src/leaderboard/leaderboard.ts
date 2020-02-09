import { ObjectType, Field } from "type-graphql";
import { User } from "../user/user";
import {
    LeaderBoardCursorObject,
    LeaderBoardCursorScalar
} from "../customScalars/leaderboardCursor";
@ObjectType()
export class LeaderBoardPageInfo {
    @Field(type => LeaderBoardCursorScalar)
    endCursor: LeaderBoardCursorObject;

    @Field(type => LeaderBoardCursorScalar)
    startCursor: LeaderBoardCursorObject;

    @Field()
    hasNextPage: boolean;

    @Field()
    hasPreviousPage: boolean;
}

@ObjectType()
export class UserEdge {
    @Field()
    node: User;

    @Field(type => LeaderBoardCursorScalar)
    cursor: LeaderBoardCursorObject;
}

@ObjectType()
export class LeaderBoardConnection {
    @Field(type => [UserEdge])
    edges: UserEdge[];

    @Field()
    pageInfo: LeaderBoardPageInfo;
}
