import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        _id:{
            type : String,
            required : true
        },
      order_id: {
        type: String,
        ref: "Order",
        required: true,
      },
      paymentSignature: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        enum: ["SUCCESS", "FAILED"],
        required: true,
      },
      paymentMethod: {
        type: String,
        required: true,
      },
      paidAt: {
        type: Date,
        default: Date.now,
      },
    },
    { timestamps: true }
  );
  
export const Payment = mongoose.model("Payment", paymentSchema);
  