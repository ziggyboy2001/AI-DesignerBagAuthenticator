export const STRIPE_PRODUCTS = {
  UNLIMITED_SUBSCRIPTION: {
    id: 'price_1P...', // You'll need to replace this with your actual Stripe price ID
    name: '$9.99/month',
    price: 9.99,
    interval: 'month',
    features: [
      'Unlimited car valuations',
      'Detailed market analysis',
      'Price history tracking',
      'Export reports'
    ]
  }
}; 