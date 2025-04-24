import { razorpay } from "../config/razorpay.js";
import { courses } from "../models/course.model.js";
import { Enrollment } from "../models/enrollment.model.js";
import { Order } from "../models/order.model.js";
import { Payment } from "../models/payment.model.js";

export const createPaymentHandler = async (req, res) => {

    try
    {
        const { course_id } = req.body;

        if(!course_id) {
            throw new Error("course_id is empty");
        }

        const courseDetails = await courses.findById({
            _id : course_id
        });

        // console.log(courseDetails);

        if(!courseDetails){
            throw new Error("course doesn't exist");
        }

        if(courseDetails.price === 0) {

            await Order.create({
                _id : Math.random().toString(), 
                user_id : req.user_id,
                course_id,
                amount : courseDetails.price,
                status: "CREATED",
            });

            await Enrollment.create({
                course_id: course_id,
                student_id : req.user_id,
                payment_id : "freePayment"
            })

            return res.status(200).json({
                amount : 0,
                message : "free enrollment done",
                success : true
            });
        }

        const options = {
            amount : courseDetails.price * 100
        }
        
        const order = await razorpay.orders.create(options);

        await Order.create({
            _id : order.id, 
            user_id : req.user_id,
            course_id,
            amount : courseDetails.price,
            status: "CREATED",
        });

        return res.status(200).json(order);

    }
    catch(error)
    {
        console.log(error)
    }

}

export const verifyPayment = async (req, res) => {

    try {
        
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const paymentObj = await Payment.create({
            _id: razorpay_payment_id,
            order_id: razorpay_order_id,
            paymentSignature: razorpay_signature,
            status: "SUCCESS",
            paymentMethod: "card",
        });

        await Order.findByIdAndUpdate(razorpay_order_id, { status: "PAID" });

        const order = await Order.findById(razorpay_order_id);

        await Enrollment.create({
          user_id: order.user_id,
          student_id : req.user_id,
          course_id: order.course_id,
          payment_id: paymentObj._id,
        });

        res.json({ success: true, message: "Payment successful!" });

    } catch (error) {
        console.log(error);
        res.status(400).json({ success: false, message: "Invalid signature" });
    }

}