import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date from string to readable format
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Calculate BMI helper function
export function calculateBMI(weight: number, height: number, weightUnit: 'kg' | 'lb', heightUnit: 'cm' | 'm' | 'in'): number {
  // Convert to metric if needed
  let weightKg = weight;
  if (weightUnit === 'lb') {
    weightKg = weight * 0.453592;
  }
  
  let heightM = height;
  if (heightUnit === 'cm') {
    heightM = height / 100;
  } else if (heightUnit === 'in') {
    heightM = height * 0.0254;
  }
  
  // Calculate BMI = weight(kg) / height²(m)
  return weightKg / (heightM * heightM);
}

// Get BMI category helper function
export function getBMICategory(bmi: number): {
  category: string;
  message: string;
  indicatorPosition: number;
} {
  if (bmi < 18.5) {
    return {
      category: 'Underweight',
      message: 'You may need to gain some weight. Consult with a nutritionist for a healthy weight gain plan.',
      indicatorPosition: (bmi / 18.5) * 25
    };
  } else if (bmi < 25) {
    return {
      category: 'Normal Weight',
      message: 'You have a healthy weight. Maintain it with balanced nutrition and regular physical activity.',
      indicatorPosition: 25 + ((bmi - 18.5) / 6.5) * 25
    };
  } else if (bmi < 30) {
    return {
      category: 'Overweight',
      message: 'You may benefit from losing some weight. Consider changes to your diet and activity level.',
      indicatorPosition: 50 + ((bmi - 25) / 5) * 25
    };
  } else {
    return {
      category: 'Obese',
      message: 'You should consider weight loss for health benefits. Consult with healthcare professionals for guidance.',
      indicatorPosition: 75 + Math.min(((bmi - 30) / 10) * 25, 25)
    };
  }
}
