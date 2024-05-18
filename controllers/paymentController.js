import Razorpay from "razorpay";
const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const checkOut = async (req, res) => {
  try {
    const options = {
      amount: Number(req.body.amount * 100),
      currency: "INR",
    };
    const order = await instance.orders.create(options);
    console.log("order:", order);
    res.json(order);
  } catch (error) {
    console.error("An error occurred during checkout:", error);
    res.status(500).json({ error: "An error occurred during checkout" });
  }
};
const paymentVerification = async (req, res) => {
  console.log("helllllllllllo payment");
  const { razorpayOrderId, razorpayPaymentId } = req.body;
  res.json({
    razorpayOrderId,
    razorpayPaymentId,
  });
};

export { checkOut, paymentVerification };
