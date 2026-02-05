import { motion } from "framer-motion";
import { useAnimateOnScroll } from "@/hooks/useAnimateOnScroll";
import { useState } from "react";

// Quiz question types
type QuizQuestion = {
  id: number;
  question: string;
  options: QuizOption[];
  userAnswer?: string;
};

type QuizOption = {
  id: string;
  text: string;
  value: string;
};

// Quiz result profile
type QuizResult = {
  title: string;
  description: string;
  recommendations: string[];
  image: string;
  color: string;
};

// Sample quiz questions
const questions: QuizQuestion[] = [
  {
    id: 1,
    question: "Koji su vaši glavni ciljevi u ishrani?",
    options: [
      { id: "1a", text: "Gubitak težine", value: "weight-loss" },
      { id: "1b", text: "Građenje mišića", value: "muscle-gain" },
      { id: "1c", text: "Poboljšanje opšteg zdravlja", value: "health" },
      { id: "1d", text: "Upravljanje zdravstvenim stanjem", value: "medical" },
    ],
  },
  {
    id: 2,
    question: "Kako biste opisali svoju trenutnu ishranu?",
    options: [
      { id: "2a", text: "Većinom procesuirana hrana", value: "processed" },
      {
        id: "2b",
        text: "Pomešano - malo zdravih, malo procesuiranih",
        value: "mixed",
      },
      { id: "2c", text: "Većinom cela hrana", value: "whole-foods" },
      {
        id: "2d",
        text: "Specifična dijeta (keto, veganska, itd.)",
        value: "specific",
      },
    ],
  },
  {
    id: 3,
    question: "Koliko fizički aktivni ste?",
    options: [
      {
        id: "3a",
        text: "Sjedilački (malo ili nimalo vežbanja)",
        value: "sedentary",
      },
      { id: "3b", text: "Lagano aktivni (1-3 dana nedeljno)", value: "light" },
      {
        id: "3c",
        text: "Umereno aktivni (3-5 dana nedeljno)",
        value: "moderate",
      },
      { id: "3d", text: "Veoma aktivni (6-7 dana nedeljno)", value: "active" },
    ],
  },
  {
    id: 4,
    question: "Imate li neka ograničenja u ishrani?",
    options: [
      { id: "4a", text: "Nema ograničenja", value: "none" },
      { id: "4b", text: "Vegetarijanac/Vegan", value: "plant-based" },
      { id: "4c", text: "Bez glutena", value: "gluten-free" },
      { id: "4d", text: "Bez mleka", value: "dairy-free" },
    ],
  },
  {
    id: 5,
    question: "Sa kojim obrokom imate najviše problema?",
    options: [
      { id: "5a", text: "Doručak", value: "breakfast" },
      { id: "5b", text: "Ručak", value: "lunch" },
      { id: "5c", text: "Večera", value: "dinner" },
      { id: "5d", text: "Grickalice", value: "snacks" },
    ],
  },
];

// Sample quiz results/profiles
const quizResults: Record<string, QuizResult> = {
  "weight-loss": {
    title: "Profil za upravljanje težinom",
    description:
      "Na osnovu vaših odgovora, pristup s kontrolom kalorija uz hranljive namirnice bio bi idealan za vaše ciljeve.",
    recommendations: [
      "Fokusirajte se na hranu bogatu vlaknima, niskokaloričnu, kako biste povećali sitost",
      "Uključite nemasne proteine u svaki obrok kako biste očuvali mišićnu masu",
      "Razmotrite povremeno post uz profesionalno vođenje",
      "Prioritet dajte neslanom povrću i ograničite rafinisanih ugljene hidrate",
    ],
    image:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    color: "green",
  },
  // Add similar translation for other profiles...
};

