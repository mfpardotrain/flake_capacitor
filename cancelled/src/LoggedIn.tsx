import PocketBase from "pocketbase";
import React from "react";
import "./styles/login.css";

const pb = new PocketBase(process.env.REACT_APP_FLAKE_API_URL);

function LoggedIn({ setLoggedIn, }: { setLoggedIn: (loggedIn: boolean) => void; }) {
    return (
        <button
            className="logout-button"
            onClick={(e) => {
                e.preventDefault();
                pb.authStore.clear();
                setLoggedIn(false);
            }}
        >Logout
        </button>
    );
};

export default LoggedIn;