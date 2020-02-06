import { Resolver, Subscription, Root, Authorized } from "type-graphql";
import { ContestState } from "./state";

@Resolver()
export default class SubscriptionClass {
    @Subscription({
        topics: "STATE"
    })
    @Authorized("USER")
    stateValue(
        @Root("active") active: boolean,
        @Root("id") id: string
    ): ContestState {
        const s = new ContestState();
        s.id = id;
        s._id = id;
        s.active = active;
        return s;
    }
}
