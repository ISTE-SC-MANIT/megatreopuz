import { Authorized, PubSub } from "type-graphql";
import { PubSubEngine } from "graphql-subscriptions";
import { Mutation, Resolver, Arg } from "type-graphql";
import StateModel from "./state";
@Resolver()
export default class MutationClass {
    @Mutation(returns => Boolean)
    @Authorized("ADMIN")
    async updateState(
        @PubSub() pubSub: PubSubEngine,
        @Arg("state") state: boolean
    ) {
        const s = await StateModel.findOneAndUpdate(
            {
                $or: [{ active: true }, { active: false }]
            },
            {
                $set: {
                    active: state
                }
            },
            {
                new: true
            }
        );
        let res: boolean;
        if (!s) res = false;
        res = s.active;

        await pubSub.publish("STATE", res);
        return res;
    }
}
