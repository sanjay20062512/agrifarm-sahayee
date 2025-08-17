import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Calendar, Layers, Ruler } from "lucide-react";
import { useLanguage } from "./LanguageContext";

interface UserInputFormProps {
  onFormSubmit: (data: FormData) => void;
}

interface FormData {
  state: string;
  district: string;
  season: string;
  soilType: string;
  farmSize: string;
  farmUnit: string;
}

export const UserInputForm = ({ onFormSubmit }: UserInputFormProps) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<FormData>({
    state: "",
    district: "",
    season: "",
    soilType: "",
    farmSize: "",
    farmUnit: "acre"
  });

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];

  const soilTypes = [
    "Black Soil (Regur)", "Red Soil", "Alluvial Soil", "Sandy Soil", 
    "Clayey Soil", "Laterite Soil", "Mountain Soil", "Saline Soil"
  ];

  const seasons = [
    { value: "Kharif", label: t("season.kharif") },
    { value: "Rabi", label: t("season.rabi") },
    { value: "Zaid", label: t("season.zaid") }
  ];

  // State-based districts mapping
  const stateDistricts: { [key: string]: string[] } = {
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Vellore", "Thoothukudi", "Dindigul", "Thanjavur"],
    "Karnataka": ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum", "Gulbarga", "Davangere", "Bellary", "Bijapur", "Shimoga"],
    "Andhra Pradesh": ["Hyderabad", "Visakhapatnam", "Vijayawada", "Guntur", "Warangal", "Nellore", "Kurnool", "Rajahmundry", "Tirupati", "Kakinada"],
    "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Palakkad", "Alappuzha", "Malappuram", "Kannur", "Kasaragod"],
    "Maharashtra": ["Mumbai", "Pune", "Nashik", "Aurangabad", "Solapur", "Nagpur", "Kolhapur", "Amravati", "Sangli", "Satara"],
    "Punjab": ["Chandigarh", "Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Firozpur", "Hoshiarpur", "Gurdaspur"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi", "Meerut", "Allahabad", "Bareilly", "Aligarh", "Moradabad", "Saharanpur"],
    "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Bardhaman", "Malda", "Baharampur", "Habra", "Kharagpur"],
    "Rajasthan": ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer", "Udaipur", "Bhilwara", "Alwar", "Bharatpur", "Pali"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Junagadh", "Gandhinagar", "Anand", "Navsari"]
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.state && formData.district && formData.season && formData.soilType && formData.farmSize) {
      onFormSubmit(formData);
    }
  };

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-crop">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-foreground flex items-center justify-center gap-2">
          <MapPin className="w-6 h-6 text-primary" />
          {t("form.title")}
        </CardTitle>
        <CardDescription>
          {t("form.description")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="state" className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                {t("form.state")}
              </Label>
              <Select value={formData.state} onValueChange={(value) => updateFormData("state", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your state" />
                </SelectTrigger>
                <SelectContent>
                  {indianStates.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="district">{t("form.district")}</Label>
              <Select value={formData.district} onValueChange={(value) => updateFormData("district", value)} disabled={!formData.state}>
                <SelectTrigger>
                  <SelectValue placeholder={formData.state ? "Select your district" : "Select state first"} />
                </SelectTrigger>
                <SelectContent>
                  {formData.state && stateDistricts[formData.state]?.map((district) => (
                    <SelectItem key={district} value={district}>
                      {district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Season */}
          <div className="space-y-2">
            <Label htmlFor="season" className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              {t("form.season")}
            </Label>
            <Select value={formData.season} onValueChange={(value) => updateFormData("season", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select cropping season" />
              </SelectTrigger>
              <SelectContent>
                {seasons.map((season) => (
                  <SelectItem key={season.value} value={season.value}>
                    {season.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Soil Type */}
          <div className="space-y-2">
            <Label htmlFor="soilType" className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" />
              {t("form.soil-type")}
            </Label>
            <Select value={formData.soilType} onValueChange={(value) => updateFormData("soilType", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select your soil type" />
              </SelectTrigger>
              <SelectContent>
                {soilTypes.map((soil) => (
                  <SelectItem key={soil} value={soil}>
                    {soil}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Farm Size */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Ruler className="w-4 h-4 text-primary" />
              {t("form.farm-size")}
            </Label>
            <div className="flex gap-2">
              <Input
                placeholder="Enter size"
                value={formData.farmSize}
                onChange={(e) => updateFormData("farmSize", e.target.value)}
                className="flex-1"
                type="number"
                min="0"
                step="0.1"
              />
              <Select value={formData.farmUnit} onValueChange={(value) => updateFormData("farmUnit", value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="acre">Acre</SelectItem>
                  <SelectItem value="hectare">Hectare</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            type="submit" 
            variant="nav" 
            size="lg" 
            className="w-full"
            disabled={!formData.state || !formData.district || !formData.season || !formData.soilType || !formData.farmSize}
          >
            {t("form.submit")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};