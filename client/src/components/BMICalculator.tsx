import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { useAnimateOnScroll } from "@/hooks/useAnimateOnScroll";

type WeightUnit = "kg" | "lb";
type HeightUnit = "cm" | "in";
type Gender = "male" | "female";

interface BMIFormData {
  weight: number;
  weightUnit: WeightUnit;
  height: number;
  heightUnit: HeightUnit;
  age: number;
  gender: Gender;
}

interface BMIResult {
  bmi: number;
  category: string;
  indicatorPosition: number;
  message: string;
}

export default function BMICalculator() {
  const { ref: headerRef, inView: headerInView } = useAnimateOnScroll();
  const { ref: formRef, inView: formInView } = useAnimateOnScroll(0.2);
  const { ref: chartRef, inView: chartInView } = useAnimateOnScroll(0.3);

  const [formData, setFormData] = useState<BMIFormData>({
    weight: 0,
    weightUnit: "kg",
    height: 0,
    heightUnit: "cm",
    age: 0,
    gender: "male"
  });

  const [result, setResult] = useState<BMIResult | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'gender') {
      setFormData({
        ...formData,
        [name]: value as Gender
      });
    } else if (name === 'weightUnit') {
      setFormData({
        ...formData,
        [name]: value as WeightUnit
      });
    } else if (name === 'heightUnit') {
      setFormData({
        ...formData,
        [name]: value as HeightUnit
      });
    } else if (name === 'weight' || name === 'height' || name === 'age') {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0
      });
    }
  };

  const calculateBMI = (e: FormEvent) => {
    e.preventDefault();
    
    // Convert to metric if needed
    let weightKg = formData.weight;
    if (formData.weightUnit === 'lb') {
      weightKg = formData.weight * 0.453592;
    }
    
    let heightM = formData.height;
    if (formData.heightUnit === 'cm') {
      heightM = formData.height / 100;
    } else if (formData.heightUnit === 'in') {
      heightM = formData.height * 0.0254;
    }
    
    // Calculate BMI
    const bmi = weightKg / (heightM * heightM);
    
    // Determine category and message
    let category: string;
    let message: string;
    let indicatorPosition: number;
    
    if (bmi < 18.5) {
      category = 'Underweight';
      message = 'You may need to gain some weight. Consult with a nutritionist for a healthy weight gain plan.';
      indicatorPosition = (bmi / 18.5) * 25;
    } else if (bmi < 25) {
      category = 'Normal Weight';
      message = 'You have a healthy weight. Maintain it with balanced nutrition and regular physical activity.';
      indicatorPosition = 25 + ((bmi - 18.5) / 6.5) * 25;
    } else if (bmi < 30) {
      category = 'Overweight';
      message = 'You may benefit from losing some weight. Consider changes to your diet and activity level.';
      indicatorPosition = 50 + ((bmi - 25) / 5) * 25;
    } else {
      category = 'Obese';
      message = 'You should consider weight loss for health benefits. Consult with healthcare professionals for guidance.';
      indicatorPosition = 75 + Math.min(((bmi - 30) / 10) * 25, 25);
    }
    
    setResult({
      bmi,
      category,
      indicatorPosition,
      message
    });
  };

  return (
    <section id="bmi-calculator" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div 
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <p className="text-primary font-medium tracking-wide uppercase mb-2">HEALTH ASSESSMENT</p>
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-6">
            BMI Calculator & Health Chart
          </h2>
          <p className="text-gray-600">
            Calculate your Body Mass Index (BMI) to get a quick assessment of your weight status. Remember, BMI is just one indicator of health and should be considered alongside other factors.
          </p>
        </motion.div>
        
        <div className="flex flex-col lg:flex-row items-start gap-10">
          {/* BMI Calculator Form */}
          <motion.div 
            ref={formRef}
            initial={{ opacity: 0, y: 20 }}
            animate={formInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full lg:w-1/2 bg-secondary rounded-xl p-8 shadow-lg"
          >
            <h3 className="text-2xl font-bold font-poppins mb-6">Calculate Your BMI</h3>
            
            <form id="bmi-form" className="space-y-6" onSubmit={calculateBMI}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="weight" className="block text-gray-700 font-medium mb-2">Weight</label>
                  <div className="flex">
                    <input 
                      type="number" 
                      id="weight" 
                      name="weight"
                      className="flex-grow px-4 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                      placeholder="Enter weight" 
                      required 
                      onChange={handleChange}
                      min="1"
                    />
                    <select 
                      id="weight-unit" 
                      name="weightUnit"
                      className="px-4 py-2 bg-gray-50 rounded-r-md border border-l-0 border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      onChange={handleChange}
                      value={formData.weightUnit}
                    >
                      <option value="kg">kg</option>
                      <option value="lb">lb</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="height" className="block text-gray-700 font-medium mb-2">Height</label>
                  <div className="flex">
                    <input 
                      type="number" 
                      id="height" 
                      name="height"
                      className="flex-grow px-4 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                      placeholder="Enter height" 
                      required 
                      onChange={handleChange}
                      min="1"
                    />
                    <select 
                      id="height-unit" 
                      name="heightUnit"
                      className="px-4 py-2 bg-gray-50 rounded-r-md border border-l-0 border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      onChange={handleChange}
                      value={formData.heightUnit}
                    >
                      <option value="cm">cm</option>
                      <option value="in">in</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="age" className="block text-gray-700 font-medium mb-2">Age</label>
                  <input 
                    type="number" 
                    id="age" 
                    name="age"
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                    placeholder="Enter age" 
                    required 
                    onChange={handleChange}
                    min="1"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Gender</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        name="gender" 
                        value="male" 
                        className="mr-2 text-primary focus:ring-primary" 
                        checked={formData.gender === 'male'} 
                        onChange={handleChange}
                      />
                      Male
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        name="gender" 
                        value="female" 
                        className="mr-2 text-primary focus:ring-primary"
                        checked={formData.gender === 'female'} 
                        onChange={handleChange}
                      />
                      Female
                    </label>
                  </div>
                </div>
              </div>
              
              <button 
                type="submit" 
                className="w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-md font-medium transition duration-300 ease-in-out shadow-md hover:shadow-lg"
              >
                Calculate BMI
              </button>
            </form>
            
            {/* BMI Result */}
            {result && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.4 }}
                className="mt-8 p-6 bg-white rounded-lg shadow"
              >
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xl font-bold">Your BMI Result</h4>
                  <span className="text-2xl font-bold text-primary">{result.bmi.toFixed(1)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div 
                    className="bg-primary h-2.5 rounded-full" 
                    style={{ width: `${result.indicatorPosition}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Underweight</span>
                  <span>Normal</span>
                  <span>Overweight</span>
                  <span>Obese</span>
                </div>
                <div className="mt-4">
                  <p className="font-medium">Category: {result.category}</p>
                  <p className="text-gray-600 mt-2">{result.message}</p>
                </div>
              </motion.div>
            )}
          </motion.div>
          
          {/* BMI Chart */}
          <motion.div 
            ref={chartRef}
            initial={{ opacity: 0, y: 20 }}
            animate={chartInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-full lg:w-1/2"
          >
            <h3 className="text-2xl font-bold font-poppins mb-6">BMI Categories</h3>
            <div className="overflow-hidden rounded-xl shadow-lg">
              <table className="w-full">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="py-4 px-6 text-left">BMI Range</th>
                    <th className="py-4 px-6 text-left">Category</th>
                    <th className="py-4 px-6 text-left">Health Risk</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  <tr className="border-b border-gray-200">
                    <td className="py-4 px-6">Below 18.5</td>
                    <td className="py-4 px-6 font-medium">Underweight</td>
                    <td className="py-4 px-6">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Low to Moderate</span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200 bg-green-50">
                    <td className="py-4 px-6">18.5 - 24.9</td>
                    <td className="py-4 px-6 font-medium">Normal Weight</td>
                    <td className="py-4 px-6">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Minimal</span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-4 px-6">25.0 - 29.9</td>
                    <td className="py-4 px-6 font-medium">Overweight</td>
                    <td className="py-4 px-6">
                      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">Increased</span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-4 px-6">30.0 - 34.9</td>
                    <td className="py-4 px-6 font-medium">Obesity Class I</td>
                    <td className="py-4 px-6">
                      <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">Moderate</span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-4 px-6">35.0 - 39.9</td>
                    <td className="py-4 px-6 font-medium">Obesity Class II</td>
                    <td className="py-4 px-6">
                      <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">High</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6">40.0 and above</td>
                    <td className="py-4 px-6 font-medium">Obesity Class III</td>
                    <td className="py-4 px-6">
                      <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">Very High</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 bg-secondary p-4 rounded-lg">
              <p className="text-gray-600 text-sm">
                <strong>Note:</strong> BMI is a screening tool, not a diagnostic tool. Factors such as muscle mass, bone density, and overall body composition are not taken into account. For a comprehensive health assessment, please consult with a healthcare professional.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
