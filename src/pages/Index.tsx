import { useState } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { UserInputForm } from "@/components/UserInputForm";
import { CropRecommendation } from "@/components/CropRecommendation";
import { FarmerForum } from "@/components/FarmerForum";
import { AIAssistance } from "@/components/AIAssistance";
import { DiseaseDetector } from "@/components/DiseaseDetector";
import { GovernmentSchemes } from "@/components/GovernmentSchemes";

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

  const handleFormSubmit = (data: FormData) => {
    setUserFormData(data);
    setActiveTab("crop-recommendation");
    setShowUserForm(false);
  };

  const handleGetStarted = () => {
    setShowUserForm(true);
    setActiveTab("home");
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
            {userFormData ? (
              <CropRecommendation 
                userLocation={`${userFormData.district}, ${userFormData.state}`}
                userSeason={userFormData.season}
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
            <FarmerForum />
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
            <GovernmentSchemes />
          </div>
        );
      default:
        return <HeroSection onGetStarted={handleGetStarted} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main>
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
