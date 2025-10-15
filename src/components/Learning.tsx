import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Video, FileText, Award, Users, Sprout } from "lucide-react";
import { useLanguage } from "./LanguageContext";
import { Button } from "./ui/button";

export const Learning = () => {
  const { t } = useLanguage();

  const courses = [
    {
      title: t("learning.course1.title"),
      description: t("learning.course1.desc"),
      duration: t("learning.duration.beginner"),
      icon: Sprout,
    },
    {
      title: t("learning.course2.title"),
      description: t("learning.course2.desc"),
      duration: t("learning.duration.intermediate"),
      icon: BookOpen,
    },
    {
      title: t("learning.course3.title"),
      description: t("learning.course3.desc"),
      duration: t("learning.duration.advanced"),
      icon: Award,
    },
  ];

  const videos = [
    { title: t("learning.video1"), category: t("learning.category.basics") },
    { title: t("learning.video2"), category: t("learning.category.tech") },
    { title: t("learning.video3"), category: t("learning.category.pest") },
    { title: t("learning.video4"), category: t("learning.category.harvest") },
  ];

  const resources = [
    { title: t("learning.resource1"), type: t("learning.type.guide") },
    { title: t("learning.resource2"), type: t("learning.type.manual") },
    { title: t("learning.resource3"), type: t("learning.type.chart") },
    { title: t("learning.resource4"), type: t("learning.type.calendar") },
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
                  <CardTitle>{course.title}</CardTitle>
                  <CardDescription>{course.duration}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{course.description}</p>
                  <Button variant="crop" className="w-full">
                    {t("learning.startCourse")}
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
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
                    <Video className="w-16 h-16 text-muted-foreground" />
                  </div>
                  <Button variant="outline" className="w-full">
                    {t("learning.watchNow")}
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
                  <FileText className="w-10 h-10 text-primary mb-2" />
                  <CardDescription>{resource.type}</CardDescription>
                  <CardTitle className="text-base">{resource.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button variant="secondary" className="w-full">
                    {t("learning.download")}
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
          <Button variant="harvest">{t("learning.community.join")}</Button>
        </CardContent>
      </Card>
    </div>
  );
};
