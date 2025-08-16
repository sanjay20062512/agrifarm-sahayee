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
  User
} from "lucide-react";

interface ForumPost {
  id: number;
  title: string;
  content: string;
  author: string;
  location: string;
  time: string;
  replies: number;
  likes: number;
  category: string;
  isLiked: boolean;
  comments: Comment[];
}

interface Comment {
  id: number;
  author: string;
  content: string;
  time: string;
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
    category: "General"
  });

  const categories = ["General", "Vegetables", "Fruits", "Grains", "Pest Control", "Market", "Technology"];

  const handleCreatePost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return;

    const post: ForumPost = {
      id: Date.now(),
      title: newPost.title,
      content: newPost.content,
      author: "Guest User",
      location: "India",
      time: "Just now",
      replies: 0,
      likes: 0,
      category: newPost.category,
      isLiked: false,
      comments: []
    };

    setPosts([post, ...posts]);
    setNewPost({ title: "", content: "", category: "General" });
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
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea 
                placeholder="Provide more details about your question or share your knowledge..."
                rows={4}
                value={newPost.content}
                onChange={(e) => setNewPost({...newPost, content: e.target.value})}
              />
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
                        <div key={comment.id} className="bg-muted/30 p-3 rounded-lg">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-semibold text-sm">{comment.author}</span>
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