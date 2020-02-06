import { Authorized, PubSub } from "type-graphql";
import { PubSubEngine } from "graphql-subscriptions";
import { Mutation, Resolver, Arg } from "type-graphql";
import StateModel, { ContestState } from "./state";
@Resolver()
export default class MutationClass {
    @Mutation(returns => ContestState)
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
        if (!s) return null;
        s.id = s._id;
        await pubSub.publish("STATE", s);
        return s;
    }
}
