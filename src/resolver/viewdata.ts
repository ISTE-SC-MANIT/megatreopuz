import { Context } from "./../index";
import UserModel, { User } from "./../entities/user";
import "reflect-metadata";
import {
    Resolver,
    Query,
    FieldResolver,
    Arg,
    Root,
    ResolverInterface,
    Ctx
} from "type-graphql";
@Resolver(User)
export default class viewdata {
    @Query(returns => User)
    async viewer(@Ctx() context: Context) {
        return await UserModel.findOne({ email: context.user.email });
    }
}
