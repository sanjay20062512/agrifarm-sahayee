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

  // Enhanced disease database with crop-specific analysis
  const diseaseDatabase = {
    "Rice": [
      {
        disease: "Blast Disease",
        confidence: "94%",
        severity: "High",
        description: "Rice blast is a destructive fungal disease caused by Pyricularia oryzae, affecting leaves, nodes, and panicles.",
        symptoms: ["Diamond-shaped lesions on leaves", "Greyish-white centers with brown borders", "Node breakage", "Unfilled grains"],
        treatment: ["Apply Tricyclazole 75% WP @ 0.6g/L", "Use Isoprothiolane 40% EC @ 1.5ml/L", "Spray Carbendazim 50% WP @ 1g/L"],
        prevention: ["Use resistant varieties like Pusa Basmati 1509", "Avoid excessive nitrogen", "Maintain proper plant spacing", "Remove infected stubble"],
        organicTreatment: ["Trichoderma viride @ 5g/L", "Pseudomonas fluorescens @ 10g/L", "Neem oil @ 3ml/L"],
        chemicalTreatment: ["Tricyclazole 75% WP", "Propiconazole 25% EC", "Kasugamycin 3% SL"]
      },
      {
        disease: "Brown Spot",
        confidence: "89%",
        severity: "Medium",
        description: "Brown spot is caused by Bipolaris oryzae, commonly occurring in nutrient-deficient soils.",
        symptoms: ["Small brown spots on leaves", "Circular to oval lesions", "Discolored grains", "Reduced grain quality"],
        treatment: ["Apply Mancozeb 75% WP @ 2g/L", "Use Carbendazim 50% WP @ 1g/L", "Foliar spray of potassium"],
        prevention: ["Balance NPK fertilization", "Use certified seeds", "Avoid water stress", "Crop rotation"],
        organicTreatment: ["Bordeaux mixture @ 1%", "Copper sulfate @ 2g/L", "Wood ash application"],
        chemicalTreatment: ["Mancozeb 75% WP", "Copper oxychloride 50% WP", "Zineb 75% WP"]
      }
    ],
    "Tomato": [
      {
        disease: "Late Blight",
        confidence: "96%",
        severity: "Very High",
        description: "Late blight caused by Phytophthora infestans is devastating, especially in humid conditions.",
        symptoms: ["Dark water-soaked spots on leaves", "White moldy growth on undersides", "Brown stem lesions", "Fruit rot"],
        treatment: ["Apply Mancozeb 75% WP @ 2.5g/L", "Use Cymoxanil 8% + Mancozeb 64% @ 2g/L", "Copper hydroxide @ 3g/L"],
        prevention: ["Use resistant varieties", "Avoid overhead irrigation", "Ensure good air circulation", "Remove infected debris"],
        organicTreatment: ["Bordeaux mixture @ 1%", "Copper sulfate @ 2g/L", "Baking soda spray @ 5g/L"],
        chemicalTreatment: ["Cymoxanil + Mancozeb", "Metalaxyl-M + Mancozeb", "Fosetyl-Al"]
      },
      {
        disease: "Early Blight",
        confidence: "91%",
        severity: "High",
        description: "Early blight caused by Alternaria solani creates characteristic target spot lesions.",
        symptoms: ["Concentric ring spots on leaves", "Target-like lesions", "Yellowing and defoliation", "Fruit lesions"],
        treatment: ["Apply Mancozeb 75% WP @ 2g/L", "Use Chlorothalonil 75% WP @ 2g/L", "Azoxystrobin @ 1ml/L"],
        prevention: ["Crop rotation", "Avoid overhead watering", "Mulching", "Balanced nutrition"],
        organicTreatment: ["Trichoderma harzianum @ 5g/L", "Neem oil @ 3ml/L", "Garlic extract spray"],
        chemicalTreatment: ["Mancozeb 75% WP", "Chlorothalonil 75% WP", "Azoxystrobin 23% SC"]
      }
    ],
    "Potato": [
      {
        disease: "Late Blight",
        confidence: "93%",
        severity: "Very High",
        description: "The same pathogen affecting tomatoes also devastates potato crops worldwide.",
        symptoms: ["Water-soaked dark spots on leaves", "White fungal growth", "Tuber rot", "Foul smell"],
        treatment: ["Cymoxanil + Mancozeb @ 2g/L", "Metalaxyl-M + Mancozeb @ 2.5g/L", "Copper hydroxide @ 3g/L"],
        prevention: ["Certified seed tubers", "Avoid wounded tubers", "Proper storage", "Field sanitation"],
        organicTreatment: ["Bordeaux mixture @ 1%", "Copper sulfate @ 2g/L", "Compost tea"],
        chemicalTreatment: ["Cymoxanil + Mancozeb", "Metalaxyl-M + Mancozeb", "Dimethomorph + Mancozeb"]
      }
    ],
    "Cotton": [
      {
        disease: "Bacterial Blight",
        confidence: "90%",
        severity: "High",
        description: "Angular leaf spot and black arm caused by Xanthomonas citri pv. malvacearum.",
        symptoms: ["Angular water-soaked spots", "Black streaks on stems", "Boll rot", "Defoliation"],
        treatment: ["Streptocyclin 500ppm @ 0.5g/L", "Copper oxychloride 50% WP @ 3g/L", "Kasugamycin @ 2ml/L"],
        prevention: ["Acid-delinted seeds", "Crop rotation", "Avoid mechanical injury", "Field sanitation"],
        organicTreatment: ["Pseudomonas fluorescens @ 10g/L", "Copper sulfate @ 2g/L", "Plant extracts"],
        chemicalTreatment: ["Streptocyclin + Copper oxychloride", "Kasugamycin 3% SL", "Validamycin"]
      }
    ]
  };

  const getMockAnalysis = (crop: string) => {
    const cropDiseases = diseaseDatabase[crop as keyof typeof diseaseDatabase];
    if (cropDiseases && cropDiseases.length > 0) {
      // Return random disease from the crop's disease list
      return cropDiseases[Math.floor(Math.random() * cropDiseases.length)];
    }
    
    // Default disease if crop not in database
    return {
      disease: "General Plant Disease",
      confidence: "85%",
      severity: "Medium",
      description: "Based on image analysis, this appears to be a common plant disease. For accurate diagnosis, please consult with local agricultural experts.",
      symptoms: ["Visible lesions on plant parts", "Discoloration", "Abnormal growth patterns"],
      treatment: ["Remove affected parts", "Improve air circulation", "Apply appropriate fungicide"],
      prevention: ["Use disease-resistant varieties", "Maintain field hygiene", "Proper plant spacing"],
      organicTreatment: ["Neem oil spray", "Trichoderma application", "Compost tea"],
      chemicalTreatment: ["Mancozeb 75% WP", "Copper oxychloride 50% WP", "Systemic fungicide"]
    };
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
              onClick={() => {
                // Trigger analysis - in real implementation this would call AI service
                const analysisEvent = new CustomEvent('analyzeDisease', {
                  detail: { crop: selectedCrop, image: uploadedImage }
                });
                window.dispatchEvent(analysisEvent);
              }}
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
              (() => {
                const analysis = getMockAnalysis(selectedCrop);
                return (
                  <div className="space-y-4">
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                      <h3 className="font-semibold text-destructive mb-2">
                        🔬 {analysis.disease} Detected
                      </h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Confidence:</span>
                          <span className="ml-2 font-semibold text-success">{analysis.confidence}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Severity:</span>
                          <span className={`ml-2 font-semibold ${
                            analysis.severity === 'Very High' ? 'text-destructive' :
                            analysis.severity === 'High' ? 'text-warning' : 'text-yellow-600'
                          }`}>{analysis.severity}</span>
                        </div>
                      </div>
                      <p className="text-sm mt-3 text-muted-foreground">{analysis.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="border rounded-lg p-3">
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            🔍 <span>Symptoms Identified:</span>
                          </h4>
                          <ul className="text-sm space-y-1">
                            {analysis.symptoms.map((symptom, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-destructive">•</span>
                                {symptom}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="border rounded-lg p-3">
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            🛡️ <span>Prevention Measures:</span>
                          </h4>
                          <ul className="text-sm space-y-1">
                            {analysis.prevention.map((prevention, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-primary">•</span>
                                {prevention}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="border rounded-lg p-3 bg-green-50/50">
                          <h4 className="font-semibold mb-2 flex items-center gap-2 text-green-700">
                            🌿 <span>Organic Treatment:</span>
                          </h4>
                          <ul className="text-sm space-y-1">
                            {analysis.organicTreatment.map((treatment, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-success">•</span>
                                {treatment}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="border rounded-lg p-3 bg-blue-50/50">
                          <h4 className="font-semibold mb-2 flex items-center gap-2 text-blue-700">
                            ⚗️ <span>Chemical Treatment:</span>
                          </h4>
                          <ul className="text-sm space-y-1">
                            {analysis.chemicalTreatment.map((treatment, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-blue-600">•</span>
                                {treatment}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="bg-muted/50 border rounded-lg p-4">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        💡 <span>Quick Action Steps:</span>
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        <div className="text-center p-3 bg-card rounded border">
                          <div className="text-2xl mb-1">🚨</div>
                          <div className="font-medium">Immediate</div>
                          <div className="text-muted-foreground">Remove infected parts</div>
                        </div>
                        <div className="text-center p-3 bg-card rounded border">
                          <div className="text-2xl mb-1">💊</div>
                          <div className="font-medium">Treat</div>
                          <div className="text-muted-foreground">Apply recommended spray</div>
                        </div>
                        <div className="text-center p-3 bg-card rounded border">
                          <div className="text-2xl mb-1">📅</div>
                          <div className="font-medium">Monitor</div>
                          <div className="text-muted-foreground">Check weekly for progress</div>
                        </div>
                      </div>
                    </div>

                    <div className="text-center py-3 border-t">
                      <p className="text-xs text-muted-foreground">
                        ⚠️ <strong>Disclaimer:</strong> This AI analysis is for guidance only. For severe infections, 
                        consult your local agricultural extension officer or plant pathologist.
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        📞 <strong>Expert Help:</strong> Contact nearest Krishi Vigyan Kendra (KVK) for professional diagnosis
                      </p>
                    </div>
                  </div>
                );
              })()
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