import { ObjectId } from "mongodb";
import {
  Resolver,
  Query,
  FieldResolver,
  Arg,
  Root,
  Mutation,
  Ctx
} from "type-graphql";

import User from "../models/users";

@Resolver(of => User)
export default class viewdata {
  @Query(returns => User)
  async getuser(@Ctx() ctx: Context) {
    return await User.findOne({ email: ctx.email });
  }
}
