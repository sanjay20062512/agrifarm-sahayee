import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Leaf, Droplet, Bug, Recycle, Heart, Shield, TrendingUp } from "lucide-react";
import { useLanguage } from "./LanguageContext";
import { Badge } from "./ui/badge";

export const OrganicFarming = () => {
  const { t } = useLanguage();

  const principles = [
    {
      icon: Leaf,
      title: t("organic.principle1.title"),
      description: t("organic.principle1.desc"),
    },
    {
      icon: Recycle,
      title: t("organic.principle2.title"),
      description: t("organic.principle2.desc"),
    },
    {
      icon: Bug,
      title: t("organic.principle3.title"),
      description: t("organic.principle3.desc"),
    },
    {
      icon: Droplet,
      title: t("organic.principle4.title"),
      description: t("organic.principle4.desc"),
    },
  ];

  const techniques = [
    {
      title: t("organic.technique1.title"),
      description: t("organic.technique1.desc"),
      steps: [
        t("organic.technique1.step1"),
        t("organic.technique1.step2"),
        t("organic.technique1.step3"),
      ],
    },
    {
      title: t("organic.technique2.title"),
      description: t("organic.technique2.desc"),
      steps: [
        t("organic.technique2.step1"),
        t("organic.technique2.step2"),
        t("organic.technique2.step3"),
      ],
    },
    {
      title: t("organic.technique3.title"),
      description: t("organic.technique3.desc"),
      steps: [
        t("organic.technique3.step1"),
        t("organic.technique3.step2"),
        t("organic.technique3.step3"),
      ],
    },
  ];

  const benefits = [
    {
      icon: Heart,
      title: t("organic.benefit1.title"),
      description: t("organic.benefit1.desc"),
    },
    {
      icon: Shield,
      title: t("organic.benefit2.title"),
      description: t("organic.benefit2.desc"),
    },
    {
      icon: TrendingUp,
      title: t("organic.benefit3.title"),
      description: t("organic.benefit3.desc"),
    },
  ];

  const certifications = [
    {
      name: t("organic.cert1.name"),
      description: t("organic.cert1.desc"),
      requirements: [
        t("organic.cert1.req1"),
        t("organic.cert1.req2"),
        t("organic.cert1.req3"),
      ],
    },
    {
      name: t("organic.cert2.name"),
      description: t("organic.cert2.desc"),
      requirements: [
        t("organic.cert2.req1"),
        t("organic.cert2.req2"),
        t("organic.cert2.req3"),
      ],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Leaf className="w-10 h-10 text-success" />
          <h1 className="text-4xl font-bold text-primary">{t("organic.title")}</h1>
        </div>
        <p className="text-lg text-muted-foreground">{t("organic.subtitle")}</p>
      </div>

      <Tabs defaultValue="principles" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="principles">{t("organic.tabs.principles")}</TabsTrigger>
          <TabsTrigger value="techniques">{t("organic.tabs.techniques")}</TabsTrigger>
          <TabsTrigger value="benefits">{t("organic.tabs.benefits")}</TabsTrigger>
          <TabsTrigger value="certification">{t("organic.tabs.certification")}</TabsTrigger>
        </TabsList>

        <TabsContent value="principles" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("organic.principles.header")}</CardTitle>
              <CardDescription>{t("organic.principles.subheader")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {principles.map((principle, index) => (
                  <div key={index} className="flex gap-4 p-4 rounded-lg bg-card border">
                    <principle.icon className="w-12 h-12 text-success flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{principle.title}</h3>
                      <p className="text-muted-foreground">{principle.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="techniques" className="space-y-6">
          {techniques.map((technique, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="w-6 h-6 text-success" />
                  {technique.title}
                </CardTitle>
                <CardDescription>{technique.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <h4 className="font-semibold">{t("organic.steps")}:</h4>
                  <ol className="space-y-2 list-decimal list-inside">
                    {technique.steps.map((step, stepIndex) => (
                      <li key={stepIndex} className="text-muted-foreground">{step}</li>
                    ))}
                  </ol>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="benefits" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <benefit.icon className="w-16 h-16 text-success" />
                  </div>
                  <CardTitle>{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-success/5 border-success/20">
            <CardHeader>
              <CardTitle className="text-success">{t("organic.impact.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Leaf className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                  <span>{t("organic.impact.point1")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Leaf className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                  <span>{t("organic.impact.point2")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Leaf className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                  <span>{t("organic.impact.point3")}</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certification" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("organic.cert.header")}</CardTitle>
              <CardDescription>{t("organic.cert.subheader")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {certifications.map((cert, index) => (
                <div key={index} className="border-l-4 border-success pl-6 py-2">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold">{cert.name}</h3>
                    <Badge variant="outline" className="text-success border-success">
                      {t("organic.cert.official")}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-4">{cert.description}</p>
                  <div>
                    <h4 className="font-semibold mb-2">{t("organic.cert.requirements")}:</h4>
                    <ul className="space-y-1">
                      {cert.requirements.map((req, reqIndex) => (
                        <li key={reqIndex} className="flex items-start gap-2">
                          <Shield className="w-4 h-4 text-success mt-1 flex-shrink-0" />
                          <span className="text-muted-foreground">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
