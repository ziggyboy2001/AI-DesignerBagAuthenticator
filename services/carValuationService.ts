import { CarDetails } from '@/types';

// Mock function to generate a car valuation based on car details
export function getCarValuation(carDetails: CarDetails) {
  // Base price for a fictional average car
  const basePrice = 15000;
  
  // Adjust for condition
  const conditionMultipliers = {
    poor: 0.7,
    fair: 0.85,
    good: 1.0,
    excellent: 1.15
  };
  
  // Feature values
  const featureValues = {
    leather: 800,
    sunroof: 600,
    navigation: 500,
    alloy_wheels: 400,
    backup_camera: 300,
    parking_sensors: 250,
    premium_audio: 450,
    turbo: 1000,
  };
  
  // Damage reduction (percent of total value)
  const damageReductions = [0, 0.03, 0.08, 0.15, 0.25];
  
  // Calculate condition adjustment
  const conditionAdjustment = basePrice * conditionMultipliers[carDetails.condition];
  
  // Calculate features value
  const featuresValue = carDetails.features.reduce((total, feature) => {
    return total + (featureValues[feature as keyof typeof featureValues] || 0);
  }, 0);
  
  // Calculate mileage adjustment (deduct 1% per 10,000 miles above 50,000)
  const mileageAdjustment = carDetails.mileage > 50000 ? 
    -((carDetails.mileage - 50000) / 10000) * 0.01 * (conditionAdjustment + featuresValue) : 0;
  
  // Calculate damage reduction
  const damageReduction = (conditionAdjustment + featuresValue) * damageReductions[carDetails.damageLevel];
  
  // Calculate total value
  const totalValue = conditionAdjustment + featuresValue + mileageAdjustment - damageReduction;
  
  // Calculate sale price (what someone would pay for it)
  const salePrice = Math.round(totalValue);
  
  // Calculate trade-in price (typically 15-20% less than sale price)
  const tradeInPrice = Math.round(salePrice * 0.82);
  
  return {
    salePrice,
    tradeInPrice
  };
}

// Function to format currency values
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}