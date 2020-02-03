import { Resolver, Query, Authorized } from "type-graphql";
import StateModel from "./state";
@Resolver()
export default class QueryClass {
    @Query(returns => Boolean)
    @Authorized("USER")
    async getState() {
        const s = await StateModel.findOne({
            $or: [{ active: true }, { active: false }]
        });
        if (!s) return false;
        return s.active;
    }
}
