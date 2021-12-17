import {
    useEffect,
    useState,
    useContext,
    createContext,
    FunctionComponent,
} from "react";
import { useRouter } from "next/router";
import firebase from "firebase/app";
import "firebase/auth";
import initFirebase from "./initFirebase";
import { removeTokenCookie, setTokenCookie } from "./tokenCookies";

initFirebase();

interface IAuthContext {
    user: firebase.User | null;
    logout: () => void;
    authenticated: boolean;
}

const AuthContext = createContext<IAuthContext>({
    user: null,
    logout: () => null,
    authenticated: false
})

export const AuthProvider: FunctionComponent = ({ children }) => {

    const [user, setUser] = useState<firebase.User | null>(null)
    const router = useRouter()

    const logout = () => {
        //the signOut function returns a promise, so when the promise resolves redirect user to home page, but add a catch in case it blows up
        firebase.auth().signOut().then(() => {
            router.push("/")
        }).catch(e => {
            console.error(e)
        })
    }

    //periodically firebase will fire an event to notify the app that the user's token has expired (or if it was just set), so listen for it here in this useEffect and set/unset user in app state
    useEffect(() => {
        const cancelAuthListener = firebase.auth().onIdTokenChanged(async (user) => {
            if (user) {
                const token = await user.getIdToken();
                setTokenCookie(token)
                setUser(user)
            } else {
                removeTokenCookie();
                setUser(null)
            }
        })

        //a return statement's code gets run when the component unmounts, if defined
        return () => {
            cancelAuthListener()
        }

    }, [])

    // the !! seems to convert the user type into a boolean, need to look this up somewhere....
    return <AuthContext.Provider value={{ user, logout, authenticated: !!user }}>{children}</AuthContext.Provider>
}

export function useAuth() {
    return useContext(AuthContext)
}