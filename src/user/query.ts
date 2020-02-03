import { Context } from "../index";
import UserModel, { User } from "./user";
import "reflect-metadata";
import { Resolver, Query, Ctx, Authorized } from "type-graphql";

@Resolver()
export default class QueryClass {
    @Query(returns => User)
    @Authorized("USER")
    async viewer(@Ctx() context: Context) {
        const user = await UserModel.findOne({ email: context.user.email });
        user.id = user._id;
        return user;
    }
}

