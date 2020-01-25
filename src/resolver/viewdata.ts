import "reflect-metadata";
import { ObjectId } from "mongodb";
import {
  Resolver,
  Query,
  FieldResolver,
  Arg,
  Root,
  ResolverInterface,
  Ctx
} from "type-graphql";

import User from "../models/users";
import { UserModel } from "../entities/user";

@Resolver(of => User)
export default class viewdata {
  @Query(returns => User)
  async getuser() {
    return await User.findById("sdhkdjsfhojd");
  }
}

// @Query(returns => User)
// async getuser(@Ctx() ctx: Context) {
//   return await User.findOne({ email: ctx.email });
// }
// }
