import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import toast from 'react-hot-toast';
import { AlertCircle, MessageSquare, CheckCircle, Clock, Send, X } from 'lucide-react';
import { format } from 'date-fns';
import { AnimatePresence, motion } from 'motion/react';

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
  status: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
};

export default function AdminIssues() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedIssueId, setExpandedIssueId] = useState<number | null>(null);
  const [comments, setComments] = useState<Record<number, Comment[]>>({});
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      const res = await fetch('/api/admin/issues', {
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

  const handleStatusChange = async (id: number, status: string) => {
    try {
      const res = await fetch(`/api/admin/issues/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status })
      });

      if (res.ok) {
        toast.success(`Issue status updated to ${status}`);
        fetchIssues();
      } else {
        toast.error('Failed to update issue status');
      }
    } catch (error) {
      toast.error('An error occurred');
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
    <AdminLayout>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-stone-900">Issue Reports</h1>
          <p className="text-stone-600">Manage and resolve customer issues.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 text-stone-600 text-sm uppercase tracking-wider border-b border-stone-200">
                <th className="p-4 font-medium">ID</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Issue Details</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-stone-500">Loading issues...</td>
                </tr>
              ) : issues.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-stone-500">No issues found.</td>
                </tr>
              ) : (
                issues.map((issue) => (
                  <React.Fragment key={issue.issue_id}>
                    <tr className="hover:bg-stone-50 transition-colors">
                    <td className="p-4 text-stone-500 text-sm">#{issue.issue_id}</td>
                    <td className="p-4">
                      <div className="font-medium text-stone-900">{issue.first_name} {issue.last_name}</div>
                      <div className="text-xs text-stone-500">{issue.email}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-stone-900 mb-1">{issue.title}</div>
                      <div className="text-sm text-stone-600 max-w-md line-clamp-2">{issue.description}</div>
                    </td>
                    <td className="p-4 text-sm text-stone-600">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-stone-400" />
                        {format(new Date(issue.created_at), 'MMM d, yyyy')}
                      </div>
                      <div className="text-xs text-stone-400 mt-1">
                        {format(new Date(issue.created_at), 'h:mm a')}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                        issue.status === 'Open' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {issue.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => toggleComments(issue.issue_id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors border border-blue-200"
                        >
                          <MessageSquare className="h-4 w-4" /> Reply
                        </button>
                        {issue.status === 'Open' ? (
                          <button
                            onClick={() => handleStatusChange(issue.issue_id, 'Closed')}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-green-600 hover:bg-green-50 transition-colors border border-green-200"
                          >
                            <CheckCircle className="h-4 w-4" /> Mark Resolved
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStatusChange(issue.issue_id, 'Open')}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-amber-600 hover:bg-amber-50 transition-colors border border-amber-200"
                          >
                            <AlertCircle className="h-4 w-4" /> Reopen
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                  {expandedIssueId === issue.issue_id && (
                    <tr className="bg-stone-50/50">
                      <td colSpan={6} className="p-0">
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="p-6 border-t border-stone-100"
                        >
                          <h3 className="font-serif font-bold text-stone-900 mb-4">Conversation</h3>
                          
                          <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                            {loadingComments ? (
                              <div className="text-center py-4 text-stone-500 text-sm">Loading...</div>
                            ) : comments[issue.issue_id]?.length > 0 ? (
                              comments[issue.issue_id].map(comment => (
                                <div key={comment.comment_id} className={`p-3 rounded-xl max-w-[80%] ${comment.user_role === 'Admin' ? 'bg-amber-100 ml-auto' : 'bg-white border border-stone-200'}`}>
                                  <div className="flex justify-between items-start mb-1">
                                    <span className="font-semibold text-sm text-stone-900">
                                      {comment.first_name} {comment.last_name} {comment.user_role === 'Admin' && '(Admin)'}
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
                              className="flex-grow px-4 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                            />
                            <button
                              type="submit"
                              disabled={!newComment.trim()}
                              className="bg-amber-600 text-white px-4 py-2 rounded-xl hover:bg-amber-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                              <Send className="h-4 w-4" /> Send
                            </button>
                          </form>
                        </motion.div>
                      </td>
                    </tr>
                  )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
