import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, ExternalLink, IndianRupee, Calendar, MapPin } from "lucide-react";

export const GovernmentSchemes = () => {
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
      states: "All India"
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
      states: "All India"
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
      states: "All India"
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
      states: "All India"
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
      states: "All India"
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
      states: "All India"
    }
  ];

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
          Government Schemes
        </h2>
        <p className="text-muted-foreground">
          Latest subsidies, loans, insurance and support schemes for Indian farmers
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {schemes.map((scheme) => (
          <Card key={scheme.id} className="hover:shadow-crop transition-all duration-300">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-lg">{scheme.name}</CardTitle>
                <Badge variant="secondary" className={getCategoryColor(scheme.category)}>
                  {scheme.category}
                </Badge>
              </div>
              <CardDescription>{scheme.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Benefit:</span>
                  <div className="flex items-center text-success font-semibold">
                    <IndianRupee className="w-3 h-3" />
                    <span className="text-sm">{scheme.benefit}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Deadline:</span>
                  <div className="flex items-center text-foreground">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span className="text-sm">{scheme.deadline}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Coverage:</span>
                  <div className="flex items-center text-foreground">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span className="text-sm">{scheme.states}</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-3">
                <p className="text-xs text-muted-foreground mb-2">
                  <strong>Eligibility:</strong> {scheme.eligibility}
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
                      "Soil Health Card Scheme": "https://soilhealth.dac.gov.in/"
                    };
                    const url = officialUrls[scheme.name] || "https://agricoop.nic.in/";
                    window.open(url, '_blank');
                  }}
                >
                  Apply Now
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
                  Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-earth">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-bold mb-2">Need Help with Applications?</h3>
          <p className="text-muted-foreground mb-4">
            Contact your local agriculture officer or visit the nearest Common Service Center (CSC)
          </p>
          <Button variant="nav">
            Find Nearest CSC
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};