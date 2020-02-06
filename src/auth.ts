import { Context } from "./index";
enum Roles {
    NONE = "NONE",
    USER = "USER",
    ADMIN = "ADMIN"
}

export function authorizationLevel(
    { context }: { context: Context },
    roles: Roles[]
) {
    const { user } = context;
    if (!user) return Boolean(roles.find(item => item === Roles.NONE));
    if (user.admin) return true;
    return Boolean(
        roles.find(item => item === Roles.NONE || item === Roles.USER)
    );
}
