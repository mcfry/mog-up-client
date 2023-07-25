import React, { useEffect, useState } from "react";
import fb from "./firebase.js";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const localData = localStorage.getItem("userData");
    return localData ? JSON.parse(localData) : null;
  });

  useEffect(() => {
    fb.auth().onAuthStateChanged((user) => {
      if (user) {
        // get info from user object in postgres

        localStorage.setItem("userData", JSON.stringify(user));
      } else {
        localStorage.removeItem("userData");
      }
      setCurrentUser(user);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
