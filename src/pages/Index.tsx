import { useState } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { UserInputForm } from "@/components/UserInputForm";
import { EnhancedCropRecommendation } from "@/components/EnhancedCropRecommendation";
import { CropGuide } from "@/components/CropGuide";
import { EnhancedDailySchedule } from "@/components/EnhancedDailySchedule";
import { FarmerForumPost } from "@/components/FarmerForumPost";
import { EnhancedFarmerForum } from "@/components/EnhancedFarmerForum";
import { AIAssistance } from "@/components/AIAssistance";
import { DiseaseDetector } from "@/components/DiseaseDetector";
import { GovernmentSchemes } from "@/components/GovernmentSchemes";
import { SchemeDetails } from "@/components/SchemeDetails";
import { LaborHiring } from "@/components/LaborHiring";
import { MachineryRental } from "@/components/MachineryRental";
import { LanguageProvider } from "@/components/LanguageContext";

interface FormData {
  state: string;
  district: string;
  season: string;
  soilType: string;
  farmSize: string;
  farmUnit: string;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [userFormData, setUserFormData] = useState<FormData | null>(null);
  const [showUserForm, setShowUserForm] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);
  const [selectedScheme, setSelectedScheme] = useState<any | null>(null);
  const [showDailySchedule, setShowDailySchedule] = useState(false);

  const handleFormSubmit = (data: FormData) => {
    setUserFormData(data);
    setActiveTab("crop-recommendation");
    setShowUserForm(false);
  };

  const handleGetStarted = () => {
    setShowUserForm(true);
    setActiveTab("home");
  };

  const handleStartPlant = (cropName: string) => {
    setSelectedCrop(cropName);
  };

  const handleViewSchedule = () => {
    setShowDailySchedule(true);
  };

  const handleBackToCrops = () => {
    setSelectedCrop(null);
  };

  const handleSchemeDetails = (scheme: any) => {
    setSelectedScheme(scheme);
  };

  const handleBackToSchemes = () => {
    setSelectedScheme(null);
  };

  const renderContent = () => {
    if (showUserForm) {
      return (
        <div className="container mx-auto px-4 py-8">
          <UserInputForm onFormSubmit={handleFormSubmit} />
        </div>
      );
    }

    switch (activeTab) {
      case "crop-recommendation":
        return (
          <div className="container mx-auto px-4 py-8">
            {showDailySchedule && selectedCrop ? (
              <EnhancedDailySchedule 
                cropName={selectedCrop} 
                totalDuration={120} 
                onBack={() => {
                  setShowDailySchedule(false);
                  setSelectedCrop(null);
                }} 
              />
            ) : selectedCrop ? (
              <CropGuide cropName={selectedCrop} onBack={handleBackToCrops} />
            ) : userFormData ? (
              <EnhancedCropRecommendation 
                userLocation={`${userFormData.district}, ${userFormData.state}`}
                userState={userFormData.state}
                userDistrict={userFormData.district}
                userSeason={userFormData.season}
                soilType={userFormData.soilType}
                onStartPlant={handleStartPlant}
              />
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Please complete your farm details first to get personalized recommendations
                </p>
                <button 
                  onClick={() => setShowUserForm(true)}
                  className="text-primary underline hover:no-underline"
                >
                  Complete Farm Details
                </button>
              </div>
            )}
          </div>
        );
      case "farmer-forum":
        return (
          <div className="container mx-auto px-4 py-8">
            <EnhancedFarmerForum />
          </div>
        );
      case "ai-assistance":
        return (
          <div className="container mx-auto px-4 py-8">
            <AIAssistance />
          </div>
        );
      case "disease-detector":
        return (
          <div className="container mx-auto px-4 py-8">
            <DiseaseDetector />
          </div>
        );
      case "government-schemes":
        return (
          <div className="container mx-auto px-4 py-8">
            {selectedScheme ? (
              <SchemeDetails scheme={selectedScheme} onBack={handleBackToSchemes} />
            ) : (
              <GovernmentSchemes />
            )}
          </div>
        );
      case "labor-hiring":
        return (
          <div className="container mx-auto px-4 py-8">
            <LaborHiring />
          </div>
        );
      case "machinery-rental":
        return (
          <div className="container mx-auto px-4 py-8">
            <MachineryRental />
          </div>
        );
      default:
        return <HeroSection onGetStarted={handleGetStarted} />;
    }
  };

  // Listen for events
  useState(() => {
    const handleSchemeDetailsEvent = (event: any) => {
      handleSchemeDetails(event.detail);
    };
    
    const handleDailyScheduleEvent = (event: any) => {
      setSelectedCrop(event.detail.crop);
      setShowDailySchedule(true);
      setActiveTab("crop-recommendation");
    };
    
    window.addEventListener('showSchemeDetails', handleSchemeDetailsEvent);
    window.addEventListener('viewDailySchedule', handleDailyScheduleEvent);
    return () => {
      window.removeEventListener('showSchemeDetails', handleSchemeDetailsEvent);
      window.removeEventListener('viewDailySchedule', handleDailyScheduleEvent);
    };
  });

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-background">
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />
        <main>
          {renderContent()}
        </main>
      </div>
    </LanguageProvider>
  );
};

export default Index;
