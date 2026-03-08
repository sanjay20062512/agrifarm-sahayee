import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, ThumbsUp, Send, Filter, TrendingUp, Users, Award, Search, Plus, Clock, MapPin, Tag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author_name: string;
  author_location: string;
  category: string;
  tags: string[];
  likes_count: number;
  replies_count: number;
  created_at: string;
  ai_analysis: string | null;
  ai_suggestions: string[] | null;
}

export const EnhancedFarmerForum = () => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<ForumPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();
  const isGuest = !user;

  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    author_name: "",
    author_location: "",
    category: "",
    tags: [] as string[]
  });

  const categories = [
    { value: "all", label: "All Topics", icon: "📚" },
    { value: "crop_management", label: "Crop Management", icon: "🌾" },
    { value: "pest_disease", label: "Pest & Disease", icon: "🐛" },
    { value: "market_prices", label: "Market & Prices", icon: "💰" },
    { value: "equipment", label: "Equipment", icon: "🚜" },
    { value: "success_story", label: "Success Stories", icon: "🏆" },
    { value: "weather", label: "Weather & Climate", icon: "🌦️" }
  ];

  useEffect(() => {
    fetchPosts();
    
    const subscription = supabase
      .channel('forum_posts_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'forum_posts' }, () => {
        fetchPosts();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    filterPosts();
  }, [posts, selectedCategory, searchQuery]);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('forum_posts')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Error loading forum",
        description: "Could not load forum posts. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterPosts = () => {
    let filtered = posts;

    if (selectedCategory !== "all") {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    setFilteredPosts(filtered);
  };

  const handleCreatePost = async () => {
    if (!newPost.title || !newPost.content || !newPost.author_name || !newPost.category) {
      toast({
        title: "Missing information",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const insertData: Record<string, unknown> = {
        ...newPost,
        is_guest_post: isGuest,
      };

      if (isGuest) {
        insertData.guest_session_id = localStorage.getItem('guest_session_id') || Math.random().toString(36).substring(7);
        if (!localStorage.getItem('guest_session_id')) {
          localStorage.setItem('guest_session_id', insertData.guest_session_id as string);
        }
      } else {
        insertData.author_id = user!.id;
      }

      const { data, error } = await supabase
        .from('forum_posts')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;

      // Trigger AI analysis
      if (data) {
        await supabase.functions.invoke('analyze-forum-post', {
          body: {
            postId: data.id,
            title: newPost.title,
            content: newPost.content,
            category: newPost.category
          }
        });
      }

      toast({
        title: "Post created!",
        description: "Your question has been posted. AI is analyzing it now.",
      });

      setNewPost({
        title: "",
        content: "",
        author_name: "",
        author_location: "",
        category: "",
        tags: []
      });
      setShowCreatePost(false);
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Could not create post. Please try again.",
        variant: "destructive"
      });
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      crop_management: "bg-success/10 text-success border-success/20",
      pest_disease: "bg-destructive/10 text-destructive border-destructive/20",
      market_prices: "bg-accent/10 text-accent-foreground border-accent/20",
      equipment: "bg-primary/10 text-primary border-primary/20",
      success_story: "bg-warning/10 text-warning-foreground border-warning/20",
      weather: "bg-muted text-muted-foreground border-border"
    };
    return colors[category] || "bg-muted text-muted-foreground border-border";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
            <Users className="w-16 h-16 text-primary" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-success bg-clip-text text-transparent mb-4">
            Farmer Community Forum
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Connect with thousands of farmers across India. Share experiences, ask questions, 
            and get AI-powered insights on farming challenges.
          </p>
          
          {/* Stats */}
          <div className="flex justify-center gap-6 mt-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg shadow-sm">
              <MessageSquare className="w-5 h-5 text-primary" />
              <div>
                <div className="font-bold text-xl">{posts.length}</div>
                <div className="text-xs text-muted-foreground">Active Posts</div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg shadow-sm">
              <Users className="w-5 h-5 text-success" />
              <div>
                <div className="font-bold text-xl">5000+</div>
                <div className="text-xs text-muted-foreground">Farmers</div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg shadow-sm">
              <Award className="w-5 h-5 text-accent" />
              <div>
                <div className="font-bold text-xl">AI Powered</div>
                <div className="text-xs text-muted-foreground">Instant Analysis</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Create */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search posts by topic, crop, or problem..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
          <Button
            size="lg"
            onClick={() => setShowCreatePost(!showCreatePost)}
            className="bg-gradient-primary hover:opacity-90"
          >
            <Plus className="w-5 h-5 mr-2" />
            Ask Question
          </Button>
        </div>

        {/* Create Post Form */}
        {showCreatePost && (
          <Card className="mb-8 border-2 border-primary/20 shadow-crop">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-primary" />
                Share Your Question or Experience
              </CardTitle>
              <CardDescription>
                Get AI-powered insights and advice from fellow farmers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  placeholder="Your Name *"
                  value={newPost.author_name}
                  onChange={(e) => setNewPost({ ...newPost, author_name: e.target.value })}
                />
                <Input
                  placeholder="Location (Village, District) *"
                  value={newPost.author_location}
                  onChange={(e) => setNewPost({ ...newPost, author_location: e.target.value })}
                />
              </div>
              <Input
                placeholder="Post Title (e.g., 'Brown spots on tomato leaves - What to do?') *"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              />
              <Select value={newPost.category} onValueChange={(value) => setNewPost({ ...newPost, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Category *" />
                </SelectTrigger>
                <SelectContent>
                  {categories.filter(c => c.value !== "all").map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.icon} {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Textarea
                placeholder="Describe your question or experience in detail... *"
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                rows={6}
              />
              <div className="flex gap-2">
                <Button onClick={handleCreatePost} className="bg-gradient-primary">
                  <Send className="w-4 h-4 mr-2" />
                  Post Question
                </Button>
                <Button variant="outline" onClick={() => setShowCreatePost(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Category Filter */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full mb-8">
          <TabsList className="w-full grid grid-cols-4 md:grid-cols-7 h-auto p-2 bg-card shadow-md">
            {categories.map(cat => (
              <TabsTrigger 
                key={cat.value} 
                value={cat.value}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm py-2"
              >
                <span className="mr-1">{cat.icon}</span>
                <span className="hidden sm:inline">{cat.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Posts List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading forum posts...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No posts found</h3>
              <p className="text-muted-foreground">
                {searchQuery || selectedCategory !== "all"
                  ? "Try adjusting your filters or search"
                  : "Be the first to ask a question!"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <Card 
                key={post.id} 
                className="group hover:shadow-harvest hover:scale-[1.01] transition-all duration-300 border-2 hover:border-primary/30"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <Badge className={getCategoryColor(post.category)}>
                          {categories.find(c => c.value === post.category)?.icon}
                          {" "}
                          {categories.find(c => c.value === post.category)?.label}
                        </Badge>
                        {post.tags?.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="text-base leading-relaxed line-clamp-2">
                        {post.content}
                      </CardDescription>
                      <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {post.author_name}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {post.author_location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatTimeAgo(post.created_at)}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 items-end">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 px-3 py-1 bg-muted rounded-full">
                          <ThumbsUp className="w-4 h-4 text-success" />
                          <span className="font-semibold">{post.likes_count || 0}</span>
                        </div>
                        <div className="flex items-center gap-1 px-3 py-1 bg-muted rounded-full">
                          <MessageSquare className="w-4 h-4 text-primary" />
                          <span className="font-semibold">{post.replies_count || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                {post.ai_analysis && (
                  <CardContent>
                    <div className="p-4 bg-gradient-to-r from-primary/5 to-success/5 rounded-lg border-l-4 border-primary">
                      <div className="flex items-start gap-3">
                        <Award className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
                            AI Expert Analysis
                          </h4>
                          <p className="text-sm text-foreground/80 leading-relaxed mb-3">
                            {post.ai_analysis}
                          </p>
                          {post.ai_suggestions && post.ai_suggestions.length > 0 && (
                            <div>
                              <h5 className="text-xs font-semibold mb-2 text-muted-foreground">Recommended Actions:</h5>
                              <ul className="space-y-1">
                                {post.ai_suggestions.map((suggestion, idx) => (
                                  <li key={idx} className="text-sm flex items-start gap-2">
                                    <span className="text-success font-bold mt-0.5">✓</span>
                                    <span className="text-foreground/70">{suggestion}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
