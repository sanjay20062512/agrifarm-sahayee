import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Calendar, Layers, Ruler } from "lucide-react";

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

  const seasons = ["Kharif", "Rabi", "Zaid"];

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
          Farm Details Required
        </CardTitle>
        <CardDescription>
          Please provide your farming details to get personalized crop recommendations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="state" className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                State
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
              <Label htmlFor="district">District</Label>
              <Input
                id="district"
                placeholder="Enter your district"
                value={formData.district}
                onChange={(e) => updateFormData("district", e.target.value)}
              />
            </div>
          </div>

          {/* Season */}
          <div className="space-y-2">
            <Label htmlFor="season" className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Cropping Season
            </Label>
            <Select value={formData.season} onValueChange={(value) => updateFormData("season", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select cropping season" />
              </SelectTrigger>
              <SelectContent>
                {seasons.map((season) => (
                  <SelectItem key={season} value={season}>
                    {season}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Soil Type */}
          <div className="space-y-2">
            <Label htmlFor="soilType" className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" />
              Soil Type
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
              Farm Size
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
            Get Crop Recommendations
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};