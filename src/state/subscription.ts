import { Resolver, Subscription, Root, Authorized } from "type-graphql";

@Resolver()
export default class SubscriptionClass {
    @Authorized("USER")
    @Subscription({
        topics: "STATE"
    })
    stateValue(@Root() payload: boolean): boolean {
        return payload;
    }
}