export default function NutritionQuiz() {
  const { ref, inView } = useAnimateOnScroll();
  const [currentStep, setCurrentStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<QuizQuestion[]>([
    ...questions,
  ]);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Current question being displayed (1-indexed for user display)
  const currentQuestion =
    currentStep > 0 && currentStep <= questions.length
      ? quizAnswers[currentStep - 1]
      : null;

  const handleAnswerSelect = (questionId: number, optionValue: string) => {
    setQuizAnswers((prev) =>
      prev.map((q) =>
        q.id === questionId ? { ...q, userAnswer: optionValue } : q,
      ),
    );
  };

  const handleNext = () => {
    if (currentStep < questions.length && currentQuestion?.userAnswer) {
      setCurrentStep((prev) => prev + 1);
    } else if (currentStep === questions.length) {
      calculateResults();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const calculateResults = () => {
    const primaryGoal =
      quizAnswers.find((q) => q.id === 1)?.userAnswer || "health";
    setQuizResult(quizResults[primaryGoal]);
    setCurrentStep(questions.length + 1);
  };

  const startQuiz = () => {
    setCurrentStep(1);
  };

  const restartQuiz = () => {
    setQuizAnswers([...questions]);
    setQuizResult(null);
    setCurrentStep(0);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      alert(
        `Hvala! Vaš personalizovani nutricioni plan biće poslat na ${userEmail}`,
      );
      setUserEmail("");
    }, 1500);
  };

  return (
    <section id="nutrition-quiz" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <p className="text-primary font-medium tracking-wide uppercase mb-2">
            PERSONALIZOVANA ISHRANA
          </p>
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-6">
            Otkrijte Vaš Optimalni Plan Ishrane
          </h2>
          <p className="text-gray-600">
            Izađite na naš brzi kviz i dobijte personalizovane preporuke o
            ishrani na osnovu vaših ciljeva, preferencija i stilova života.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {currentStep > 0 && currentStep <= questions.length && (
              <div className="w-full bg-gray-200 h-2">
                <div
                  className="bg-primary h-2 transition-all duration-300"
                  style={{
                    width: `${(currentStep / questions.length) * 100}%`,
                  }}
                ></div>
              </div>
            )}

            <div className="p-6 md:p-10">
              {currentStep === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center"
                >
                  <img
                    src="https://images.unsplash.com/photo-1505253758473-96b7015fcd40?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300"
                    alt="Kviz o ishrani - nutricionista savjeti za zdrav život"
                    className="mx-auto rounded-lg mb-8"
                  />
                  <h3 className="text-2xl font-bold mb-4">
                    Spremni da pronađete svoj savršen plan ishrane?
                  </h3>
                  <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                    Odgovorite na 5 brzih pitanja o svojim ciljevima i
                    preferencama, i mi ćemo vam dati personalizovane preporuke
                    ishrane napravljene posebno za vas.
                  </p>
                  <button
                    onClick={startQuiz}
                    className="px-8 py-4 bg-primary hover:bg-primary-dark text-white rounded-full font-medium transition duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    Započnite Kviz
                  </button>
                </motion.div>
              )}

              {currentQuestion && (
                <motion.div
                  key={currentQuestion.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-2 flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">
                      Pitanje {currentStep} od {questions.length}
                    </span>
                    <span className="text-sm font-medium text-primary">
                      {currentStep * 20}% Kompletirano
                    </span>
                  </div>

                  <h3 className="text-xl md:text-2xl font-bold mb-6">
                    {currentQuestion.question}
                  </h3>

                  <div className="space-y-3 mb-8">
                    {currentQuestion.options.map((option) => (
                      <div
                        key={option.id}
                        onClick={() =>
                          handleAnswerSelect(currentQuestion.id, option.value)
                        }
                        className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                          currentQuestion.userAnswer === option.value
                            ? "border-primary bg-primary bg-opacity-5"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-5 h-5 rounded-full border flex-shrink-0 mr-3 flex items-center justify-center ${
                              currentQuestion.userAnswer === option.value
                                ? "border-primary"
                                : "border-gray-400"
                            }`}
                          >
                            {currentQuestion.userAnswer === option.value && (
                              <div className="w-3 h-3 rounded-full bg-primary"></div>
                            )}
                          </div>
                          <span className="text-gray-800">{option.text}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={handlePrevious}
                      className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-200"
                    >
                      Prethodno
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={!currentQuestion.userAnswer}
                      className={`px-6 py-2 rounded-md text-white transition duration-200 ${
                        currentQuestion.userAnswer
                          ? "bg-primary hover:bg-primary-dark"
                          : "bg-gray-300 cursor-not-allowed"
                      }`}
                    >
                      {currentStep === questions.length
                        ? "Pogledajte Rezultate"
                        : "Naredno"}
                    </button>
                  </div>
                </motion.div>
              )}

              {currentStep > questions.length && quizResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-center bg-white rounded-2xl shadow-lg p-8"
                >
                  <div className="mb-8 inline-block rounded-full p-4 bg-primary/10">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center bg-primary/20">
                      <svg
                        className="w-8 h-8 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>

                  <h3 className="text-3xl font-bold mb-4 text-gray-800">
                    {quizResult.title}
                  </h3>

                  <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                    {quizResult.description}
                  </p>

                  <div className="text-left bg-gray-50 rounded-lg p-6 mb-8">
                    <h4 className="font-bold text-xl mb-4 text-gray-800">Personalizovane Preporuke:</h4>
                    <ul className="space-y-3">
                      {quizResult.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-primary text-xl mr-3 mt-1">✓</span>
                          <span className="text-gray-700 leading-relaxed">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg mb-8">
                    <h4 className="font-bold text-lg mb-4">
                      Želite detaljan plan ishrane?
                    </h4>
                    <p className="text-gray-600 mb-4">
                      Unesite vašu email adresu ispod i poslaćemo vam
                      prilagođeni plan ishrane na osnovu vaših rezultata kviza.
                    </p>

                    <form
                      onSubmit={handleEmailSubmit}
                      className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
                    >
                      {/* Include email input and submit button logic here */}
                    </form>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
