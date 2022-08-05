module.exports = {
  header: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
  },
  paylot: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.PAYLOT_SECRET}`,
  },
};
