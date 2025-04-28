export type CarCondition = 'poor' | 'fair' | 'good' | 'excellent';

export interface CarDetails {
  condition: CarCondition;
  mileage: number;
  features: string[];
  damageLevel: number;
}