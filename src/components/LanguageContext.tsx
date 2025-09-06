import { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  language: 'en' | 'ta';
  setLanguage: (lang: 'en' | 'ta') => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Header
    'app.title': 'AgriAI',
    'nav.crop-recommendation': 'Crop Recommendation',
    'nav.farmer-forum': 'Farmer Forum',
    'nav.ai-assistance': 'AI Assistance',
    'nav.disease-detector': 'Disease Detector',
    'nav.government-schemes': 'Government Schemes',
    'nav.labor-hiring': 'Labor Hiring',
    'nav.machinery-rental': 'Machinery Rental',
    
    // User Input Form
    'form.title': 'Farm Details Required',
    'form.description': 'Please provide your farming details to get personalized crop recommendations',
    'form.state': 'State',
    'form.district': 'District',
    'form.season': 'Cropping Season',
    'form.soil-type': 'Soil Type',
    'form.farm-size': 'Farm Size',
    'form.submit': 'Get Crop Recommendations',
    
    // Seasons
    'season.kharif': 'Kharif (Monsoon)',
    'season.rabi': 'Rabi (Winter)',
    'season.zaid': 'Zaid (Summer)',
    
    // Crops
    'crop.rice': 'Rice',
    'crop.wheat': 'Wheat',
    'crop.tomato': 'Tomato',
    'crop.onion': 'Onion',
    'crop.cotton': 'Cotton',
    'crop.sugarcane': 'Sugarcane',
    'crop.potato': 'Potato',
    'crop.chili': 'Chili',
    'crop.corn': 'Corn',
    'crop.soybean': 'Soybean',
    
    // Forum
    'forum.title': 'Farmer Community Forum',
    'forum.description': 'Connect with farmers across India, share knowledge and get advice',
    'forum.search': 'Search posts...',
    'forum.new-post': 'New Post',
    'forum.create-title': 'Create New Post',
    'forum.create-description': 'Share your farming experience or ask questions',
    'forum.your-name': 'Your Name',
    'forum.location': 'Location',
    'forum.title-label': 'Title',
    'forum.category': 'Category',
    'forum.content': 'Content',
    'forum.tags': 'Tags (comma separated)',
    'forum.post-button': 'Post',
    'forum.cancel': 'Cancel',
    'forum.ai-analysis': 'AI Analysis',
    'forum.ai-suggestions': 'AI Suggestions:',
    'forum.replies': 'replies',
    'forum.likes': 'likes',
    'forum.ai-analyzed': 'AI Analyzed',
    'forum.read-more': 'Read More',
    'forum.show-less': 'Show Less',
    'forum.no-posts': 'No posts found. Be the first to start a discussion!',

    // Common
    'common.profit': 'Profit/Acre',
    'common.duration': 'Duration',
    'common.water': 'Water',
    'common.demand': 'Demand',
    'common.start-plant': 'Start Plant',
    'common.back': 'Back',
    'common.submit': 'Submit',
    'common.cancel': 'Cancel',
  },
  ta: {
    // Header
    'app.title': 'வேளாண் AI',
    'nav.crop-recommendation': 'பயிர் பரிந்துரை',
    'nav.farmer-forum': 'விவசாயி மன்றம்',
    'nav.ai-assistance': 'AI உதவி',
    'nav.disease-detector': 'நோய் கண்டறிதல்',
    'nav.government-schemes': 'அரசு திட்டங்கள்',
    'nav.labor-hiring': 'தொழிலாளர் வேலை',
    'nav.machinery-rental': 'இயந்திர வாடகை',
    
    // User Input Form
    'form.title': 'பண்ணை விவரங்கள் தேவை',
    'form.description': 'தனிப்பயனாக்கப்பட்ட பயிர் பரிந்துரைகளைப் பெற உங்கள் பண்ணை விவரங்களை வழங்கவும்',
    'form.state': 'மாநிலம்',
    'form.district': 'மாவட்டம்',
    'form.season': 'பயிர் பருவம்',
    'form.soil-type': 'மண் வகை',
    'form.farm-size': 'பண்ணை அளவு',
    'form.submit': 'பயிர் பரிந்துரைகளைப் பெறுங்கள்',
    
    // Seasons
    'season.kharif': 'கரீஃப் (மழை)',
    'season.rabi': 'ரபி (குளிர்)',
    'season.zaid': 'ஜைத் (கோடை)',
    
    // Crops
    'crop.rice': 'அரிசி',
    'crop.wheat': 'கோதுமை',
    'crop.tomato': 'தக்காளி',
    'crop.onion': 'வெங்காயம்',
    'crop.cotton': 'பருத்தி',
    'crop.sugarcane': 'கரும்பு',
    'crop.potato': 'உருளைக்கிழங்கு',
    'crop.chili': 'மிளகாய்',
    'crop.corn': 'சோளம்',
    'crop.soybean': 'சோயாபீன்',
    
    // Forum
    'forum.title': 'விவசாயிகள் சமூக மன்றம்',
    'forum.description': 'இந்தியா முழுவதிலும் உள்ள விவசாயிகளுடன் இணைந்து, அறிவைப் பகிர்ந்து ஆலோசனை பெறுங்கள்',
    'forum.search': 'பதிவுகளைத் தேடுங்கள்...',
    'forum.new-post': 'புதிய பதிவு',
    'forum.create-title': 'புதிய பதிவை உருவாக்கவும்',
    'forum.create-description': 'உங்கள் விவசாய அனுபவத்தைப் பகிரவும் அல்லது கேள்விகள் கேட்கவும்',
    'forum.your-name': 'உங்கள் பெயர்',
    'forum.location': 'இடம்',
    'forum.title-label': 'தலைப்பு',
    'forum.category': 'வகை',
    'forum.content': 'உள்ளடக்கம்',
    'forum.tags': 'குறிச்சொற்கள் (காற்புள்ளியால் பிரிக்கப்பட்ட)',
    'forum.post-button': 'பதிவு செய்',
    'forum.cancel': 'ரத்து செய்',
    'forum.ai-analysis': 'AI பகுப்பாய்வு',
    'forum.ai-suggestions': 'AI ஆலோசனைகள்:',
    'forum.replies': 'பதில்கள்',
    'forum.likes': 'விருப்பங்கள்',
    'forum.ai-analyzed': 'AI பகுப்பாய்வு செய்யப்பட்டது',
    'forum.read-more': 'மேலும் படிக்க',
    'forum.show-less': 'குறைவாக காட்டு',
    'forum.no-posts': 'பதிவுகள் எதுவும் கிடைக்கவில்லை. விவாதத்தைத் தொடங்கும் முதல் நபராக இருங்கள்!',

    // Common
    'common.profit': 'லாபம்/ஏக்கர்',
    'common.duration': 'காலம்',
    'common.water': 'நீர்',
    'common.demand': 'தேவை',
    'common.start-plant': 'நடவு தொடங்கு',
    'common.back': 'பின்',
    'common.submit': 'சமர்ப்பிக்கவும்',
    'common.cancel': 'ரத்து',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<'en' | 'ta'>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};