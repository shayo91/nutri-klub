import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { useAnimateOnScroll } from "@/hooks/useAnimateOnScroll";
import { getBMICategory, type BMIColorType } from "@/lib/utils";

type WeightUnit = "kg";
type HeightUnit = "cm";
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
  colorType: BMIColorType;
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
    gender: "male",
  });

  const [result, setResult] = useState<BMIResult | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    if (name === "gender") {
      setFormData({
        ...formData,
        [name]: value as Gender,
      });
    } else if (name === "weightUnit") {
      setFormData({
        ...formData,
        [name]: value as WeightUnit,
      });
    } else if (name === "heightUnit") {
      setFormData({
        ...formData,
        [name]: value as HeightUnit,
      });
    } else if (name === "weight" || name === "height" || name === "age") {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0,
      });
    }
  };

  const calculateBMI = (e: FormEvent) => {
    e.preventDefault();

    let weightKg = formData.weight;
    let heightM = formData.height / 100;

    const bmi = weightKg / (heightM * heightM);

    const { category, message, indicatorPosition, colorType } = getBMICategory(bmi);

    setResult({
      bmi,
      category,
      indicatorPosition,
      message,
      colorType,
    });
  };

  const resultColorClasses: Record<BMIColorType, string> = {
    blue: "text-blue-600",
    green: "text-green-600",
    yellow: "text-yellow-600",
    orange: "text-orange-600",
    red: "text-red-600",
  };
  const barColorClasses: Record<BMIColorType, string> = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    orange: "bg-orange-500",
    red: "bg-red-500",
  };

  return (
    <section id="bmi-calculator" aria-label="BMI kalkulator" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 12 }}
          animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.45 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <p className="text-primary font-medium tracking-wide uppercase mb-2">
            PROCJENA ZDRAVLJA
          </p>
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-6">
            BMI kalkulator
          </h2>
          <p className="text-gray-600">
            Izračunaj svoj indeks tjelesne mase (BMI) i saznaj kojoj kategoriji trenutno pripadaš. BMI može biti koristan orijentir, ali imaj na umu da je to samo jedan indikator zdravlja i treba ga razmotriti zajedno sa drugim faktorima.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-stretch gap-10">
          {/* BMI Calculator Form */}
          <motion.div
            ref={formRef}
            initial={{ opacity: 0, y: 12 }}
            animate={formInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.45, delay: 0.2 }}
            className="w-full lg:w-1/2 bg-secondary rounded-xl p-4 sm:p-6 md:p-8 shadow-lg flex flex-col min-w-0"
          >
            <h3 className="text-2xl font-bold font-poppins mb-6">
              Izračunajte svoj BMI
            </h3>

            <form id="bmi-form" className="space-y-6 flex-grow" onSubmit={calculateBMI}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="min-w-0">
                  <label
                    htmlFor="weight"
                    className="block text-gray-700 font-medium mb-2 text-sm sm:text-base"
                  >
                    Težina
                  </label>
                  <div className="flex min-w-0">
                    <input
                      type="number"
                      id="weight"
                      name="weight"
                      className="flex-grow min-w-0 px-3 sm:px-4 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
                      placeholder="Težina"
                      required
                      onChange={handleChange}
                      min="1"
                    />
                    <div className="px-3 sm:px-4 py-2 bg-gray-50 rounded-r-md border border-l-0 border-gray-300 text-gray-600 text-sm sm:text-base flex-shrink-0">
                      kg
                    </div>
                  </div>
                </div>

                <div className="min-w-0">
                  <label
                    htmlFor="height"
                    className="block text-gray-700 font-medium mb-2 text-sm sm:text-base"
                  >
                    Visina
                  </label>
                  <div className="flex min-w-0">
                    <input
                      type="number"
                      id="height"
                      name="height"
                      className="flex-grow min-w-0 px-3 sm:px-4 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
                      placeholder="Visina"
                      required
                      onChange={handleChange}
                      min="1"
                    />
                    <div className="px-3 sm:px-4 py-2 bg-gray-50 rounded-r-md border border-l-0 border-gray-300 text-gray-600 text-sm sm:text-base flex-shrink-0">
                      cm
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="min-w-0">
                  <label
                    htmlFor="age"
                    className="block text-gray-700 font-medium mb-2 text-sm sm:text-base"
                  >
                    Godine
                  </label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    className="w-full px-3 sm:px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
                    placeholder="Godine"
                    required
                    onChange={handleChange}
                    min="1"
                  />
                </div>

                <div className="min-w-0">
                  <span className="block text-gray-700 font-medium mb-2 text-sm sm:text-base" id="gender-label">
                    Pol
                  </span>
                  <div className="flex space-x-3 sm:space-x-4 h-[42px] items-center" role="radiogroup" aria-labelledby="gender-label">
                    <label htmlFor="gender-male" className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        id="gender-male"
                        name="gender"
                        value="male"
                        className="mr-2 text-primary focus:ring-primary"
                        checked={formData.gender === "male"}
                        onChange={handleChange}
                      />
                      Muški
                    </label>
                    <label className="flex items-center cursor-pointer" htmlFor="gender-female">
                      <input
                        type="radio"
                        id="gender-female"
                        name="gender"
                        value="female"
                        className="mr-2 text-primary focus:ring-primary"
                        checked={formData.gender === "female"}
                        onChange={handleChange}
                      />
                      Ženski
                    </label>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#5DAD8C] hover:bg-[#4A9A79] rounded-md font-medium transition duration-300 ease-in-out shadow-md hover:shadow-lg text-white"
              >
                Izračunaj BMI
              </button>
            </form>

            {/* BMI Result */}
            {result && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.4 }}
                className="mt-8 p-6 bg-white rounded-lg shadow"
              >
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xl font-bold">Vaš BMI Rezultat</h4>
                  <span
                    className={`text-2xl font-bold ${resultColorClasses[result.colorType]}`}
                  >
                    {result.bmi.toFixed(1)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div
                    className={`h-2.5 rounded-full ${barColorClasses[result.colorType]}`}
                    style={{ width: `${Math.min(result.indicatorPosition, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Pothranjenost</span>
                  <span>Normalna tjelesna masa</span>
                  <span>Prekomjerna težina</span>
                  <span>Gojaznost</span>
                </div>
                <div className="mt-4">
                  <p className="font-medium">Kategorija: {result.category}</p>
                  <p className="text-gray-600 mt-2">{result.message}</p>
                  <p className="text-gray-600 mt-3">
                    <a
                      href="#contact"
                      className="text-[#5DAD8C] font-medium hover:underline"
                    >
                      Kontaktirajte nas za konsultacije i plan ishrane →
                    </a>
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* BMI Chart - No subtitle, same height as left */}
          <motion.div
            ref={chartRef}
            initial={{ opacity: 0, y: 12 }}
            animate={chartInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.45, delay: 0.3 }}
            className="w-full lg:w-1/2 flex flex-col"
          >
            <div className="overflow-hidden rounded-xl shadow-lg flex-grow">
              <table className="w-full h-full">
                <thead className="bg-[#5DAD8C] text-white">
                  <tr>
                    <th className="py-4 px-6 text-left">BMI Opseg</th>
                    <th className="py-4 px-6 text-left">Kategorija</th>
                    <th className="py-4 px-6 text-left">Zdravstveni Rizik</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  <tr className="border-b border-gray-200">
                    <td className="py-4 px-6">Ispod 18.5</td>
                    <td className="py-4 px-6 font-medium">Pothranjenost</td>
                    <td className="py-4 px-6">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        Nizak do umjeren
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200 bg-green-50">
                    <td className="py-4 px-6">18.5 - 24.9</td>
                    <td className="py-4 px-6 font-medium">Normalna tjelesna masa</td>
                    <td className="py-4 px-6">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                        Minimalan
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-4 px-6">25.0 - 29.9</td>
                    <td className="py-4 px-6 font-medium">Prekomjerna težina</td>
                    <td className="py-4 px-6">
                      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                        Povećan
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-4 px-6">30.0 - 34.9</td>
                    <td className="py-4 px-6 font-medium">I stepen gojaznosti</td>
                    <td className="py-4 px-6">
                      <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                        Umjeren
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-4 px-6">35.0 - 39.9</td>
                    <td className="py-4 px-6 font-medium">
                      II stepen gojaznosti
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                        Visok
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6">40.0 i više</td>
                    <td className="py-4 px-6 font-medium">
                      III stepen gojaznosti
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                        Veoma visok
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>

        {/* Note - Centered, same width as header text */}
        <div className="mt-8 max-w-3xl mx-auto">
          <p className="text-gray-600 text-sm text-center">
            <strong>Napomena:</strong> BMI je alat za procjenu, a ne dijagnostički instrument. Za cjelovitu procjenu zdravstvenog stanja preporučuje se konsultacija sa stručnjakom.
          </p>
        </div>
      </div>
    </section>
  );
}
