import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';

export const ProtectedRoute = ({ children }) => {
    
    const { user, loading } = useContext(AuthContext);
    
    console.log(user);

    console.log('from protected route');

    if(loading){
        return <div>Loading...</div>
    }

    if(!user){ 
        return <Navigate to='/login' />
    }

    return (
      <>
        {children}
      </>
  )
}
