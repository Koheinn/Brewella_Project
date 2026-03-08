import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { Plus, Edit, Trash2, Image as ImageIcon } from 'lucide-react';

type Post = {
  post_id: number;
  title: string;
  content: string;
  image_path: string;
  post_type: 'news' | 'event';
  status: 'published' | 'draft';
  created_at: string;
  first_name: string;
  last_name: string;
};

export default function AdminPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const [isAdding, setIsAdding] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    post_type: 'news',
    status: 'published',
    existing_image: ''
  });

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/admin/posts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('post_type', formData.post_type);
      formDataToSend.append('status', formData.status);
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      } else if (editingPost) {
        formDataToSend.append('existing_image', formData.existing_image);
      }

      const url = editingPost ? `/api/admin/posts/${editingPost.post_id}` : '/api/admin/posts';
      const method = editingPost ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (res.ok) {
        toast.success(`Post ${editingPost ? 'updated' : 'created'} successfully`);
        setIsAdding(false);
        setEditingPost(null);
        setFormData({ title: '', content: '', post_type: 'news', status: 'published', existing_image: '' });
        setImageFile(null);
        fetchPosts();
      } else {
        toast.error('Failed to save post');
      }
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error('Failed to save post');
    }
  };

  const editPost = (post: Post) => {
    setEditingPost(post);
    setFormData({ 
      title: post.title, 
      content: post.content, 
      post_type: post.post_type, 
      status: post.status,
      existing_image: post.image_path 
    });
    setImageFile(null);
    setIsAdding(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success('Post deleted successfully');
        fetchPosts();
      } else {
        toast.error('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-stone-900">News & Events</h1>
          <p className="text-stone-600">Manage posts and announcements.</p>
        </div>
        <button
          onClick={() => { setIsAdding(!isAdding); setEditingPost(null); setFormData({ title: '', content: '', post_type: 'news', status: 'published', existing_image: '' }); setImageFile(null); }}
          className="bg-amber-600 text-white px-4 py-2 rounded-xl hover:bg-amber-700 transition-colors flex items-center gap-2"
        >
          {isAdding ? 'Cancel' : <><Plus className="h-5 w-5" /> Add Post</>}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 mb-8">
          <h2 className="text-xl font-bold text-stone-900 mb-4">{editingPost ? 'Edit' : 'Add New'} Post</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Content</label>
              <textarea
                required
                rows={4}
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="w-full px-4 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              {editingPost && formData.existing_image && !imageFile && (
                <div className="mt-2 text-sm text-stone-600">Current: {formData.existing_image}</div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Type</label>
                <select
                  value={formData.post_type}
                  onChange={(e) => setFormData({...formData, post_type: e.target.value as any})}
                  className="w-full px-4 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="news">News</option>
                  <option value="event">Event</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                  className="w-full px-4 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="bg-stone-900 text-white px-6 py-2 rounded-xl hover:bg-stone-800 transition-colors"
              >
                Save Post
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-100">
                <th className="p-4 font-semibold text-stone-600 text-sm">Title</th>
                <th className="p-4 font-semibold text-stone-600 text-sm">Type</th>
                <th className="p-4 font-semibold text-stone-600 text-sm">Status</th>
                <th className="p-4 font-semibold text-stone-600 text-sm">Author</th>
                <th className="p-4 font-semibold text-stone-600 text-sm">Date</th>
                <th className="p-4 font-semibold text-stone-600 text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-stone-500">Loading posts...</td>
                </tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-stone-500">No posts found.</td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.post_id} className="border-b border-stone-50 hover:bg-stone-50/50 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-stone-900">{post.title}</div>
                      <div className="text-xs text-stone-500 truncate max-w-xs">{post.content}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        post.post_type === 'event' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {post.post_type}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-stone-100 text-stone-800'
                      }`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-stone-600">
                      {post.first_name} {post.last_name}
                    </td>
                    <td className="p-4 text-sm text-stone-600">
                      {format(new Date(post.created_at), 'MMM d, yyyy')}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => editPost(post)}
                          className="text-blue-500 hover:text-blue-700 transition-colors p-2"
                          title="Edit Post"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(post.post_id)}
                          className="text-red-500 hover:text-red-700 transition-colors p-2"
                          title="Delete Post"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
