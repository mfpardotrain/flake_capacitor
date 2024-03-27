import React, { useState } from 'react';
import { useMutation, useQuery, } from 'react-query';
import PocketBase from "pocketbase";
import "./styles/settings.css";
import { ENV } from './env/env'

const pb = new PocketBase(ENV.REACT_APP_FLAKE_API_URL);

const SettingsPage = () => {
    const [userId, setUserId] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [username, setUsername] = useState("");

    useQuery({
        queryFn: () => {
            return pb.authStore.model
        },
        onSuccess(data) {
            if (data) {
                setUserId(data.id)
                setEmail(data.email)
                setUsername(data.username)
            }
        },
    });

    const createUserMutation =
        useMutation(() => {
            return pb.collection("users")
                .update(userId, {
                    email,
                    username,
                    password,
                    passwordConfirm: password,
                    oldPassword,
                });
        }
        );

    return (
        <>
            <h3 style={{ textAlign: "center", margin: "0px" }}>Settings</h3>
            <form onSubmit={(e) => e.preventDefault()} className='settings-form-container'>
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
                    <label className="default-input-label" htmlFor="password">new password</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        className="default-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="default-input-container">
                    <label className="default-input-label" htmlFor="old-password">current password</label>
                    <input
                        type="old-password"
                        name="old-password"
                        id="old-password"
                        className="default-input"
                        value={password}
                        onChange={(e) => setOldPassword(e.target.value)}
                    />
                </div>
                <button onClick={() => createUserMutation.mutate()}>
                    Save
                </button>
            </form>
        </>
    );
};

export default SettingsPage;
