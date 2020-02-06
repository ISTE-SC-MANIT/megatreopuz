import { Resolver, Query, Authorized } from "type-graphql";
import StateModel, { ContestState } from "./state";
@Resolver()
export default class QueryClass {
    @Query(returns => ContestState)
    @Authorized("USER")
    async getState() {
        const s = await StateModel.findOne({
            $or: [{ active: true }, { active: false }]
        });
        if (!s) return null;
        s.id = s._id;
        return s;
    }
}
