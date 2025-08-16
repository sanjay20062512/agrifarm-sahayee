import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Camera, Upload, Scan, AlertTriangle } from "lucide-react";

export const DiseaseDetector = () => {
  const [selectedCrop, setSelectedCrop] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const crops = [
    "Rice", "Wheat", "Tomato", "Potato", "Cotton", "Sugarcane", 
    "Onion", "Corn", "Soybean", "Chili", "Brinjal", "Okra"
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const mockAnalysis = {
    disease: "Late Blight",
    confidence: "92%",
    severity: "High",
    description: "Late blight is a serious disease affecting tomato plants, especially in humid conditions.",
    symptoms: [
      "Dark, water-soaked spots on leaves",
      "White fuzzy growth on leaf undersides",
      "Brown lesions on stems and fruits"
    ],
    treatment: [
      "Apply copper-based fungicide immediately",
      "Remove and destroy affected plant parts",
      "Improve air circulation around plants",
      "Avoid overhead watering"
    ],
    prevention: [
      "Use resistant varieties",
      "Ensure proper spacing between plants",
      "Apply preventive fungicide sprays",
      "Monitor weather conditions regularly"
    ]
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground flex items-center justify-center gap-2">
          <Camera className="w-8 h-8 text-primary" />
          AI Disease Detector
        </h2>
        <p className="text-muted-foreground">
          Upload a photo of your crop to detect diseases and get treatment recommendations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Crop Image</CardTitle>
            <CardDescription>
              Select your crop type and upload a clear photo showing the affected area
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="crop-select">Select Crop Type</Label>
              <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose your crop" />
                </SelectTrigger>
                <SelectContent>
                  {crops.map((crop) => (
                    <SelectItem key={crop} value={crop}>
                      {crop}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image-upload">Upload Image</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                {uploadedImage ? (
                  <div className="space-y-4">
                    <img 
                      src={uploadedImage} 
                      alt="Uploaded crop" 
                      className="max-w-full h-48 object-cover mx-auto rounded-lg"
                    />
                    <Button variant="outline" onClick={() => setUploadedImage(null)}>
                      Remove Image
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="w-12 h-12 text-muted-foreground mx-auto" />
                    <div>
                      <p className="text-muted-foreground mb-2">
                        Drag and drop an image or click to browse
                      </p>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Label htmlFor="image-upload" className="cursor-pointer">
                        <Button variant="outline" asChild>
                          <span>Choose File</span>
                        </Button>
                      </Label>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Button 
              variant="nav" 
              size="lg" 
              className="w-full"
              disabled={!selectedCrop || !uploadedImage}
            >
              <Scan className="w-4 h-4 mr-2" />
              Analyze Disease
            </Button>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              Disease Analysis
            </CardTitle>
            <CardDescription>
              AI-powered diagnosis and treatment recommendations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {uploadedImage && selectedCrop ? (
              <div className="space-y-4">
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                  <h3 className="font-semibold text-destructive mb-2">
                    {mockAnalysis.disease} Detected
                  </h3>
                  <div className="flex justify-between text-sm">
                    <span>Confidence: {mockAnalysis.confidence}</span>
                    <span>Severity: {mockAnalysis.severity}</span>
                  </div>
                  <p className="text-sm mt-2">{mockAnalysis.description}</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold mb-2">Symptoms:</h4>
                    <ul className="text-sm space-y-1">
                      {mockAnalysis.symptoms.map((symptom, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-destructive">•</span>
                          {symptom}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Treatment:</h4>
                    <ul className="text-sm space-y-1">
                      {mockAnalysis.treatment.map((treatment, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-success">•</span>
                          {treatment}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Prevention:</h4>
                    <ul className="text-sm space-y-1">
                      {mockAnalysis.prevention.map((prevention, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-primary">•</span>
                          {prevention}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Upload an image and select crop type to get disease analysis</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};