import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Scan, AlertTriangle, Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const DiseaseDetector = () => {
  const { toast } = useToast();
  const [selectedCrop, setSelectedCrop] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [diagnosis, setDiagnosis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const crops = [
    "Rice", "Wheat", "Tomato", "Potato", "Cotton", "Sugarcane", 
    "Onion", "Corn", "Soybean", "Chili", "Brinjal", "Okra",
    "Mango", "Banana", "Grapes", "Apple", "Coconut"
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

  const analyzeDisease = async () => {
    if (!selectedCrop || (!symptoms && !uploadedImage)) {
      toast({
        title: "Missing Information",
        description: "Please select a crop and provide symptoms or upload an image.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    setDiagnosis(null);

    try {
      let imageDescription = "";
      if (uploadedImage) {
        imageDescription = "Farmer has uploaded an image showing visual symptoms on the plant.";
      }

      const { data, error } = await supabase.functions.invoke('disease-detection', {
        body: {
          cropType: selectedCrop,
          symptoms: symptoms,
          imageDescription: imageDescription
        }
      });

      if (error) {
        console.error('Disease detection error:', error);
        throw error;
      }

      setDiagnosis(data.diagnosis || "Unable to diagnose. Please provide more details.");
      
      toast({
        title: "Analysis Complete",
        description: "Disease diagnosis ready!",
      });

    } catch (error: any) {
      console.error('Error analyzing disease:', error);
      
      let errorMessage = "Failed to analyze. Please try again.";
      
      if (error.message?.includes('429')) {
        errorMessage = "Too many requests. Please wait a moment.";
      } else if (error.message?.includes('402')) {
        errorMessage = "Service temporarily unavailable.";
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Card className="shadow-lg border-primary/20">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Scan className="h-6 w-6 text-primary" />
            AI-Powered Disease Detection
          </CardTitle>
          <CardDescription>
            Get instant, accurate disease diagnosis using advanced AI. Upload images or describe symptoms.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-6">
              <div>
                <Label htmlFor="crop-select" className="text-base font-semibold">
                  Select Crop Type
                </Label>
                <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                  <SelectTrigger id="crop-select" className="mt-2">
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

              <div>
                <Label htmlFor="symptoms" className="text-base font-semibold">
                  Describe Symptoms
                </Label>
                <Textarea
                  id="symptoms"
                  placeholder="Describe what you observe: leaf spots, discoloration, wilting, etc."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="mt-2 min-h-[120px]"
                />
              </div>

              <div>
                <Label className="text-base font-semibold mb-2 block">
                  Upload Plant Image (Optional)
                </Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    {uploadedImage ? (
                      <div className="space-y-2">
                        <CheckCircle2 className="h-8 w-8 text-primary mx-auto" />
                        <p className="text-sm text-muted-foreground">Image uploaded successfully</p>
                        <img
                          src={uploadedImage}
                          alt="Uploaded crop"
                          className="max-h-32 rounded-lg mx-auto"
                        />
                      </div>
                    ) : (
                      <>
                        <Camera className="h-8 w-8 text-muted-foreground" />
                        <div className="text-sm text-muted-foreground">
                          <span className="text-primary font-medium">Click to upload</span> or drag and drop
                        </div>
                      </>
                    )}
                  </label>
                </div>
              </div>

              <Button 
                onClick={analyzeDisease} 
                className="w-full"
                size="lg"
                disabled={isAnalyzing || !selectedCrop}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Scan className="mr-2 h-5 w-5" />
                    Analyze Disease
                  </>
                )}
              </Button>
            </div>

            {/* Results Section */}
            <div>
              <Card className="border-primary/20 bg-muted/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-primary" />
                    AI Diagnosis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!diagnosis && !isAnalyzing && (
                    <div className="text-center py-12">
                      <Scan className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Select a crop and provide symptoms to get started
                      </p>
                    </div>
                  )}
                  
                  {isAnalyzing && (
                    <div className="text-center py-12">
                      <Loader2 className="h-16 w-16 text-primary animate-spin mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        AI is analyzing your crop symptoms...
                      </p>
                    </div>
                  )}

                  {diagnosis && !isAnalyzing && (
                    <div className="space-y-4">
                      <div className="bg-card rounded-lg p-4 border border-border">
                        <div className="prose prose-sm max-w-none">
                          <div className="whitespace-pre-line text-sm">
                            {diagnosis}
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                        <p className="text-xs text-muted-foreground">
                          💡 <strong>Note:</strong> This is an AI-powered diagnosis. For severe cases, 
                          consult with local agricultural experts or extension officers.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
