import { AuthChecker } from "type-graphql";
import { Context } from "./context";

export const authChecker: AuthChecker<Context> = ({context}) => {
    const {uid} = context
    return !!uid  //the !! converts the uid value from a string (or null) to a boolean
}
