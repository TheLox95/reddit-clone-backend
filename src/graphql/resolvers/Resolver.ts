import Context from "./Context";
import { IFieldResolver } from "apollo-server";

export type Resolver<A = {}> = IFieldResolver<{}, Context, A>
