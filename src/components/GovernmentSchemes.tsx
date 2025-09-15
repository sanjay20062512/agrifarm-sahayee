import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, ExternalLink, IndianRupee, Calendar, MapPin } from "lucide-react";
import { useLanguage } from "./LanguageContext";

export const GovernmentSchemes = () => {
  const { t } = useLanguage();
  const schemes = [
    {
      id: 1,
      name: "PM-KISAN",
      description: "Direct income support to farmer families",
      benefit: "₹6,000 per year",
      eligibility: "All landholding farmer families",
      deadline: "Ongoing",
      status: "Active",
      category: "Income Support",
      states: "All India",
      crops: "All crops",
      soilTypes: "All soil types",
      aiMatch: 95
    },
    {
      id: 2,
      name: "Pradhan Mantri Fasal Bima Yojana",
      description: "Crop insurance scheme for farmers",
      benefit: "Up to ₹2 lakh coverage",
      eligibility: "All farmers (landowner & tenant)",
      deadline: "Seasonal",
      status: "Active",
      category: "Insurance",
      states: "All India",
      crops: "Notified crops",
      soilTypes: "All soil types",
      aiMatch: 90
    },
    {
      id: 3,
      name: "KCC - Kisan Credit Card",
      description: "Agricultural credit at concessional rates",
      benefit: "Up to ₹3 lakh at 7% interest",
      eligibility: "Farmers, SHGs, JLGs",
      deadline: "Ongoing",
      status: "Active",
      category: "Credit",
      states: "All India",
      crops: "All crops",
      soilTypes: "All soil types",
      aiMatch: 88
    },
    {
      id: 4,
      name: "PM Micro Irrigation Scheme",
      description: "Water conservation and precise irrigation",
      benefit: "Up to 55% subsidy",
      eligibility: "All categories of farmers",
      deadline: "March 2025",
      status: "Active",
      category: "Water Conservation",
      states: "All India",
      crops: "Water-intensive crops",
      soilTypes: "Sandy, loamy soils",
      aiMatch: 85
    },
    {
      id: 5,
      name: "National Agriculture Market (e-NAM)",
      description: "Online trading platform for agricultural commodities",
      benefit: "Better price discovery",
      eligibility: "Registered farmers",
      deadline: "Ongoing",
      status: "Active",
      category: "Marketing",
      states: "All India",
      crops: "Marketable crops",
      soilTypes: "All soil types",
      aiMatch: 75
    },
    {
      id: 6,
      name: "Soil Health Card Scheme",
      description: "Soil testing and health cards for farmers",
      benefit: "Free soil testing",
      eligibility: "All farmers",
      deadline: "Ongoing",
      status: "Active",
      category: "Soil Health",
      states: "All India",
      crops: "All crops",
      soilTypes: "All soil types",
      aiMatch: 92
    },
    {
      id: 7,
      name: "Pradhan Mantri Krishi Sinchayee Yojana",
      description: "Enhancing water use efficiency",
      benefit: "Up to 80% subsidy",
      eligibility: "Small & marginal farmers",
      deadline: "Ongoing",
      status: "Active",
      category: "Irrigation",
      states: "All India",
      crops: "Water-intensive crops",
      soilTypes: "All soil types",
      aiMatch: 82
    },
    {
      id: 8,
      name: "National Beekeeping & Honey Mission",
      description: "Promotion of beekeeping for honey production",
      benefit: "60% subsidy on equipment",
      eligibility: "Farmers, SHGs, FPOs",
      deadline: "March 2025",
      status: "Active",
      category: "Allied Agriculture",
      states: "All India",
      crops: "Flowering crops",
      soilTypes: "All soil types",
      aiMatch: 70
    },
    {
      id: 9,
      name: "Sub-Mission on Agricultural Mechanization",
      description: "Financial assistance for farm machinery",
      benefit: "40-50% subsidy",
      eligibility: "Individual farmers, CHCs, FPOs",
      deadline: "Ongoing",
      status: "Active",
      category: "Mechanization",
      states: "All India",
      crops: "Field crops",
      soilTypes: "All soil types",
      aiMatch: 78
    },
    {
      id: 10,
      name: "National Horticulture Mission",
      description: "Holistic development of horticulture",
      benefit: "35-50% subsidy",
      eligibility: "Horticulture farmers",
      deadline: "Ongoing",
      status: "Active",
      category: "Horticulture",
      states: "All India",
      crops: "Fruits, vegetables, spices",
      soilTypes: "Well-drained soils",
      aiMatch: 80
    },
    {
      id: 11,
      name: "Pradhan Mantri Formalisation of Micro Food Processing Enterprises",
      description: "Support to micro food processing enterprises",
      benefit: "Up to ₹10 lakh credit",
      eligibility: "Individual, SHGs, FPOs, Cooperatives",
      deadline: "March 2025",
      status: "Active",
      category: "Food Processing",
      states: "All India",
      crops: "Processable crops",
      soilTypes: "All soil types",
      aiMatch: 65
    },
    {
      id: 12,
      name: "Paramparagat Krishi Vikas Yojana",
      description: "Promotion of organic farming",
      benefit: "₹50,000 per hectare",
      eligibility: "Organic farming groups",
      deadline: "Ongoing",
      status: "Active",
      category: "Organic Farming",
      states: "All India",
      crops: "Organic crops",
      soilTypes: "Chemical-free soils",
      aiMatch: 88
    },
    {
      id: 13,
      name: "Agriculture Infrastructure Fund",
      description: "Financing facility for agriculture infrastructure",
      benefit: "Up to ₹2 crore loan",
      eligibility: "Farmers, PACS, FPOs, Agri-entrepreneurs",
      deadline: "March 2026",
      status: "Active",
      category: "Infrastructure",
      states: "All India",
      crops: "All crops",
      soilTypes: "All soil types",
      aiMatch: 72
    },
    {
      id: 14,
      name: "Formation & Promotion of FPOs",
      description: "Supporting Farmer Producer Organizations",
      benefit: "₹18.75 lakh per FPO",
      eligibility: "Groups of farmers",
      deadline: "Ongoing",
      status: "Active",
      category: "Farmer Organizations",
      states: "All India",
      crops: "All crops",
      soilTypes: "All soil types",
      aiMatch: 75
    },
    {
      id: 15,
      name: "Digital Agriculture Mission",
      description: "Use of modern technologies in farming",
      benefit: "Technology support",
      eligibility: "Tech-savvy farmers",
      deadline: "Ongoing",
      status: "Active",
      category: "Technology",
      states: "All India",
      crops: "All crops",
      soilTypes: "All soil types",
      aiMatch: 68
    }
  ];

  // AI-powered scheme matching function
  const getAIMatchedSchemes = (userLocation: string, userSoil: string, userCrop: string) => {
    return schemes
      .map(scheme => {
        let matchScore = scheme.aiMatch;
        
        // Boost score based on specific criteria
        if (scheme.crops.toLowerCase().includes(userCrop.toLowerCase()) || scheme.crops === "All crops") {
          matchScore += 5;
        }
        if (scheme.soilTypes.toLowerCase().includes(userSoil.toLowerCase()) || scheme.soilTypes === "All soil types") {
          matchScore += 3;
        }
        if (scheme.states === "All India" || scheme.states.toLowerCase().includes(userLocation.toLowerCase())) {
          matchScore += 2;
        }
        
        return { ...scheme, finalScore: Math.min(matchScore, 100) };
      })
      .sort((a, b) => b.finalScore - a.finalScore);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Income Support": return "bg-success text-success-foreground";
      case "Insurance": return "bg-warning text-warning-foreground";
      case "Credit": return "bg-primary text-primary-foreground";
      case "Water Conservation": return "bg-blue-500 text-white";
      case "Marketing": return "bg-purple-500 text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground flex items-center justify-center gap-2">
          <Building2 className="w-8 h-8 text-primary" />
          {t("schemes.title")}
        </h2>
        <p className="text-muted-foreground">
          {t("schemes.description")}
        </p>
      </div>

      {/* AI Scheme Matcher */}
      <Card className="mb-6 bg-gradient-to-r from-primary/5 to-accent/5">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            🤖 {t("schemes.ai-recommendations")}
          </h3>
          <p className="text-muted-foreground mb-4">
            Get personalized scheme recommendations based on your location, soil type, and crop selection
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-card rounded-lg">
              <div className="text-2xl mb-2">🎯</div>
              <div className="font-semibold">{t("schemes.personalized")}</div>
              <div className="text-sm text-muted-foreground">AI analyzes your farm profile</div>
            </div>
            <div className="text-center p-4 bg-card rounded-lg">
              <div className="text-2xl mb-2">📊</div>
              <div className="font-semibold">{t("schemes.eligibility")}</div>
              <div className="text-sm text-muted-foreground">Shows your match percentage</div>
            </div>
            <div className="text-center p-4 bg-card rounded-lg">
              <div className="text-2xl mb-2">⚡</div>
              <div className="font-semibold">{t("schemes.real-time")}</div>
              <div className="text-sm text-muted-foreground">Latest scheme information</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {schemes.map((scheme) => (
          <Card key={scheme.id} className="hover:shadow-crop transition-all duration-300 relative">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-lg">{scheme.name}</CardTitle>
                <div className="flex flex-col gap-2">
                  <Badge variant="secondary" className={getCategoryColor(scheme.category)}>
                    {scheme.category}
                  </Badge>
                  {scheme.aiMatch >= 85 && (
                    <Badge variant="secondary" className="bg-success text-success-foreground text-xs">
                      🎯 {scheme.aiMatch}% Match
                    </Badge>
                  )}
                </div>
              </div>
              <CardDescription>{scheme.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t("schemes.benefit")}:</span>
                  <div className="flex items-center text-success font-semibold">
                    <IndianRupee className="w-3 h-3" />
                    <span className="text-sm">{scheme.benefit}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t("schemes.deadline")}:</span>
                  <div className="flex items-center text-foreground">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span className="text-sm">{scheme.deadline}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t("schemes.coverage")}:</span>
                  <div className="flex items-center text-foreground">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span className="text-sm">{scheme.states}</span>
                  </div>
                </div>

                <div className="border-t pt-2">
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div><strong>{t("schemes.crops")}:</strong> {scheme.crops}</div>
                    <div><strong>{t("schemes.soil-types")}:</strong> {scheme.soilTypes}</div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-3">
                <p className="text-xs text-muted-foreground mb-2">
                  <strong>{t("schemes.eligibility-label")}:</strong> {scheme.eligibility}
                </p>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="nav" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => {
                    // Redirect to official government website
                    const officialUrls: Record<string, string> = {
                      "PM-KISAN": "https://pmkisan.gov.in/",
                      "Pradhan Mantri Fasal Bima Yojana": "https://pmfby.gov.in/",
                      "KCC - Kisan Credit Card": "https://www.nabard.org/auth/writereaddata/tender/1608180417KCC%20Guidelines%202018-19.pdf",
                      "PM Micro Irrigation Scheme": "https://pmksy.gov.in/",
                      "National Agriculture Market (e-NAM)": "https://enam.gov.in/web/",
                      "Soil Health Card Scheme": "https://soilhealth.dac.gov.in/",
                      "Pradhan Mantri Krishi Sinchayee Yojana": "https://pmksy.gov.in/",
                      "National Beekeeping & Honey Mission": "https://nbhm.hon.gov.in/",
                      "Sub-Mission on Agricultural Mechanization": "https://agrimachinery.nic.in/",
                      "National Horticulture Mission": "https://nhm.nic.in/",
                      "Pradhan Mantri Formalisation of Micro Food Processing Enterprises": "https://pmfme.mofpi.gov.in/",
                      "Paramparagat Krishi Vikas Yojana": "https://pgsindia-ncof.gov.in/",
                      "Agriculture Infrastructure Fund": "https://www.agriinfra.dac.gov.in/",
                      "Formation & Promotion of FPOs": "https://sfac.in/",
                      "Digital Agriculture Mission": "https://agricoop.nic.in/"
                    };
                    const url = officialUrls[scheme.name] || "https://agricoop.nic.in/";
                    window.open(url, '_blank');
                  }}
                >
                  {t("schemes.apply-now")}
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    // Show detailed scheme information
                    const detailsEvent = new CustomEvent('showSchemeDetails', {
                      detail: scheme
                    });
                    window.dispatchEvent(detailsEvent);
                  }}
                >
                  {t("schemes.details")}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-earth">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-bold mb-2">{t("schemes.help")}</h3>
          <p className="text-muted-foreground mb-4">
            {t("schemes.contact-info")}
          </p>
          <Button variant="nav">
            {t("schemes.find-csc")}
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};