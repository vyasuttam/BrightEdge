import React, { useEffect, useState } from 'react'
import CourseCreationForm from '../components/CourseCreationForm'
import { use } from 'react'
import { useNavigate } from 'react-router-dom';

export const CourseCreationPage = () => {

    const [isClosed, setIsClosed] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {

        if(isClosed) {
            navigate("/dashboard");
        }

    }, [isClosed])

  return (
    <div>
        <CourseCreationForm isClosed={isClosed} setIsClosed={setIsClosed}/>
    </div>
  )
}
