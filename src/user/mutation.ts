import { Context } from "../index";
import UserModel, { User } from "./user";
import "reflect-metadata";
import { Resolver, Arg, Ctx, Mutation, Authorized } from "type-graphql";
import { UserInput } from "./updateInput";

@Resolver()
export default class MutationClass {
    @Mutation(returns => User)
    @Authorized("USER")
    async deleteUser(@Ctx() context: Context) {
        const user = await UserModel.findOneAndDelete({
            email: context.user.email
        });
        if (!user) return null;
        user.id = user._id;
        return user;
    }

    @Mutation(returns => User)
    @Authorized("USER")
    async updateUser(
        @Arg("userInfo") userInput: UserInput,
        @Ctx() context: Context
    ) {
        const payload: Partial<UserInput> = {};

        if (userInput.college) payload.college = userInput.college;
        if (userInput.year) payload.year = userInput.year;
        if (userInput.country) payload.country = userInput.country;
        if (userInput.phone) payload.phone = userInput.phone;

        const user = await UserModel.findOneAndUpdate(
            { email: context.user.email },
            {
                $set: { ...payload }
            },
            {
                new: true
            }
        );

        if (!user) return null;

        user.id = user._id;
        return user;
    }
}
