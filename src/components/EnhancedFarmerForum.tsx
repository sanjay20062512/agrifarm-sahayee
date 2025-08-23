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
  Send
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
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [isGuest, setIsGuest] = useState(true); // For demo, assume guest mode
  const [isLoading, setIsLoading] = useState(true);
  
  // New post form
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "",
    author_name: "",
    author_location: "",
    tags: ""
  });

  useEffect(() => {
    fetchPosts();
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

    if (selectedCategory) {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    setFilteredPosts(filtered);
  };

  const handleCreatePost = async () => {
    if (!newPost.title || !newPost.content || !newPost.author_name) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const postData = {
        ...newPost,
        tags: newPost.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        is_guest_post: isGuest,
        guest_session_id: isGuest ? crypto.randomUUID() : null
      };

      const { error } = await supabase
        .from('forum_posts')
        .insert([postData]);

      if (error) throw error;

      // Reset form and refresh posts
      setNewPost({
        title: "",
        content: "",
        category: "",
        author_name: "",
        author_location: "",
        tags: ""
      });
      setShowCreatePost(false);
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error creating post. Please try again.');
    }
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
          {t("nav.farmer-forum")}
        </h2>
        <p className="text-muted-foreground">
          Connect with farmers across India, share knowledge and get advice
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
                  placeholder="Search posts..."
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
                  <SelectItem value="">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => setShowCreatePost(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Create Post Modal */}
      {showCreatePost && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Post</CardTitle>
            <CardDescription>Share your farming experience or ask questions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Your Name *</label>
                <Input
                  value={newPost.author_name}
                  onChange={(e) => setNewPost({...newPost, author_name: e.target.value})}
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Location</label>
                <Input
                  value={newPost.author_location}
                  onChange={(e) => setNewPost({...newPost, author_location: e.target.value})}
                  placeholder="City, State"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Title *</label>
              <Input
                value={newPost.title}
                onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                placeholder="What's your question or topic?"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Category</label>
              <Select value={newPost.category} onValueChange={(value) => setNewPost({...newPost, category: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Content *</label>
              <Textarea
                value={newPost.content}
                onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                placeholder="Share your thoughts, experience, or ask your question in detail..."
                rows={4}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Tags (comma separated)</label>
              <Input
                value={newPost.tags}
                onChange={(e) => setNewPost({...newPost, tags: e.target.value})}
                placeholder="e.g., rice, irrigation, pest control"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCreatePost}>
                <Send className="w-4 h-4 mr-2" />
                Post
              </Button>
              <Button variant="outline" onClick={() => setShowCreatePost(false)}>
                Cancel
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
                <Badge variant="secondary">{post.category}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                {post.content}
              </p>
              
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
                    {post.replies_count} replies
                  </div>
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="w-4 h-4" />
                    {post.likes_count} likes
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

      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No posts found</h3>
          <p className="text-muted-foreground">
            {searchTerm || selectedCategory 
              ? "Try adjusting your search criteria"
              : "Be the first to start a conversation!"
            }
          </p>
        </div>
      )}
    </div>
  );
};