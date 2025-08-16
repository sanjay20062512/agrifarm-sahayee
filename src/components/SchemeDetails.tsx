import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  ExternalLink, 
  IndianRupee, 
  Calendar, 
  MapPin, 
  FileText,
  Users,
  CheckCircle
} from "lucide-react";

interface SchemeDetailsProps {
  scheme: {
    id: number;
    name: string;
    description: string;
    benefit: string;
    eligibility: string;
    deadline: string;
    status: string;
    category: string;
    states: string;
  };
  onBack: () => void;
}

export const SchemeDetails = ({ scheme, onBack }: SchemeDetailsProps) => {
  const getSchemeDetails = (schemeName: string) => {
    const details: Record<string, any> = {
      "PM-KISAN": {
        fullDescription: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN) is a Central Sector Scheme launched on 24th February 2019 to provide income support to all landholding farmers' families in the country to supplement their financial needs for procuring various inputs related to agriculture and allied activities as well as domestic needs.",
        objectives: [
          "Supplement financial needs of farmers for agriculture inputs",
          "Support domestic requirements of farmers",
          "Enhance agricultural productivity",
          "Ensure sustainable income for farmers"
        ],
        benefits: [
          "₹6,000 per year in three equal installments",
          "Direct benefit transfer to bank accounts",
          "No processing fee or charges",
          "Automatic renewal every year"
        ],
        eligibilityDetails: [
          "All landholding farmer families",
          "Families with cultivable land holding",
          "Both small and marginal farmers covered",
          "Institutional landholders excluded"
        ],
        requiredDocuments: [
          "Aadhaar Card",
          "Bank Account Details",
          "Land ownership documents",
          "Mobile number for OTP verification"
        ],
        applicationProcess: [
          "Visit PM-KISAN official website",
          "Click on 'New Farmer Registration'",
          "Fill required details",
          "Upload documents",
          "Submit application and get registration number"
        ]
      },
      "Pradhan Mantri Fasal Bima Yojana": {
        fullDescription: "PMFBY provides comprehensive coverage against crop loss helping to stabilize farmers' income and encouraging farmers to adopt innovative and modern agricultural practices.",
        objectives: [
          "Provide insurance coverage for crop losses",
          "Stabilize farmers' income",
          "Encourage modern agricultural practices",
          "Ensure credit flow in agriculture sector"
        ],
        benefits: [
          "Coverage up to ₹2 lakh per farmer",
          "Premium support from government",
          "Quick settlement of claims",
          "Coverage for all crops including commercial/horticultural crops"
        ],
        eligibilityDetails: [
          "All farmers (landowner, tenant, sharecropper)",
          "Farmers growing notified crops",
          "Must have insurable interest in crop",
          "Loanee and non-loanee farmers eligible"
        ],
        requiredDocuments: [
          "Farmer's identity proof",
          "Bank account details",
          "Land records/tenancy agreement",
          "Sowing certificate from local authorities"
        ],
        applicationProcess: [
          "Apply through nearest bank/insurance company",
          "Submit application before cut-off date",
          "Pay farmer's share of premium",
          "Get policy document",
          "Report crop loss immediately if occurs"
        ]
      }
      // Add more schemes as needed
    };

    return details[schemeName] || {
      fullDescription: scheme.description,
      objectives: ["Detailed information will be available on official website"],
      benefits: [scheme.benefit],
      eligibilityDetails: [scheme.eligibility],
      requiredDocuments: ["As per official guidelines"],
      applicationProcess: ["Visit official website for detailed process"]
    };
  };

  const details = getSchemeDetails(scheme.name);

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
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Schemes
        </Button>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-foreground">{scheme.name}</h1>
          <Badge variant="secondary" className={getCategoryColor(scheme.category)}>
            {scheme.category}
          </Badge>
        </div>
      </div>

      {/* Quick Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <IndianRupee className="w-8 h-8 text-success mx-auto mb-2" />
            <h3 className="font-semibold text-success">{scheme.benefit}</h3>
            <p className="text-sm text-muted-foreground">Financial Benefit</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="w-8 h-8 text-primary mx-auto mb-2" />
            <h3 className="font-semibold">{scheme.deadline}</h3>
            <p className="text-sm text-muted-foreground">Application Deadline</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <MapPin className="w-8 h-8 text-accent mx-auto mb-2" />
            <h3 className="font-semibold">{scheme.states}</h3>
            <p className="text-sm text-muted-foreground">Coverage Area</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Description */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            About This Scheme
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{details.fullDescription}</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Objectives */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              Key Objectives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {details.objectives.map((objective: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-success">•</span>
                  <span className="text-sm">{objective}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-success" />
              Scheme Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {details.benefits.map((benefit: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-success">•</span>
                  <span className="text-sm">{benefit}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Eligibility */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Detailed Eligibility
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {details.eligibilityDetails.map((criteria: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span className="text-sm">{criteria}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Required Documents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-accent" />
              Required Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {details.requiredDocuments.map((doc: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span className="text-sm">{doc}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Application Process */}
      <Card>
        <CardHeader>
          <CardTitle>How to Apply</CardTitle>
          <CardDescription>Step-by-step application process</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {details.applicationProcess.map((step: string, index: number) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </div>
                <span className="text-sm">{step}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <Button 
          variant="nav" 
          size="lg"
          onClick={() => {
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
          Apply Now on Official Website
          <ExternalLink className="w-4 h-4 ml-2" />
        </Button>
        <Button variant="outline" size="lg" onClick={onBack}>
          View Other Schemes
        </Button>
      </div>
    </div>
  );
};