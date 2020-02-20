import { UserSchema } from "models/User";

export default interface Context {
    me: UserSchema;
};