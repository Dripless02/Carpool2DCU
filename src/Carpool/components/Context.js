import React from "react";

// Create a context for the login state
export const LoginContext = React.createContext(null);

// Create a context for the current user's details
export const CurrentUserContext = React.createContext({ loggedIn: false });
