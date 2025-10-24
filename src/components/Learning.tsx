import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Video, FileText, Award, Users, Sprout, ExternalLink, Download } from "lucide-react";
import { useLanguage } from "./LanguageContext";
import { Button } from "./ui/button";

export const Learning = () => {
  const { t } = useLanguage();

  const courses = [
    {
      title: "Organic Farming Basics - ICAR",
      description: "Comprehensive course on organic farming principles and practices by Indian Council of Agricultural Research",
      duration: "Free • Self-paced",
      icon: Sprout,
      link: "https://icar.org.in/",
    },
    {
      title: "Modern Farming Techniques - NABARD",
      description: "Learn about modern agricultural practices, irrigation, and crop management",
      duration: "Free • 6 weeks",
      icon: BookOpen,
      link: "https://www.nabard.org/",
    },
    {
      title: "Sustainable Agriculture - MANAGE",
      description: "Master sustainable farming practices and resource management",
      duration: "Free • 8 weeks",
      icon: Award,
      link: "https://www.manage.gov.in/",
    },
    {
      title: "Digital Agriculture - AgriStack",
      description: "Learn about digital tools and technologies for modern farming",
      duration: "Free • 4 weeks",
      icon: BookOpen,
      link: "https://agricoop.nic.in/",
    },
    {
      title: "Soil Health Management",
      description: "Understanding soil testing, fertilizer application, and soil conservation",
      duration: "Free • Self-paced",
      icon: Sprout,
      link: "https://www.manage.gov.in/",
    },
    {
      title: "Integrated Pest Management",
      description: "Learn eco-friendly pest control methods and IPM strategies",
      duration: "Free • 5 weeks",
      icon: Award,
      link: "https://icar.org.in/",
    },
  ];

  const videos = [
    { 
      title: "Modern Farming Techniques in India",
      category: "Technology",
      videoId: "7J6KMRl_kO4",
      description: "Learn about latest farming technologies and methods"
    },
    { 
      title: "Organic Farming - Complete Guide",
      category: "Organic",
      videoId: "kHSZvCnbHYE",
      description: "Step-by-step guide to organic farming"
    },
    { 
      title: "Drip Irrigation System Setup",
      category: "Irrigation",
      videoId: "oqPadv6f7rI",
      description: "How to install and maintain drip irrigation"
    },
    { 
      title: "Soil Testing and Management",
      category: "Soil Health",
      videoId: "7kqvgKkqZWE",
      description: "Understanding soil health and testing methods"
    },
    { 
      title: "Natural Pest Control Methods",
      category: "Pest Control",
      videoId: "Nqj6p3TGNRE",
      description: "Eco-friendly pest management techniques"
    },
    { 
      title: "Crop Rotation Benefits",
      category: "Best Practices",
      videoId: "Yr8LPLdQkQQ",
      description: "Why and how to implement crop rotation"
    },
  ];

  const resources = [
    { 
      title: "Indian Crop Calendar 2024",
      type: "PDF Guide",
      description: "Complete crop calendar for all seasons",
      link: "https://agricoop.nic.in/",
      icon: FileText,
    },
    { 
      title: "Fertilizer Application Guide",
      type: "Manual",
      description: "NPK ratios and application methods",
      link: "https://www.iffcobazar.in/",
      icon: BookOpen,
    },
    { 
      title: "Pest & Disease Chart",
      type: "Chart",
      description: "Identification and treatment guide",
      link: "https://icar.org.in/",
      icon: FileText,
    },
    { 
      title: "Government Schemes List",
      type: "PDF",
      description: "All farming subsidies and benefits",
      link: "https://agricoop.nic.in/",
      icon: FileText,
    },
    { 
      title: "Soil Testing Manual",
      type: "Guide",
      description: "How to test and improve soil health",
      link: "https://www.manage.gov.in/",
      icon: BookOpen,
    },
    { 
      title: "Water Management Handbook",
      type: "Manual",
      description: "Irrigation and water conservation",
      link: "https://www.nabard.org/",
      icon: FileText,
    },
    { 
      title: "Organic Certification Guide",
      type: "PDF",
      description: "Steps to get organic certification",
      link: "https://www.apeda.gov.in/apedawebsite/organic/",
      icon: BookOpen,
    },
    { 
      title: "Weather Advisory System",
      type: "Portal",
      description: "Access IMD weather forecasts",
      link: "https://mausam.imd.gov.in/",
      icon: FileText,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 text-primary">{t("learning.title")}</h1>
        <p className="text-lg text-muted-foreground">{t("learning.subtitle")}</p>
      </div>

      <Tabs defaultValue="courses" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="courses">
            <BookOpen className="w-4 h-4 mr-2" />
            {t("learning.tabs.courses")}
          </TabsTrigger>
          <TabsTrigger value="videos">
            <Video className="w-4 h-4 mr-2" />
            {t("learning.tabs.videos")}
          </TabsTrigger>
          <TabsTrigger value="resources">
            <FileText className="w-4 h-4 mr-2" />
            {t("learning.tabs.resources")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <course.icon className="w-12 h-12 text-primary mb-2" />
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  <CardDescription>{course.duration}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 min-h-[60px]">{course.description}</p>
                  <Button asChild variant="default" className="w-full">
                    <a href={course.link} target="_blank" rel="noopener noreferrer">
                      {t("learning.startCourse")}
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="videos" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {videos.map((video, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Video className="w-5 h-5 text-primary" />
                    <span className="text-sm text-primary font-medium">{video.category}</span>
                  </div>
                  <CardTitle className="text-lg">{video.title}</CardTitle>
                  <CardDescription>{video.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <a
                    href={`https://www.youtube.com/watch?v=${video.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group"
                  >
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-4 relative">
                      <img
                        src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
                        alt={`${video.title} thumbnail`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="rounded-full p-3 bg-background/70 ring-1 ring-border group-hover:bg-background transition">
                          <Video className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                    </div>
                  </a>
                  <Button 
                    asChild
                    variant="outline" 
                    className="w-full"
                  >
                    <a href={`https://www.youtube.com/watch?v=${video.videoId}`} target="_blank" rel="noopener noreferrer">
                      {t("learning.watchNow")}
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.map((resource, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <resource.icon className="w-10 h-10 text-primary mb-2" />
                  <CardDescription>{resource.type}</CardDescription>
                  <CardTitle className="text-base">{resource.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 min-h-[40px]">{resource.description}</p>
                  <Button 
                    asChild
                    variant="secondary" 
                    className="w-full"
                  >
                    <a href={resource.link} target="_blank" rel="noopener noreferrer">
                      <Download className="w-4 h-4 mr-2" />
                      {t("learning.download")}
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Card className="mt-8 bg-primary/5 border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="w-8 h-8 text-primary" />
            <CardTitle>{t("learning.community.title")}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{t("learning.community.desc")}</p>
          <Button variant="default">{t("learning.community.join")}</Button>
        </CardContent>
      </Card>
    </div>
  );
};

