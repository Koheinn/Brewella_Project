import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AlertCircle, MessageSquare, Send, Clock, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';

type Comment = {
  comment_id: number;
  issue_id: number;
  user_id: number;
  comment: string;
  created_at: string;
  first_name: string;
  last_name: string;
  user_role: string;
};

type Issue = {
  issue_id: number;
  title: string;
  description: string;
  status: 'Open' | 'Closed';
  created_at: string;
};

export default function ReportIssue() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [expandedIssueId, setExpandedIssueId] = useState<number | null>(null);
  const [comments, setComments] = useState<Record<number, Comment[]>>({});
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });

  useEffect(() => {
    if (user) {
      fetchIssues();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchIssues = async () => {
    try {
      const res = await fetch('/api/issues/me', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setIssues(data);
      }
    } catch (error) {
      console.error('Error fetching issues:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to report an issue');
      navigate('/login', { state: { from: '/report-issue' } });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/issues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        toast.success('Issue reported successfully!');
        setFormData({ title: '', description: '' });
        fetchIssues();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to report issue');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleComments = async (issueId: number) => {
    if (expandedIssueId === issueId) {
      setExpandedIssueId(null);
      return;
    }

    setExpandedIssueId(issueId);
    if (!comments[issueId]) {
      setLoadingComments(true);
      try {
        const res = await fetch(`/api/issues/${issueId}/comments`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.ok) {
          const data = await res.json();
          setComments(prev => ({ ...prev, [issueId]: data }));
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setLoadingComments(false);
      }
    }
  };

  const submitComment = async (e: React.FormEvent, issueId: number) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await fetch(`/api/issues/${issueId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ comment: newComment })
      });

      if (res.ok) {
        const data = await res.json();
        setComments(prev => ({
          ...prev,
          [issueId]: [...(prev[issueId] || []), data]
        }));
        setNewComment('');
        toast.success('Reply added');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add reply');
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
            Report an <span className="text-amber-600 italic">Issue</span>
          </motion.h1>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            We strive for perfection, but if something went wrong, let us know. We're here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Form */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100"
          >
            <h2 className="text-2xl font-serif font-bold text-stone-900 mb-6 flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-amber-500" />
              Submit New Issue
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Issue Title *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MessageSquare className="h-5 w-5 text-stone-400" />
                  </div>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="pl-10 w-full rounded-xl border-stone-300 shadow-sm focus:ring-amber-500 focus:border-amber-500 py-3 bg-stone-50"
                    placeholder="Brief summary of the issue"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Description *</label>
                <textarea
                  name="description"
                  required
                  rows={6}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full rounded-xl border-stone-300 shadow-sm focus:ring-amber-500 focus:border-amber-500 p-4 bg-stone-50"
                  placeholder="Please provide as much detail as possible..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors disabled:opacity-70"
              >
                <Send className="h-5 w-5" />
                {submitting ? 'Submitting...' : 'Submit Issue'}
              </button>
              {!user && (
                <p className="text-center text-sm text-stone-500 mt-4">
                  You will be redirected to login before submitting.
                </p>
              )}
            </form>
          </motion.div>

          {/* Previous Issues */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-stone-100 p-8 rounded-3xl border border-stone-200"
          >
            <h2 className="text-2xl font-serif font-bold text-stone-900 mb-6 flex items-center gap-3">
              <Clock className="h-6 w-6 text-stone-500" />
              Your Previous Reports
            </h2>

            {!user ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-stone-300">
                <p className="text-stone-500">Please login to view your reported issues.</p>
                <button onClick={() => navigate('/login')} className="mt-4 text-amber-600 font-medium hover:text-amber-700">
                  Login Now
                </button>
              </div>
            ) : loading ? (
              <div className="text-center py-8 text-stone-500">Loading issues...</div>
            ) : issues.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-stone-300">
                <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-3" />
                <p className="text-stone-500">You haven't reported any issues yet.</p>
                <p className="text-sm text-stone-400 mt-1">That's great news!</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {issues.map((issue) => (
                  <div key={issue.issue_id} className="bg-white rounded-2xl shadow-sm border border-stone-100 hover:border-amber-200 transition-colors overflow-hidden">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-stone-900 text-lg">{issue.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          issue.status === 'Open' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {issue.status}
                        </span>
                      </div>
                      <p className="text-stone-600 text-sm mb-4 line-clamp-2">{issue.description}</p>
                      <div className="flex justify-between items-center text-xs text-stone-400 border-t border-stone-50 pt-3">
                        <div className="flex gap-4">
                          <span>ID: #{issue.issue_id}</span>
                          <span>{format(new Date(issue.created_at), 'MMM d, yyyy h:mm a')}</span>
                        </div>
                        <button 
                          onClick={() => toggleComments(issue.issue_id)}
                          className="flex items-center gap-1 text-amber-600 hover:text-amber-700 font-medium transition-colors"
                        >
                          <MessageSquare className="h-4 w-4" />
                          {expandedIssueId === issue.issue_id ? 'Hide Replies' : 'View Replies'}
                          {expandedIssueId === issue.issue_id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    
                    <AnimatePresence>
                      {expandedIssueId === issue.issue_id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="bg-stone-50 border-t border-stone-100"
                        >
                          <div className="p-6">
                            <h4 className="font-serif font-bold text-stone-900 mb-4 text-sm uppercase tracking-wider">Conversation</h4>
                            
                            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                              {loadingComments ? (
                                <div className="text-center py-4 text-stone-500 text-sm">Loading...</div>
                              ) : comments[issue.issue_id]?.length > 0 ? (
                                comments[issue.issue_id].map(comment => (
                                  <div key={comment.comment_id} className={`p-3 rounded-xl max-w-[85%] ${comment.user_id === user?.user_id ? 'bg-amber-100 ml-auto' : 'bg-white border border-stone-200'}`}>
                                    <div className="flex justify-between items-start mb-1">
                                      <span className="font-semibold text-sm text-stone-900">
                                        {comment.user_id === user?.user_id ? 'You' : `${comment.first_name} ${comment.last_name} ${comment.user_role === 'Admin' ? '(Admin)' : ''}`}
                                      </span>
                                      <span className="text-xs text-stone-500">
                                        {format(new Date(comment.created_at), 'MMM d, h:mm a')}
                                      </span>
                                    </div>
                                    <p className="text-sm text-stone-700">{comment.comment}</p>
                                  </div>
                                ))
                              ) : (
                                <div className="text-center py-4 text-stone-500 text-sm">No replies yet.</div>
                              )}
                            </div>

                            <form onSubmit={(e) => submitComment(e, issue.issue_id)} className="flex gap-2">
                              <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Type a reply..."
                                className="flex-grow px-4 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm bg-white"
                              />
                              <button
                                type="submit"
                                disabled={!newComment.trim()}
                                className="bg-amber-600 text-white px-4 py-2 rounded-xl hover:bg-amber-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                              >
                                <Send className="h-4 w-4" /> Send
                              </button>
                            </form>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
}
