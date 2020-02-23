import { UserSchema } from "models/User";
import { Loaders } from "../Loaders";

export default interface Context {
    me: UserSchema;
    loaders: Loaders;
};