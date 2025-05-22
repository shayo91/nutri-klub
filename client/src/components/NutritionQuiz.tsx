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
    question: "What are your primary nutrition goals?",
    options: [
      { id: "1a", text: "Weight loss", value: "weight-loss" },
      { id: "1b", text: "Building muscle", value: "muscle-gain" },
      { id: "1c", text: "Improving overall health", value: "health" },
      { id: "1d", text: "Managing a health condition", value: "medical" }
    ]
  },
  {
    id: 2,
    question: "How would you describe your current diet?",
    options: [
      { id: "2a", text: "Mostly processed foods", value: "processed" },
      { id: "2b", text: "Mixed - some healthy, some processed", value: "mixed" },
      { id: "2c", text: "Mostly whole foods", value: "whole-foods" },
      { id: "2d", text: "Specific diet (keto, vegan, etc.)", value: "specific" }
    ]
  },
  {
    id: 3,
    question: "How physically active are you?",
    options: [
      { id: "3a", text: "Sedentary (little to no exercise)", value: "sedentary" },
      { id: "3b", text: "Lightly active (1-3 days/week)", value: "light" },
      { id: "3c", text: "Moderately active (3-5 days/week)", value: "moderate" },
      { id: "3d", text: "Very active (6-7 days/week)", value: "active" }
    ]
  },
  {
    id: 4,
    question: "Do you have any dietary restrictions?",
    options: [
      { id: "4a", text: "No restrictions", value: "none" },
      { id: "4b", text: "Vegetarian/Vegan", value: "plant-based" },
      { id: "4c", text: "Gluten-free", value: "gluten-free" },
      { id: "4d", text: "Dairy-free", value: "dairy-free" }
    ]
  },
  {
    id: 5,
    question: "What meal do you struggle with the most?",
    options: [
      { id: "5a", text: "Breakfast", value: "breakfast" },
      { id: "5b", text: "Lunch", value: "lunch" },
      { id: "5c", text: "Dinner", value: "dinner" },
      { id: "5d", text: "Snacks", value: "snacks" }
    ]
  }
];

// Sample quiz results/profiles
const quizResults: Record<string, QuizResult> = {
  "weight-loss": {
    title: "Weight Management Profile",
    description: "Based on your answers, a calorie-conscious approach with nutrient-dense foods would be ideal for your goals.",
    recommendations: [
      "Focus on high-fiber, low-calorie foods to increase satiety",
      "Include lean proteins with each meal to preserve muscle mass",
      "Consider intermittent fasting with professional guidance",
      "Prioritize non-starchy vegetables and limit refined carbohydrates"
    ],
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    color: "green"
  },
  "muscle-gain": {
    title: "Muscle Building Profile",
    description: "Your profile suggests you would benefit from a protein-rich diet with adequate carbohydrates to fuel your workouts.",
    recommendations: [
      "Consume 1.6-2.2g of protein per kg of body weight daily",
      "Include complex carbohydrates around your training sessions",
      "Focus on progressive overload in your strength training",
      "Consider a post-workout protein shake with simple carbohydrates"
    ],
    image: "https://images.unsplash.com/photo-1532384748853-8f54a8f476e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    color: "blue"
  },
  "health": {
    title: "Optimal Wellness Profile",
    description: "Your answers indicate a focus on overall health. A balanced, Mediterranean-style approach would serve you well.",
    recommendations: [
      "Incorporate a variety of colorful fruits and vegetables daily",
      "Include healthy fats from olive oil, avocados, and nuts",
      "Choose whole grains over refined carbohydrates",
      "Stay hydrated with adequate water intake throughout the day"
    ],
    image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    color: "teal"
  },
  "medical": {
    title: "Therapeutic Nutrition Profile",
    description: "Managing health conditions through nutrition requires a targeted approach. Here are some general guidelines.",
    recommendations: [
      "Consult with a registered dietitian for condition-specific advice",
      "Keep a food journal to identify potential trigger foods",
      "Focus on an anti-inflammatory diet rich in omega-3s",
      "Limit sodium, added sugars, and highly processed foods"
    ],
    image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    color: "purple"
  }
};

