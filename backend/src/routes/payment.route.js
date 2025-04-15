import { Router } from "express";
import { verifyJWT } from "../middleware/verifyJWT.js";
import { createPaymentHandler, verifyPayment } from "../controllers/payment.controllers.js";

export const paymentRouter = Router();

paymentRouter.post("/create-order", verifyJWT, createPaymentHandler);
paymentRouter.post("/verify-payment", verifyJWT, verifyPayment);