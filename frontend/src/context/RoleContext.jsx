import axios from "axios";
import { createContext, useEffect, useState } from "react"; 

export const RoleContext = createContext(null);

export const RoleContextProvider = ({ children }) => {

    const [role, setRole] = useState("student");

    const getUserRole = async () => {

        try {
          
          const response = await axios.get("http://localhost:8080/api/user/userRole", {
            withCredentials: true
          });

          setRole(response.data.role);
            
          console.log(response.data, "from cotext");  

        } catch (error) {
            console.log(error);
        }
    
    };

    useEffect(() => {
        getUserRole();
    }, [role]);

    return (
        <RoleContext.Provider value={{ role, setRole }}>
            { children }
        </RoleContext.Provider>
    ); 

} 