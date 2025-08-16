import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, MessageCircle, Clock, ThumbsUp } from "lucide-react";

export const FarmerForum = () => {
  const forumPosts = [
    {
      id: 1,
      title: "Best time to plant tomatoes in Karnataka?",
      author: "Ravi Kumar",
      location: "Bangalore, Karnataka",
      time: "2 hours ago",
      replies: 12,
      likes: 8,
      category: "Vegetables"
    },
    {
      id: 2,
      title: "Organic pest control for cotton crops",
      author: "Priya Sharma",
      location: "Nagpur, Maharashtra",
      time: "5 hours ago",
      replies: 18,
      likes: 15,
      category: "Pest Control"
    },
    {
      id: 3,
      title: "Wheat market prices - when to sell?",
      author: "Suresh Patel",
      location: "Indore, Madhya Pradesh",
      time: "1 day ago",
      replies: 25,
      likes: 22,
      category: "Market"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground flex items-center justify-center gap-2">
          <Users className="w-8 h-8 text-primary" />
          Farmer Forum
        </h2>
        <p className="text-muted-foreground">
          Connect with farmers across India, share knowledge and get advice
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button variant="nav" size="lg">
          Sign In to Post
        </Button>
        <Button variant="harvest" size="lg">
          Browse as Guest
        </Button>
      </div>

      <div className="space-y-4">
        {forumPosts.map((post) => (
          <Card key={post.id} className="hover:shadow-crop transition-all duration-300">
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="space-y-1">
                  <CardTitle className="text-lg hover:text-primary cursor-pointer">
                    {post.title}
                  </CardTitle>
                  <CardDescription>
                    by {post.author} • {post.location}
                  </CardDescription>
                </div>
                <Badge variant="secondary">{post.category}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {post.time}
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    {post.replies} replies
                  </div>
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="w-4 h-4" />
                    {post.likes} likes
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  Read More
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};