import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { useAnimateOnScroll } from "@/hooks/useAnimateOnScroll";
import { getBMICategory } from "@/lib/utils"; // Ensure to import the helper function

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

    // Use metric units directly
    let weightKg = formData.weight;
    let heightM = formData.height / 100; // Convert cm to meters

    // Calculate BMI
    const bmi = weightKg / (heightM * heightM);

    // Get category, message, and indicator position
    const { category, message, indicatorPosition } = getBMICategory(bmi);

    setResult({
      bmi,
      category,
      indicatorPosition,
      message,
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
          <p className="text-primary font-medium tracking-wide uppercase mb-2">
            PROCENA ZDRAVLjA
          </p>
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-6">
            BMI Kalkulator & Zdravstvena Tabela
          </h2>
          <p className="text-gray-600">
            Izračunajte svoj indeks telesne mase (BMI) kako biste brzo procenili
            svoj status težine. Zapamtite, BMI je samo jedan indikator zdravlja
            i treba ga razmotriti zajedno sa drugim faktorima.
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
            <h3 className="text-2xl font-bold font-poppins mb-6">
              Izračunajte svoj BMI
            </h3>

            <form id="bmi-form" className="space-y-6" onSubmit={calculateBMI}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="weight"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Težina
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      id="weight"
                      name="weight"
                      className="flex-grow px-4 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Unesite težinu"
                      required
                      onChange={handleChange}
                      min="1"
                    />
                    <div className="px-4 py-2 bg-gray-50 rounded-r-md border border-l-0 border-gray-300 text-gray-600">
                      kg
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="height"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Visina
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      id="height"
                      name="height"
                      className="flex-grow px-4 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Unesite visinu"
                      required
                      onChange={handleChange}
                      min="1"
                    />
                    <div className="px-4 py-2 bg-gray-50 rounded-r-md border border-l-0 border-gray-300 text-gray-600">
                      cm
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="age"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Godine
                  </label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Unesite godine"
                    required
                    onChange={handleChange}
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Pol
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        className="mr-2 text-primary focus:ring-primary"
                        checked={formData.gender === "male"}
                        onChange={handleChange}
                      />
                      Muški
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
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
                className="w-full py-3 bg-primary hover:bg-primary-dark rounded-md font-medium transition duration-300 ease-in-out shadow-md hover:shadow-lg"
                style={{ color: "#000" }}
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
                  <span className="text-2xl font-bold text-primary">
                    {result.bmi.toFixed(1)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div
                    className="bg-primary h-2.5 rounded-full"
                    style={{ width: `${result.indicatorPosition}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Premala težina</span>
                  <span>Normalna težina</span>
                  <span>Prekomerna težina</span>
                  <span>Gojaznost</span>
                </div>
                <div className="mt-4">
                  <p className="font-medium">Kategorija: {result.category}</p>
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
            <h3 className="text-2xl font-bold font-poppins mb-6">
              BMI Kategorije
            </h3>
            <div className="overflow-hidden rounded-xl shadow-lg">
              <table className="w-full">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="py-4 px-6 text-left">BMI Opseg</th>
                    <th className="py-4 px-6 text-left">Kategorija</th>
                    <th className="py-4 px-6 text-left">Zdravstveni Rizik</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  <tr className="border-b border-gray-200">
                    <td className="py-4 px-6">Ispod 18.5</td>
                    <td className="py-4 px-6 font-medium">Premala težina</td>
                    <td className="py-4 px-6">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        Nizak do Umeren
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200 bg-green-50">
                    <td className="py-4 px-6">18.5 - 24.9</td>
                    <td className="py-4 px-6 font-medium">Normalna težina</td>
                    <td className="py-4 px-6">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                        Minimalan
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-4 px-6">25.0 - 29.9</td>
                    <td className="py-4 px-6 font-medium">Prekomerna težina</td>
                    <td className="py-4 px-6">
                      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                        Povećan
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-4 px-6">30.0 - 34.9</td>
                    <td className="py-4 px-6 font-medium">Gojaznost Klasa I</td>
                    <td className="py-4 px-6">
                      <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                        Umeren
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-4 px-6">35.0 - 39.9</td>
                    <td className="py-4 px-6 font-medium">
                      Gojaznost Klasa II
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
                      Gojaznost Klasa III
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                        Veoma Visok
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 bg-secondary p-4 rounded-lg">
              <p className="text-gray-600 text-sm">
                <strong>Napomena:</strong> BMI je alat za procenu, ne
                dijagnostički alat. Faktori poput mišićne mase, gustine kostiju
                i ukupnog sastava tela nisu uzeti u obzir. Za sveobuhvatnu
                procenu zdravlja, molimo vas da se konsultujete sa zdravstvenim
                profesionalcem.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
