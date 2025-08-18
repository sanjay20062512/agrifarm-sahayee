import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  ThumbsUp, 
  Clock, 
  Trash2, 
  Plus,
  Send,
  User,
  Image,
  Video,
  Star,
  Brain
} from "lucide-react";

interface ForumPost {
  id: number;
  title: string;
  content: string;
  author: string;
  location: string;
  state: string;
  district: string;
  time: string;
  replies: number;
  likes: number;
  category: string;
  isLiked: boolean;
  comments: Comment[];
  images?: string[];
  videos?: string[];
  aiSummary?: string;
  bestSolution?: string;
}

interface Comment {
  id: number;
  author: string;
  content: string;
  time: string;
  isExpert?: boolean;
  isAI?: boolean;
}

export const FarmerForumPost = () => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [guestMode, setGuestMode] = useState(false);
  const [showComments, setShowComments] = useState<number | null>(null);
  const [newComment, setNewComment] = useState("");

  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "General",
    state: "",
    district: "",
    images: [] as string[],
    videos: [] as string[]
  });

  const categories = ["General", "Vegetables", "Fruits", "Grains", "Pest Control", "Market", "Technology"];
  const states = ["Tamil Nadu", "Karnataka", "Andhra Pradesh", "Kerala", "Maharashtra", "Gujarat", "Punjab", "Haryana"];
  const districts = {
    "Tamil Nadu": ["Chennai", "Coimbatore", "Salem", "Madurai", "Tiruchirapalli", "Erode", "Vellore"],
    "Karnataka": ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum", "Gulbarga"],
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Solapur"]
  };

  const getAIExpertResponse = (title: string, content: string, category: string): string => {
    const responses = {
      "Pest Control": "Based on your description, this appears to be a common pest issue. I recommend: 1) Immediate application of neem oil spray (3ml/L) in evening hours. 2) Use yellow sticky traps for monitoring. 3) Maintain field hygiene by removing affected plant parts. 4) Consider biological control with Trichogramma if problem persists. Monitor for 48-72 hours and repeat if necessary.",
      "Vegetables": "For optimal vegetable cultivation: 1) Ensure proper spacing between plants for good air circulation. 2) Apply balanced NPK fertilizer based on soil test results. 3) Maintain consistent moisture levels through drip irrigation. 4) Regular monitoring for early disease detection. 5) Harvest at proper maturity for better market prices.",
      "Market": "Current market analysis suggests: 1) Prices are expected to rise by 15-20% in the next 2 weeks due to seasonal demand. 2) Quality grading will significantly impact prices. 3) Consider direct marketing to reduce middleman costs. 4) Storage facilities can help you wait for better prices. 5) Check e-NAM portal for real-time mandi prices.",
      "General": "Based on the agricultural best practices: 1) Soil testing is crucial for nutrient management. 2) Weather-based farming decisions improve yields. 3) Integrated pest management reduces chemical dependency. 4) Proper post-harvest handling maintains quality. 5) Keep detailed records for better farm management."
    };
    return responses[category as keyof typeof responses] || responses["General"];
  };

  const generateAISummary = (content: string): string => {
    if (content.toLowerCase().includes('pest')) {
      return "🔍 AI Analysis: Pest management issue identified. Organic solutions recommended first, followed by targeted chemical intervention if needed.";
    } else if (content.toLowerCase().includes('disease')) {
      return "🔍 AI Analysis: Disease symptoms detected. Early intervention with fungicides and improved cultural practices suggested.";
    } else if (content.toLowerCase().includes('fertilizer')) {
      return "🔍 AI Analysis: Nutrient management query. Soil testing recommended before fertilizer application for optimal results.";
    } else if (content.toLowerCase().includes('market') || content.toLowerCase().includes('price')) {
      return "🔍 AI Analysis: Market-related query. Timing and quality are key factors for better prices.";
    }
    return "🔍 AI Analysis: General farming query identified. Best practices and local expert consultation recommended.";
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const imageUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            imageUrls.push(e.target.result as string);
            if (imageUrls.length === files.length) {
              setNewPost(prev => ({ ...prev, images: [...prev.images, ...imageUrls] }));
            }
          }
        };
        reader.readAsDataURL(files[i]);
      }
    }
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const videoUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            videoUrls.push(e.target.result as string);
            if (videoUrls.length === files.length) {
              setNewPost(prev => ({ ...prev, videos: [...prev.videos, ...videoUrls] }));
            }
          }
        };
        reader.readAsDataURL(files[i]);
      }
    }
  };

  const handleCreatePost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return;

    // Generate AI expert response
    const aiResponse: Comment = {
      id: Date.now() + 1,
      author: "AgriAI Expert",
      content: getAIExpertResponse(newPost.title, newPost.content, newPost.category),
      time: "Just now",
      isAI: true,
      isExpert: true
    };

    const post: ForumPost = {
      id: Date.now(),
      title: newPost.title,
      content: newPost.content,
      author: "Guest User",
      location: `${newPost.district}, ${newPost.state}`,
      state: newPost.state,
      district: newPost.district,
      time: "Just now",
      replies: 1,
      likes: 0,
      category: newPost.category,
      isLiked: false,
      comments: [aiResponse],
      images: newPost.images,
      videos: newPost.videos,
      aiSummary: generateAISummary(newPost.content),
      bestSolution: getAIExpertResponse(newPost.title, newPost.content, newPost.category)
    };

    setPosts([post, ...posts]);
    setNewPost({ title: "", content: "", category: "General", state: "", district: "", images: [], videos: [] });
    setShowCreatePost(false);
  };

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked }
        : post
    ));
  };

  const handleDelete = (postId: number) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  const handleAddComment = (postId: number) => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now(),
      author: "Guest User",
      content: newComment,
      time: "Just now"
    };

    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, comments: [...post.comments, comment], replies: post.replies + 1 }
        : post
    ));

    setNewComment("");
  };

  if (!guestMode) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-foreground">Farmer Forum</h2>
          <p className="text-muted-foreground">
            Connect with farmers across India, share knowledge and get advice
          </p>
          <Card className="max-w-md mx-auto">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <User className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Join the Community</h3>
              <p className="text-sm text-muted-foreground">
                Sign in to create posts, like, and comment on discussions
              </p>
              <div className="space-y-2">
                <Button 
                  variant="nav" 
                  size="lg" 
                  className="w-full"
                  onClick={() => setGuestMode(true)}
                >
                  Continue with Guest Mode
                </Button>
                <p className="text-xs text-muted-foreground">
                  Guest mode allows you to create and interact with posts
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Farmer Forum</h2>
          <p className="text-muted-foreground">Share knowledge and get advice from fellow farmers</p>
        </div>
        <Button 
          variant="harvest" 
          size="lg"
          onClick={() => setShowCreatePost(!showCreatePost)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Post
        </Button>
      </div>

      {/* Create Post Form */}
      {showCreatePost && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Post</CardTitle>
            <CardDescription>Share your farming question or knowledge with the community</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <select 
                value={newPost.category}
                onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                className="w-full p-2 border rounded-md bg-background"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input 
                placeholder="Enter your question or topic..."
                value={newPost.title}
                onChange={(e) => setNewPost({...newPost, title: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">State</label>
                <select 
                  value={newPost.state}
                  onChange={(e) => setNewPost({...newPost, state: e.target.value, district: ""})}
                  className="w-full p-2 border rounded-md bg-background"
                >
                  <option value="">Select State</option>
                  {states.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">District</label>
                <select 
                  value={newPost.district}
                  onChange={(e) => setNewPost({...newPost, district: e.target.value})}
                  className="w-full p-2 border rounded-md bg-background"
                  disabled={!newPost.state}
                >
                  <option value="">Select District</option>
                  {newPost.state && districts[newPost.state as keyof typeof districts]?.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea 
                placeholder="Provide more details about your question or share your knowledge..."
                rows={4}
                value={newPost.content}
                onChange={(e) => setNewPost({...newPost, content: e.target.value})}
              />
            </div>
            
            {/* Media Upload Section */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Upload Images</label>
                  <div className="border-2 border-dashed border-border rounded-lg p-4">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center">
                      <Image className="w-8 h-8 text-muted-foreground mb-2" />
                      <span className="text-sm text-center">Click to upload images</span>
                    </label>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Upload Videos</label>
                  <div className="border-2 border-dashed border-border rounded-lg p-4">
                    <input
                      type="file"
                      multiple
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                      id="video-upload"
                    />
                    <label htmlFor="video-upload" className="cursor-pointer flex flex-col items-center">
                      <Video className="w-8 h-8 text-muted-foreground mb-2" />
                      <span className="text-sm text-center">Click to upload videos</span>
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Preview uploaded media */}
              {(newPost.images.length > 0 || newPost.videos.length > 0) && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {newPost.images.map((image, index) => (
                    <img key={index} src={image} alt={`Upload ${index}`} className="w-full h-20 object-cover rounded" />
                  ))}
                  {newPost.videos.map((video, index) => (
                    <video key={index} src={video} className="w-full h-20 object-cover rounded" controls />
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button 
                variant="nav" 
                onClick={handleCreatePost}
                disabled={!newPost.title.trim() || !newPost.content.trim()}
              >
                Post Question
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowCreatePost(false)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Posts List */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <Card className="text-center py-8">
            <CardContent>
              <MessageCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
              <p className="text-muted-foreground mb-4">
                Be the first to start a discussion in the farming community!
              </p>
              <Button 
                variant="harvest"
                onClick={() => setShowCreatePost(true)}
              >
                Create First Post
              </Button>
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => (
            <Card key={post.id} className="hover:shadow-crop transition-all duration-300">
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-lg">{post.title}</CardTitle>
                    <CardDescription>
                      by {post.author} • {post.location}
                    </CardDescription>
                    <p className="text-sm mt-2">{post.content}</p>
                    
                    {/* AI Summary */}
                    {post.aiSummary && (
                      <div className="bg-primary/10 border border-primary/20 rounded-lg p-2 mt-3">
                        <div className="flex items-center gap-1 mb-1">
                          <Brain className="w-3 h-3 text-primary" />
                          <span className="text-xs font-semibold text-primary">AI Analysis</span>
                        </div>
                        <p className="text-xs">{post.aiSummary}</p>
                      </div>
                    )}
                    
                    {/* Media Display */}
                    {(post.images && post.images.length > 0) && (
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {post.images.slice(0, 4).map((image, index) => (
                          <img key={index} src={image} alt={`Post image ${index}`} className="w-full h-20 object-cover rounded" />
                        ))}
                      </div>
                    )}
                    
                    {(post.videos && post.videos.length > 0) && (
                      <div className="grid grid-cols-1 gap-2 mt-2">
                        {post.videos.slice(0, 2).map((video, index) => (
                          <video key={index} src={video} className="w-full h-20 object-cover rounded" controls />
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary">{post.category}</Badge>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDelete(post.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.time}
                    </div>
                    <button 
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => setShowComments(showComments === post.id ? null : post.id)}
                    >
                      <MessageCircle className="w-4 h-4" />
                      {post.replies} replies
                    </button>
                    <button 
                      className={`flex items-center gap-1 hover:text-foreground ${post.isLiked ? 'text-success' : ''}`}
                      onClick={() => handleLike(post.id)}
                    >
                      <ThumbsUp className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                      {post.likes} likes
                    </button>
                  </div>
                </div>

                {/* Comments Section */}
                {showComments === post.id && (
                  <div className="mt-4 space-y-3 border-t pt-4">
                    <div className="space-y-2">
                      {post.comments.map((comment) => (
                        <div key={comment.id} className={`p-3 rounded-lg ${
                          comment.isAI ? 'bg-primary/10 border border-primary/20' :
                          comment.isExpert ? 'bg-success/10 border border-success/20' :
                          'bg-muted/30'
                        }`}>
                          <div className="flex justify-between items-start mb-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm">{comment.author}</span>
                              {comment.isAI && (
                                <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                                  <Brain className="w-2 h-2 mr-1" />
                                  AI Expert
                                </Badge>
                              )}
                              {comment.isExpert && !comment.isAI && (
                                <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/20">
                                  <Star className="w-2 h-2 mr-1" />
                                  Expert
                                </Badge>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground">{comment.time}</span>
                          </div>
                          <p className="text-sm">{comment.content}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                        className="flex-1"
                      />
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleAddComment(post.id)}
                        disabled={!newComment.trim()}
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};