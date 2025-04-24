import axios from 'axios';
import React from 'react'
import loadRazorpay from '../../utils/LoadRazorpay';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

export const PaymentButton = ({ setIsEnrolled }) => {

    const { course_id } = useParams();

    const handlePayment = async (e) => {

        const res = await loadRazorpay();

        if (!res) {
            alert("Failed to load Razorpay SDK");
            return;
        }

        try
        {
            const course_id = e.target.id;
            
            const { data } = await axios.post("http://localhost:8080/api/payment/create-order", {
                course_id : course_id
            }, {
                withCredentials : true
            });

            if(data.amount == 0) {
                toast.success(data.message);
                setIsEnrolled(true);
                return ;
            }

            // console.log("failed after backend call")

            console.log(data, import.meta.env.VITE_APP_RAZORPAY_KEY_ID);

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Use environment variable
                amount: data.amount,
                currency: data.currency,
                name: "Course Enrollment",
                description: "Purchase of course",
                order_id: data.id, // Razorpay Order ID
                handler : async (response) => {

                    console.log(response);

                    try {
                        const verification = await axios.post("http://localhost:8080/api/payment/verify-payment", {
                          razorpay_order_id: response.razorpay_order_id,
                          razorpay_payment_id: response.razorpay_payment_id,
                          razorpay_signature: response.razorpay_signature,
                        }, {
                            withCredentials : true
                        });
                        
                        console.log(verification);

                        if (verification.data.success) {
                          toast.success("Payment Successfull! Course Enrolled")
                          setIsEnrolled(true);
                        } else {
                          alert("Payment verification failed");
                        }
                      } catch (error) {
                        
                        console.error("Payment verification failed", error);
                        toast.warning("Payment Failed! Please Try Again")
                        alert("Payment verification failed");
                    }
                }   
            }


            console.log("option after options")

            const rzp = new window.Razorpay(options);
            rzp.open();

        }
        catch(error) 
        {
            console.log(error)
            console.error("Order creation failed", error);
            toast.warning("Failed to create Order");
        }

    }

  return (
    <button
        id={course_id}
        onClick={handlePayment}
        className="w-full mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
    >
      Buy Course
    </button>
  )
}
