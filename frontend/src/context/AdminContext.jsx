import React, { createContext, useState, useEffect } from 'react'
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const AdminContext = createContext();

const AdminAuthProvider = ({ children }) => {
   
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    const getTokenFromLocal = () => {
        return localStorage.getItem("adminAccessToken");
    }

    const checkAuth = async () => {

        try {

            const response = await axios.get("http://localhost:8080/api/admin/checkAuth",{
                headers : {
                    Authorization : `Bearer ${getTokenFromLocal()}`
                },
                withCredentials: true
            });

            console.log(response);

            if (response.data?.data) 
            {
                setAdmin(response.data.data);
            } 
            else 
            {
                setAdmin(null);
            }   

        } catch (err) {
            setAdmin(null);
            console.log(err);
        }
        finally {
            setLoading(false);
        }

    }

    const logout = async () => {

        try {
            await axios.post("http://localhost:8080/api/user/logout");
            setAdmin(null);
        } catch (err) {
            console.log(err);
        }

    }

    useEffect(() => {
        checkAuth();
    },[]);

  return (
    <AdminContext.Provider value={{ admin, loading, setAdmin ,logout, getTokenFromLocal }}>
        {children}
    </AdminContext.Provider>
  )
}

export { AdminAuthProvider, AdminContext };