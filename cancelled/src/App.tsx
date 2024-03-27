import PocketBase from "pocketbase";
import React, { useState } from "react";
import { useMutation } from "react-query";
import GetStatus from "./GetStatus.tsx";
import "./styles/login.css";
import BurgerMenu from "./BurgerMenu.tsx";
import Header from "./Header.tsx";
import { ENV } from './env/env'

const pb = new PocketBase(ENV.REACT_APP_FLAKE_API_URL);

function LoggedOut({ setLoggedIn, }: { setLoggedIn: (loggedIn: boolean) => void; }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");

    type UserVars = {
        email: string;
        password: string;
        username?: string;
    }

    const createUserMutation =
        useMutation(({ email, password, username }: UserVars) => {
            return pb.collection("users")
                .create({
                    email,
                    username,
                    password,
                    passwordConfirm: password,
                })
        }
        );

    const loginMutation =
        useMutation(async ({ email, password, username }: UserVars) => {
            return await pb.collection("users")
                .authWithPassword(email, password)
                .then(() => setLoggedIn(true))
        })

    if (createUserMutation.isSuccess) {
        loginMutation.mutate({ email, password, username })
        if (loginMutation.isSuccess) {
            setLoggedIn(true)
        }
    };

    return (
        <div className="login-container" onSubmit={() => createUserMutation.mutate({ email, password, username })}>
            <div className="default-input-container">
                <label className="default-input-label" htmlFor="email">email</label>
                <input
                    type="text"
                    name="email"
                    id="email"
                    className="default-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="default-input-container">
                <label className="default-input-label" htmlFor="username">username</label>
                <input
                    type="text"
                    name="username"
                    id="username"
                    className="default-input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div className="default-input-container">
                <label className="default-input-label" htmlFor="password">password</label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    className="default-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            <button onClick={() => createUserMutation.mutate({ email, password, username })}>
                Signup
            </button>

            <button onClick={() => loginMutation.mutate({ email, password })}>
                Sign In
            </button>
        </div >
    );
}

export const StatusContext = React.createContext({});

function App() {
    const statuses = GetStatus()
    const [loggedIn, setLoggedIn] = useState(pb.authStore.isValid);

    return loggedIn ? (
        <>
            <StatusContext.Provider value={statuses}>
                <Header />
                <BurgerMenu setLoggedIn={setLoggedIn} />
            </StatusContext.Provider>
        </>
    ) : (
        <>
            <Header />
            <LoggedOut setLoggedIn={setLoggedIn} />
        </>
    )
}

export default App;