import React, { createContext, useState, useEffect } from 'react'
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
   
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {

        try {

            const response = await axios.get("http://localhost:8080/api/user/checkAuth",{
                withCredentials: true
            });

            console.log(response);

            if (response.data?.userData) 
            {
                setUser(response.data.userData);
            } 
            else 
            {
                setUser(null);
            }   

        } catch (err) {
            setUser(null);
            console.log(err);
        }
        finally {
            setLoading(false);
        }

    }

    const logout = async () => {

        try {
            await axios.post("http://localhost:8080/api/user/logout");
            setUser(null);
        } catch (err) {
            console.log(err);
        }

    }

    useEffect(() => {
        checkAuth();
    },[]);

  return (
    <AuthContext.Provider value={{ user, loading, setUser ,logout }}>
        {children}
    </AuthContext.Provider>
  )
}

export { AuthProvider, AuthContext };