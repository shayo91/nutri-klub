import { useLanguage } from "@/hooks/useLanguage";

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 text-sm rounded transition-colors ${
          language === 'en' 
            ? 'bg-primary text-white' 
            : 'text-gray-600 hover:text-primary'
        }`}
      >
        EN
      </button>
      <span className="text-gray-400">|</span>
      <button
        onClick={() => setLanguage('sr')}
        className={`px-3 py-1 text-sm rounded transition-colors ${
          language === 'sr' 
            ? 'bg-primary text-white' 
            : 'text-gray-600 hover:text-primary'
        }`}
      >
        SR
      </button>
    </div>
  );
}