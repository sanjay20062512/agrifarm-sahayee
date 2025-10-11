import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { 
  Users, 
  MessageCircle, 
  Clock, 
  ThumbsUp, 
  Plus,
  Search,
  Filter,
  MapPin,
  User,
  Send,
  Trash2,
  Bot,
  Sparkles,
  Lightbulb
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "./LanguageContext";

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
  is_guest_post: boolean;
  guest_session_id?: string;
  ai_analysis?: string;
  ai_suggestions?: string[];
  created_at: string;
}

const categories = [
  'Crop Management',
  'Pest Control', 
  'Market Prices',
  'Weather & Climate',
  'Government Schemes',
  'Machinery & Equipment',
  'Labor & Hiring',
  'Fertilizers & Seeds',
  'Irrigation',
  'General Discussion'
];

export const EnhancedFarmerForum = () => {
  const { t } = useLanguage();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<ForumPost[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [isGuest, setIsGuest] = useState(true); // For demo, assume guest mode
  const [isLoading, setIsLoading] = useState(true);
  const [guestSessionId] = useState(crypto.randomUUID());
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());
  
  // New post form
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "General Discussion",
    author_name: "",
    author_location: "",
    tags: ""
  });

  useEffect(() => {
    fetchPosts();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('forum_posts_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'forum_posts' }, 
        () => {
          fetchPosts(); // Refresh posts on any change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  useEffect(() => {
    filterPosts();
  }, [posts, searchTerm, selectedCategory]);

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
    } finally {
      setIsLoading(false);
    }
  };

  const filterPosts = () => {
    let filtered = [...posts];

    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory && selectedCategory !== "all") {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    setFilteredPosts(filtered);
  };

  // AI analysis function using edge function
  const triggerAIAnalysis = async (postId: string, title: string, content: string, category: string) => {
    try {
      await supabase.functions.invoke('analyze-forum-post', {
        body: {
          postId,
          title,
          content,
          category
        }
      });
    } catch (error) {
      console.error('Error triggering AI analysis:', error);
    }
  };

  const handleCreatePost = async () => {
    const title = newPost.title.trim();
    const content = newPost.content.trim();
    const author_name = newPost.author_name.trim();
    const author_location = (newPost.author_location || "").trim() || "Unknown";
    const category = (newPost.category || "").trim() || "General Discussion";

    if (!title || !content || !author_name) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const postData = {
        title,
        content,
        category,
        author_name,
        author_location,
        tags: newPost.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
        is_guest_post: isGuest,
        guest_session_id: isGuest ? guestSessionId : null,
        status: 'active',
      };

      const { data: insertedPost, error } = await supabase
        .from('forum_posts')
        .insert([postData])
        .select()
        .single();

      if (error) throw error;

      if (insertedPost) {
        triggerAIAnalysis(
          insertedPost.id,
          insertedPost.title,
          insertedPost.content,
          insertedPost.category
        );
      }

      setNewPost({
        title: "",
        content: "",
        category: "General Discussion",
        author_name: "",
        author_location: "",
        tags: "",
      });
      setShowCreatePost(false);
      fetchPosts();
    } catch (error: any) {
      console.error('Error creating post:', error);
      alert(error?.message || 'Error creating post. Please try again.');
    }
  };

  const handleDeletePost = async (postId: string, isGuestPost: boolean, postGuestSessionId?: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    try {
      // Use edge function for secure deletion
      const response = await supabase.functions.invoke('delete-forum-post', {
        body: {
          postId,
          isGuestPost,
          guestSessionId: guestSessionId
        }
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to delete post');
      }

      fetchPosts();
      alert("Post deleted successfully");
    } catch (error) {
      console.error('Error deleting post:', error);
      alert(error.message || 'Error deleting post. Please try again.');
    }
  };

  const toggleExpandPost = (postId: string) => {
    const newExpanded = new Set(expandedPosts);
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
    }
    setExpandedPosts(newExpanded);
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground flex items-center justify-center gap-2">
          <Users className="w-8 h-8 text-primary" />
          {t("forum.title")}
        </h2>
        <p className="text-muted-foreground">
          {t("forum.description")}
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder={t("forum.search")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => setShowCreatePost(true)}>
              <Plus className="w-4 h-4 mr-2" />
              {t("forum.new-post")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Create Post Modal */}
      {showCreatePost && (
        <Card>
          <CardHeader>
            <CardTitle>{t("forum.create-title")}</CardTitle>
            <CardDescription>{t("forum.create-description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">{t("forum.your-name")} *</label>
                <Input
                  value={newPost.author_name}
                  onChange={(e) => setNewPost({...newPost, author_name: e.target.value})}
                  placeholder={t("forum.your-name")}
                />
              </div>
              <div>
                <label className="text-sm font-medium">{t("forum.location")}</label>
                <Input
                  value={newPost.author_location}
                  onChange={(e) => setNewPost({...newPost, author_location: e.target.value})}
                  placeholder={t("forum.location")}
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">{t("forum.title-label")} *</label>
              <Input
                value={newPost.title}
                onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                placeholder={t("forum.title-label")}
              />
            </div>

            <div>
              <label className="text-sm font-medium">{t("forum.category")}</label>
              <Select value={newPost.category} onValueChange={(value) => setNewPost({...newPost, category: value})}>
                <SelectTrigger>
                  <SelectValue placeholder={t("forum.category")} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">{t("forum.content")} *</label>
              <Textarea
                value={newPost.content}
                onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                placeholder={t("forum.content")}
                rows={4}
              />
            </div>

            <div>
              <label className="text-sm font-medium">{t("forum.tags")}</label>
              <Input
                value={newPost.tags}
                onChange={(e) => setNewPost({...newPost, tags: e.target.value})}
                placeholder={t("forum.tags")}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCreatePost}>
                <Send className="w-4 h-4 mr-2" />
                {t("forum.post-button")}
              </Button>
              <Button variant="outline" onClick={() => setShowCreatePost(false)}>
                {t("forum.cancel")}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Posts */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <Card key={post.id} className="hover:shadow-crop transition-all duration-300">
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="space-y-1 flex-1">
                  <CardTitle className="text-lg hover:text-primary cursor-pointer">
                    {post.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      {post.is_guest_post ? (
                        <User className="w-3 h-3" />
                      ) : (
                        <User className="w-3 h-3" />
                      )}
                      <span>{post.author_name}</span>
                    </div>
                    {post.author_location && (
                      <>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{post.author_location}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{post.category}</Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeletePost(post.id, post.is_guest_post, post.guest_session_id)}
                    className="text-destructive hover:text-destructive"
                    title="Delete post"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className={`text-sm text-muted-foreground mb-4 ${!expandedPosts.has(post.id) ? 'line-clamp-3' : ''}`}>
                {post.content}
              </p>
              
              {/* AI Analysis */}
              {post.ai_analysis && expandedPosts.has(post.id) && (
                <div className="bg-accent/10 border border-accent/20 rounded-lg p-3 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Bot className="w-4 h-4 text-accent" />
                    <span className="font-semibold text-accent">{t("forum.ai-analysis")}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{post.ai_analysis}</p>
                  
                  {post.ai_suggestions && post.ai_suggestions.length > 0 && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs font-medium text-accent">
                        <Lightbulb className="w-3 h-3" />
                        {t("forum.ai-suggestions")}
                      </div>
                      <ul className="space-y-1">
                        {post.ai_suggestions.map((suggestion, index) => (
                          <li key={index} className="text-xs text-muted-foreground flex items-start gap-1">
                            <span className="text-accent">•</span>
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              
              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {post.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatTimeAgo(post.created_at)}
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    {post.replies_count} {t("forum.replies")}
                  </div>
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="w-4 h-4" />
                    {post.likes_count} {t("forum.likes")}
                  </div>
                  {post.ai_analysis && (
                    <div className="flex items-center gap-1">
                      <Sparkles className="w-4 h-4 text-accent" />
                      <span className="text-accent">{t("forum.ai-analyzed")}</span>
                    </div>
                  )}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => toggleExpandPost(post.id)}
                >
                  {expandedPosts.has(post.id) ? t("forum.show-less") : t("forum.read-more")}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">{t("forum.no-posts")}</h3>
          <p className="text-muted-foreground">
            {searchTerm || selectedCategory 
              ? t("forum.no-posts")
              : t("forum.no-posts")
            }
          </p>
        </div>
      )}
    </div>
  );
};