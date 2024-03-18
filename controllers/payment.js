const stripe=require('stripe')('sk_test_51LSgoUSFmHpNb8iUIm6rnGBowqIkb4cOlvXztOjGjvPXIsyeYk5WadcmM8D4QKXtU9VFguyxDxPVVfrCsKXIozkx00fnQ4x6aP')
exports.postPayment = async (req, res, next) => {
    let { amount, token ,paymentId} = req.body;
    try {
      const payment = await stripe.paymentIntents.create({
        amount: amount,
        currency: "INR",
        description: "Your Company Description",
        payment_method: token,
        confirm: true
      });
      
      res.json({
        status:200,
        message: "Payment Successful",
        paidamount:amount,
        paymentId:paymentId,
        success: true,
      });
    } catch (error) {
        console.log(error)
      res.json({
        status:400,
        message: "Payment Failed",
        success: false,
      });
    }
}