export default function NutritionQuiz() {
  const { ref, inView } = useAnimateOnScroll();
  const [currentStep, setCurrentStep] = useState(0); // 0 = intro, 1-5 = questions, 6 = results
  const [quizAnswers, setQuizAnswers] = useState<QuizQuestion[]>([...questions]);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Current question being displayed (1-indexed for user display)
  const currentQuestion = currentStep > 0 && currentStep <= questions.length 
    ? quizAnswers[currentStep - 1] 
    : null;

  // Handle answer selection
  const handleAnswerSelect = (questionId: number, optionValue: string) => {
    setQuizAnswers(prev => prev.map(q => 
      q.id === questionId ? { ...q, userAnswer: optionValue } : q
    ));
  };

  // Navigate to next question
  const handleNext = () => {
    if (currentStep < questions.length && currentQuestion?.userAnswer) {
      setCurrentStep(prev => prev + 1);
    } else if (currentStep === questions.length) {
      calculateResults();
    }
  };

  // Navigate to previous question
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Calculate quiz results based on answers
  const calculateResults = () => {
    // Simple calculation based on the first question's answer for demo purposes
    // In a real application, you would use a more sophisticated algorithm
    const primaryGoal = quizAnswers.find(q => q.id === 1)?.userAnswer || "health";
    setQuizResult(quizResults[primaryGoal]);
    setCurrentStep(questions.length + 1); // Move to results step
  };

  // Start the quiz from intro screen
  const startQuiz = () => {
    setCurrentStep(1);
  };

  // Restart the quiz
  const restartQuiz = () => {
    setQuizAnswers([...questions]); // Reset answers
    setQuizResult(null);
    setCurrentStep(0); // Back to intro
  };

  // Submit email for personalized plan
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert(`Thank you! Your personalized nutrition plan will be sent to ${userEmail}`);
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
          <p className="text-primary font-medium tracking-wide uppercase mb-2">PERSONALIZED NUTRITION</p>
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-6">
            Discover Your Optimal Nutrition Plan
          </h2>
          <p className="text-gray-600">
            Take our quick quiz to receive personalized nutrition recommendations based on your goals, preferences, and lifestyle.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Progress bar */}
            {currentStep > 0 && currentStep <= questions.length && (
              <div className="w-full bg-gray-200 h-2">
                <div 
                  className="bg-primary h-2 transition-all duration-300" 
                  style={{ width: `${(currentStep / questions.length) * 100}%` }}
                ></div>
              </div>
            )}

            <div className="p-6 md:p-10">
              {/* Quiz intro screen */}
              {currentStep === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center"
                >
                  <img 
                    src="https://images.unsplash.com/photo-1505253758473-96b7015fcd40?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300" 
                    alt="Nutrition Quiz" 
                    className="mx-auto rounded-lg mb-8"
                  />
                  <h3 className="text-2xl font-bold mb-4">Ready to Find Your Perfect Nutrition Plan?</h3>
                  <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                    Answer 5 quick questions about your goals and preferences, and we'll provide personalized nutrition 
                    recommendations designed specifically for you.
                  </p>
                  <button
                    onClick={startQuiz}
                    className="px-8 py-4 bg-primary hover:bg-primary-dark text-white rounded-full font-medium transition duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    Start Quiz
                  </button>
                </motion.div>
              )}

              {/* Quiz questions */}
              {currentQuestion && (
                <motion.div
                  key={currentQuestion.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-2 flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">Question {currentStep} of {questions.length}</span>
                    <span className="text-sm font-medium text-primary">{currentStep * 20}% Complete</span>
                  </div>
                  
                  <h3 className="text-xl md:text-2xl font-bold mb-6">{currentQuestion.question}</h3>
                  
                  <div className="space-y-3 mb-8">
                    {currentQuestion.options.map(option => (
                      <div 
                        key={option.id}
                        onClick={() => handleAnswerSelect(currentQuestion.id, option.value)}
                        className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                          currentQuestion.userAnswer === option.value
                            ? "border-primary bg-primary bg-opacity-5"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`w-5 h-5 rounded-full border flex-shrink-0 mr-3 flex items-center justify-center ${
                            currentQuestion.userAnswer === option.value
                              ? "border-primary"
                              : "border-gray-400"
                          }`}>
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
                      Previous
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
                      {currentStep === questions.length ? "See Results" : "Next"}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Quiz results */}
              {currentStep > questions.length && quizResult && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center"
                >
                  <div className="mb-8 inline-block rounded-full p-3" style={{ backgroundColor: `${quizResult.color}10` }}>
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center`} style={{ backgroundColor: `${quizResult.color}20` }}>
                      <svg className={`w-8 h-8 text-${quizResult.color}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">Your {quizResult.title}</h3>
                  
                  <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                    {quizResult.description}
                  </p>
                  
                  <div className="flex flex-col md:flex-row gap-8 mb-10">
                    <div className="md:w-1/3">
                      <img 
                        src={quizResult.image} 
                        alt={quizResult.title} 
                        className="w-full h-auto rounded-lg"
                      />
                    </div>
                    <div className="md:w-2/3 text-left">
                      <h4 className="font-bold text-lg mb-4">Recommendations:</h4>
                      <ul className="space-y-3">
                        {quizResult.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start">
                            <svg className="w-5 h-5 text-primary mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-lg mb-8">
                    <h4 className="font-bold text-lg mb-4">Want a detailed nutrition plan?</h4>
                    <p className="text-gray-600 mb-4">
                      Enter your email below and we'll send you a customized nutrition plan based on your quiz results.
                    </p>
                    
                    <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                      <input
                        type="email"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        placeholder="Your email address"
                        required
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition duration-200"
                      >
                        {isSubmitting ? "Sending..." : "Get My Plan"}
                      </button>
                    </form>
                  </div>
                  
                  <button
                    onClick={restartQuiz}
                    className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-200"
                  >
                    Retake Quiz
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}