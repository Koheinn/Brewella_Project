import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, User, MessageCircle, Heart, Send, X } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

type Comment = {
  comment_id: number;
  post_id: number;
  user_id: number;
  comment: string;
  created_at: string;
  first_name: string;
  last_name: string;
};

type Post = {
  post_id: number;
  title: string;
  content: string;
  image_path: string;
  post_type: 'news' | 'event';
  created_at: string;
  first_name: string;
  last_name: string;
  likes_count: number;
  comments_count: number;
  user_reaction: string | null;
};

export default function News() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();
  const [expandedPostId, setExpandedPostId] = useState<number | null>(null);
  const [comments, setComments] = useState<Record<number, Comment[]>>({});
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);

  const fetchPosts = () => {
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    fetch('/api/posts', { headers })
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching posts:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPosts();
  }, [user, token]);

  const handleReaction = async (postId: number, currentReaction: string | null) => {
    if (!user) {
      toast.error('Please login to react to posts');
      return;
    }

    const newReaction = currentReaction === 'like' ? null : 'like';

    try {
      const res = await fetch(`/api/posts/${postId}/reactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reaction_type: newReaction })
      });

      if (res.ok) {
        const data = await res.json();
        setPosts(posts.map(p => 
          p.post_id === postId 
            ? { ...p, likes_count: data.likes_count, user_reaction: data.user_reaction }
            : p
        ));
      }
    } catch (error) {
      console.error('Error reacting to post:', error);
    }
  };

  const toggleComments = async (postId: number) => {
    if (expandedPostId === postId) {
      setExpandedPostId(null);
      return;
    }

    setExpandedPostId(postId);
    if (!comments[postId]) {
      setLoadingComments(true);
      try {
        const res = await fetch(`/api/posts/${postId}/comments`);
        if (res.ok) {
          const data = await res.json();
          setComments(prev => ({ ...prev, [postId]: data }));
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setLoadingComments(false);
      }
    }
  };

  const submitComment = async (e: React.FormEvent, postId: number) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to comment');
      return;
    }
    if (!newComment.trim()) return;

    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ comment: newComment })
      });

      if (res.ok) {
        const data = await res.json();
        setComments(prev => ({
          ...prev,
          [postId]: [data, ...(prev[postId] || [])]
        }));
        setPosts(posts.map(p => 
          p.post_id === postId 
            ? { ...p, comments_count: p.comments_count + 1 }
            : p
        ));
        setNewComment('');
        toast.success('Comment added');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };

  return (
    <div className="bg-stone-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-serif font-bold text-stone-900 mb-4"
          >
            Latest <span className="text-amber-600 italic">News & Events</span>
          </motion.h1>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            Stay updated with what's happening at Brewella. From new menu items to special events.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {posts.map((post, index) => (
              <motion.article
                key={post.post_id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-100 flex flex-col h-full group"
              >
                <div className="relative h-64 overflow-hidden bg-stone-200">
                  {post.image_path ? (
                    <img 
                      src={post.image_path} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                  ) : (
                    <img 
                      src="https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80" 
                      alt="Placeholder" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute top-4 left-4">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                      post.post_type === 'event' ? 'bg-amber-500 text-white' : 'bg-stone-900 text-white'
                    }`}>
                      {post.post_type}
                    </span>
                  </div>
                </div>
                
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 text-sm text-stone-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(post.created_at), 'MMM d, yyyy')}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {post.first_name} {post.last_name}
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-serif font-bold text-stone-900 mb-4 group-hover:text-amber-600 transition-colors">
                    {post.title}
                  </h2>
                  
                  <p className="text-stone-600 mb-6 line-clamp-3 flex-grow">
                    {post.content}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-stone-100">
                    <button 
                      onClick={() => toggleComments(post.post_id)}
                      className="text-amber-600 font-semibold hover:text-amber-700 transition-colors flex items-center gap-2"
                    >
                      {expandedPostId === post.post_id ? 'Hide Comments' : 'Read More & Comment'}
                    </button>
                    <div className="flex items-center gap-4 text-stone-400">
                      <button 
                        onClick={() => handleReaction(post.post_id, post.user_reaction)}
                        className={`transition-colors flex items-center gap-1 ${post.user_reaction ? 'text-red-500' : 'hover:text-red-500'}`}
                      >
                        <Heart className={`h-5 w-5 ${post.user_reaction ? 'fill-current' : ''}`} />
                        <span className="text-sm">{post.likes_count || 0}</span>
                      </button>
                      <button 
                        onClick={() => toggleComments(post.post_id)}
                        className="hover:text-amber-500 transition-colors flex items-center gap-1"
                      >
                        <MessageCircle className="h-5 w-5" />
                        <span className="text-sm">{post.comments_count || 0}</span>
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedPostId === post.post_id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-6 pt-6 border-t border-stone-100 overflow-hidden"
                      >
                        <h3 className="font-serif font-bold text-stone-900 mb-4">Comments</h3>
                        
                        {user ? (
                          <form onSubmit={(e) => submitComment(e, post.post_id)} className="mb-6 flex gap-2">
                            <input
                              type="text"
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              placeholder="Add a comment..."
                              className="flex-grow px-4 py-2 rounded-full border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                            />
                            <button
                              type="submit"
                              disabled={!newComment.trim()}
                              className="bg-amber-600 text-white p-2 rounded-full hover:bg-amber-700 transition-colors disabled:opacity-50"
                            >
                              <Send className="h-4 w-4" />
                            </button>
                          </form>
                        ) : (
                          <div className="mb-6 p-3 bg-stone-100 rounded-lg text-sm text-stone-600 text-center">
                            Please login to leave a comment.
                          </div>
                        )}

                        <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                          {loadingComments ? (
                            <div className="text-center py-4 text-stone-500 text-sm">Loading comments...</div>
                          ) : comments[post.post_id]?.length > 0 ? (
                            comments[post.post_id].map(comment => (
                              <div key={comment.comment_id} className="bg-stone-50 p-3 rounded-xl">
                                <div className="flex justify-between items-start mb-1">
                                  <span className="font-semibold text-sm text-stone-900">
                                    {comment.first_name} {comment.last_name}
                                  </span>
                                  <span className="text-xs text-stone-400">
                                    {format(new Date(comment.created_at), 'MMM d')}
                                  </span>
                                </div>
                                <p className="text-sm text-stone-600">{comment.comment}</p>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-4 text-stone-500 text-sm">No comments yet. Be the first!</div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
