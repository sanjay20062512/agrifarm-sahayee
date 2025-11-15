import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sprout, Bug, Droplets, Leaf, Shield, Sparkles, TreePine, Heart, Award, TrendingUp, Users, Globe, MapPin, Phone, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const OrganicFarming = () => {
  const principles = [
    {
      title: "Soil Health & Fertility",
      description: "Build living soil ecosystem through composting, crop rotation, and natural amendments. Use green manures, vermicompost, and biochar to enhance soil structure and microbial activity.",
      icon: Sprout,
      practices: ["Composting", "Crop Rotation", "Green Manuring", "Mulching"]
    },
    {
      title: "Biodiversity Conservation",
      description: "Promote diverse ecosystems with mixed cropping, hedge rows, and beneficial insect habitats. Maintain genetic diversity through traditional seed varieties.",
      icon: TreePine,
      practices: ["Intercropping", "Companion Planting", "Hedge Rows", "Native Seeds"]
    },
    {
      title: "Natural Pest Management",
      description: "Use biological controls, botanical pesticides, and integrated pest management. Encourage natural predators and maintain ecological balance.",
      icon: Bug,
      practices: ["Neem Spray", "Pheromone Traps", "Beneficial Insects", "Crop Barriers"]
    },
    {
      title: "Water Conservation",
      description: "Implement efficient irrigation, rainwater harvesting, and soil moisture retention. Use drip irrigation and mulching to reduce water consumption.",
      icon: Droplets,
      practices: ["Drip Irrigation", "Rainwater Harvesting", "Mulching", "Water Budgeting"]
    },
  ];

  const techniques = [
    {
      title: "Vermicomposting",
      description: "Use earthworms to convert organic waste into nutrient-rich compost. Produces high-quality humus and liquid fertilizer (vermi-wash).",
      icon: Sparkles,
      steps: ["Setup bins", "Add bedding", "Introduce worms", "Feed waste", "Harvest compost"],
      benefits: "Rich in NPK, improves soil structure, increases water retention"
    },
    {
      title: "Biofertilizers & Bio-pesticides",
      description: "Utilize beneficial microorganisms like Rhizobium, Azotobacter, and Trichoderma for natural nutrient cycling and disease suppression.",
      icon: Leaf,
      steps: ["Culture selection", "Seed treatment", "Soil application", "Monitor growth"],
      benefits: "Nitrogen fixation, phosphate solubilization, disease control"
    },
  ];

  const benefits = [
    {
      title: "Higher Market Price",
      description: "Organic products command 20-40% premium in markets due to health-conscious consumers and certification value.",
      icon: TrendingUp,
      value: "₹12-15/kg higher for organic produce"
    },
    {
      title: "Environmental Protection",
      description: "Protects soil health, water quality, and biodiversity. Reduces carbon footprint and promotes climate resilience.",
      icon: Leaf,
      value: "30% lower carbon emissions"
    },
  ];

  const certifications = [
    {
      name: "India Organic (NPOP)",
      description: "National Programme for Organic Production by APEDA - recognized internationally",
      icon: Award,
      requirements: [
        "3-year conversion period for perennial crops, 2 years for annual crops",
        "Bi-annual inspections by accredited agencies",
        "Detailed record keeping of all farm activities",
        "Compliance with NPOP standards and prohibited substance list",
      ],
      cost: "₹15,000-25,000 annually",
      validity: "1 year (renewable)"
    },
    {
      name: "Participatory Guarantee System (PGS)",
      description: "Low-cost certification for local organic producers - ideal for small farmers",
      icon: Users,
      requirements: [
        "Join local organic farmer group (minimum 5 farmers)",
        "Peer review and group guarantee system",
        "Annual group verification and documentation",
        "Adherence to PGS-India organic standards",
      ],
      cost: "₹500-2,000 annually",
      validity: "1 year (group-based renewal)"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-block p-4 bg-success/10 rounded-full mb-4">
            <Leaf className="w-16 h-16 text-success" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-success to-primary bg-clip-text text-transparent mb-6">
            Organic Farming Mastery
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Transform your farm into a sustainable, chemical-free ecosystem with proven organic methods.
          </p>
        </div>

        <Tabs defaultValue="principles" className="w-full">
          <TabsList className="grid w-full grid-cols-4 h-auto p-2 bg-card shadow-lg">
            <TabsTrigger value="principles" className="data-[state=active]:bg-success data-[state=active]:text-success-foreground">
              <Sprout className="w-4 h-4 mr-2" />
              Principles
            </TabsTrigger>
            <TabsTrigger value="techniques" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Sparkles className="w-4 h-4 mr-2" />
              Techniques
            </TabsTrigger>
            <TabsTrigger value="benefits" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
              <Heart className="w-4 h-4 mr-2" />
              Benefits
            </TabsTrigger>
            <TabsTrigger value="certification" className="data-[state=active]:bg-warning data-[state=active]:text-warning-foreground">
              <Award className="w-4 h-4 mr-2" />
              Certifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="principles" className="space-y-6 mt-8">
            <div className="grid md:grid-cols-2 gap-6">
              {principles.map((principle, index) => (
                <Card key={index} className="group hover:shadow-crop hover:scale-[1.02] transition-all duration-300 border-2 hover:border-success/50">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-success/10 rounded-lg">
                        <principle.icon className="w-8 h-8 text-success" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{principle.title}</CardTitle>
                        <CardDescription className="text-base">{principle.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {principle.practices?.map((practice: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-success/10 text-success rounded-full text-sm font-medium">
                          {practice}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="techniques" className="space-y-6 mt-8">
            <div className="grid gap-6">
              {techniques.map((technique, index) => (
                <Card key={index} className="hover:shadow-harvest transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-3">
                      <technique.icon className="w-7 h-7 text-primary" />
                      <CardTitle className="text-2xl">{technique.title}</CardTitle>
                    </div>
                    <CardDescription className="text-base">{technique.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <h4 className="font-semibold text-sm mb-2">Steps:</h4>
                      <div className="flex flex-wrap gap-2">
                        {technique.steps?.map((step: string, i: number) => (
                          <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg text-sm">
                            <span className="w-5 h-5 flex items-center justify-center bg-primary text-primary-foreground rounded-full text-xs font-bold">{i + 1}</span>
                            {step}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="p-3 bg-accent/10 rounded-lg">
                      <p className="text-sm font-medium">✨ Benefits: {technique.benefits}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="benefits" className="space-y-6 mt-8">
            <div className="grid md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <Card key={index} className="hover:shadow-glow transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <benefit.icon className="w-10 h-10 text-accent" />
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{benefit.title}</CardTitle>
                        <CardDescription className="text-base mb-3">{benefit.description}</CardDescription>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 rounded-full">
                          <TrendingUp className="w-4 h-4" />
                          <span className="font-bold">{benefit.value}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="certification" className="space-y-6 mt-8">
            {certifications.map((cert, index) => (
              <Card key={index} className="hover:shadow-harvest transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        {cert.icon && <cert.icon className="w-8 h-8 text-warning" />}
                        <CardTitle className="text-2xl">{cert.name}</CardTitle>
                      </div>
                      <CardDescription className="text-base">{cert.description}</CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-muted-foreground">Cost</div>
                      <div className="text-lg font-bold text-warning">{cert.cost}</div>
                      <div className="text-xs text-muted-foreground">{cert.validity}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    Requirements:
                  </h4>
                  <ul className="space-y-2">
                    {cert.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <span className="w-5 h-5 flex items-center justify-center bg-success/10 text-success rounded-full text-xs font-bold">{i + 1}</span>
                        <span className="text-muted-foreground">{req}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
