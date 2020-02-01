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
        const user = await UserModel.findOne({
            email: context.user.email
        });
        console.log(await UserModel.remove({ email: context.user.email }));

        return user;
    }

    @Mutation(returns => User)
    async updateUser(
        @Arg("userInfo") userInput: UserInput,
        @Ctx() context: Context
    ) {
        const currrentUser = await UserModel.findOne({
            email: context.user.email
        });
        if (!currrentUser) {
            throw new Error("Invalid User");
        }

        const payload: Partial<UserInput> = {};

        if (userInput.college) payload.college = userInput.college;
        if (userInput.year) payload.year = userInput.year;
        if (userInput.country) payload.country = userInput.country;
        if (userInput.phone) payload.phone = userInput.phone;

        await UserModel.updateOne(
            { email: context.user.email },
            {
                $set: { ...payload }
            },
            {
                new: true
            }
        );
        return UserModel.findOne({ email: context.user.email });
    }
}
