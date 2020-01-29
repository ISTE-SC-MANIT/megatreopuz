import { Context } from "./../index";
import UserModel, { User } from "./../entities/user";
import "reflect-metadata";
import { Resolver, Query, Ctx, Mutation } from "type-graphql";
@Resolver(User)
export default class deleteuser {
  @Mutation(returns => User)
  async delete(@Ctx() context: Context) {
    const user = await UserModel.findOne({
      email: context.user.email
    });
    await UserModel.deleteOne({ email: context.user.email });

    return user;
  }
}
