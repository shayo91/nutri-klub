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

export type BMIColorType = 'blue' | 'green' | 'yellow' | 'orange' | 'red';

// Get BMI category helper function (labels and messages in BCS)
export function getBMICategory(bmi: number): {
  category: string;
  message: string;
  indicatorPosition: number;
  colorType: BMIColorType;
} {
  if (bmi < 18.5) {
    return {
      category: 'Pothranjenost',
      message:
        'Možda vam treba blago povećanje tjelesne mase. Kontaktirajte nas za konsultacije i personalizovan plan ishrane.',
      indicatorPosition: (bmi / 18.5) * 25,
      colorType: 'blue',
    };
  }
  if (bmi < 25) {
    return {
      category: 'Normalna tjelesna masa',
      message:
        'Imate zdravu tjelesnu masu. Održavajte je uravnoteženom ishranom i redovnom fizičkom aktivnošću.',
      indicatorPosition: 25 + ((bmi - 18.5) / 6.5) * 25,
      colorType: 'green',
    };
  }
  if (bmi < 30) {
    return {
      category: 'Prekomjerna težina',
      message:
        'Korist može donijeti blago smanjenje težine. Kontaktirajte nas za savjetovanje i plan ishrane prilagođen vašim potrebama.',
      indicatorPosition: 50 + ((bmi - 25) / 5) * 25,
      colorType: 'yellow',
    };
  }
  if (bmi < 35) {
    return {
      category: 'I stepen gojaznosti',
      message:
        'Preporučuje se smanjenje težine radi zdravlja. Kontaktirajte nas za konsultacije i personalizovan plan ishrane.',
      indicatorPosition: 75 + ((bmi - 30) / 5) * 12.5,
      colorType: 'orange',
    };
  }
  if (bmi < 40) {
    return {
      category: 'II stepen gojaznosti',
      message:
        'Smanjenje težine može značajno poboljšati zdravstveni status. Kontaktirajte nas za konsultacije i plan ishrane.',
      indicatorPosition: 87.5 + ((bmi - 35) / 5) * 12.5,
      colorType: 'red',
    };
  }
  return {
    category: 'III stepen gojaznosti',
    message:
      'Preporučujemo stručnu podršku za smanjenje težine. Kontaktirajte nas za konsultacije i individualni plan ishrane.',
    indicatorPosition: Math.min(75 + ((bmi - 30) / 10) * 25, 100),
    colorType: 'red',
  };
}
