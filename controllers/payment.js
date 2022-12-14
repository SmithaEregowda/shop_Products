const stripe=require('stripe')('sk_test_51LSgoUSFmHpNb8iUIm6rnGBowqIkb4cOlvXztOjGjvPXIsyeYk5WadcmM8D4QKXtU9VFguyxDxPVVfrCsKXIozkx00fnQ4x6aP')
exports.postPayment = async (req, res, next) => {
    let { amount, token } = req.body;
    console.log("stripe-routes.js 10 | amount and token", amount, token);
    try {
      const payment = await stripe.paymentIntents.create({
        amount: amount,
        currency: "INR",
        description: "Your Company Description",
        payment_method: token,
        confirm: true
      });
     
      res.json({
        message: "Payment Successful",
        success: true,
      });
    } catch (error) {
        console.log(error)
      res.json({
        message: "Payment Failed",
        success: false,
      });
    }
}
