import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import useAuthStore from '../store/useAuthStore';
import { format, formatDistanceToNow } from 'date-fns';
import { 
  PlusIcon, 
  ChatBubbleLeftIcon,
  HeartIcon,
  ChevronRightIcon,
  FolderIcon
} from '@heroicons/react/24/outline';

const MessageBoardPage = () => {
  const navigate = useNavigate();
  const { user, userProfile } = useAuthStore();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'general' });
  const [loading, setLoading] = useState(true);
  const [showNewPost, setShowNewPost] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const postsRef = collection(db, 'messageboard');
      const q = query(postsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const postsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content) return;

    try {
      await addDoc(collection(db, 'messageboard'), {
        ...newPost,
        authorId: user.uid,
        authorName: userProfile?.displayName || 'Anonymous',
        createdAt: new Date().toISOString(),
        likes: [],
        likesCount: 0,
        replies: []
      });

      setNewPost({ title: '', content: '', category: 'general' });
      setShowNewPost(false);
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post');
    }
  };


  const categories = [
    { 
      value: 'general', 
      label: 'General Discussion', 
      color: 'bg-gray-100 text-gray-800',
      icon: '💬',
      description: 'Chat about anything gym or fitness related'
    },
    { 
      value: 'workout-tips', 
      label: 'Workout Tips', 
      color: 'bg-blue-100 text-blue-800',
      icon: '💪',
      description: 'Share and discover effective workout techniques'
    },
    { 
      value: 'nutrition', 
      label: 'Nutrition', 
      color: 'bg-green-100 text-green-800',
      icon: '🥗',
      description: 'Discuss meal plans, recipes, and diet advice'
    },
    { 
      value: 'progress', 
      label: 'Progress & Achievements', 
      color: 'bg-purple-100 text-purple-800',
      icon: '🏆',
      description: 'Celebrate your fitness journey and milestones'
    },
    { 
      value: 'questions', 
      label: 'Questions & Help', 
      color: 'bg-yellow-100 text-yellow-800',
      icon: '❓',
      description: 'Ask questions and get help from the community'
    },
  ];

  const getPostsByCategory = (categoryValue) => {
    return posts.filter(post => post.category === categoryValue);
  };

  const getCategoryStats = (categoryValue) => {
    const categoryPosts = getPostsByCategory(categoryValue);
    const totalReplies = categoryPosts.reduce((sum, post) => sum + (post.replies?.length || 0), 0);
    return {
      postCount: categoryPosts.length,
      replyCount: totalReplies,
      latestPost: categoryPosts[0] // Already sorted by date desc
    };
  };

  const filteredPosts = selectedCategory 
    ? getPostsByCategory(selectedCategory)
    : posts;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Message Board</h1>
          <p className="mt-1 text-sm text-gray-500">
            Connect with fellow members, share tips, and ask questions
          </p>
        </div>
        <button
          onClick={() => setShowNewPost(!showNewPost)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          New Post
        </button>
      </div>

      {/* New Post Form */}
      {showNewPost && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <form onSubmit={handleCreatePost}>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="What's on your mind?"
                  required
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  id="category"
                  value={newPost.category}
                  onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  id="content"
                  rows={4}
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Share your thoughts, tips, or questions..."
                  required
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewPost(false);
                    setNewPost({ title: '', content: '', category: 'general' });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                >
                  Post
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Category Filter Tabs */}
      {posts.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === null
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            All Categories
          </button>
          {categories.map(cat => {
            const stats = getCategoryStats(cat.value);
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === cat.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                {cat.icon} {cat.label} ({stats.postCount})
              </button>
            );
          })}
        </div>
      )}

      {/* Category Sections or Posts List */}
      {posts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <ChatBubbleLeftIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No posts yet</h3>
          <p className="mt-1 text-sm text-gray-500">Be the first to start a conversation!</p>
        </div>
      ) : selectedCategory === null ? (
        // Category Overview
        <div className="space-y-6">
          {categories.map(category => {
            const stats = getCategoryStats(category.value);
            const categoryPosts = getPostsByCategory(category.value);
            
            if (categoryPosts.length === 0) return null;

            return (
              <div key={category.value} className="bg-white shadow rounded-lg overflow-hidden">
                {/* Category Header */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{category.icon}</span>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">{category.label}</h2>
                        <p className="text-sm text-gray-600">{category.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">
                        <span className="font-semibold text-gray-900">{stats.postCount}</span> discussions
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-semibold text-gray-900">{stats.replyCount}</span> replies
                      </div>
                    </div>
                  </div>
                </div>

                {/* Discussions List */}
                <div className="divide-y divide-gray-200">
                  {categoryPosts.slice(0, 5).map(post => (
                    <button
                      key={post.id}
                      onClick={() => navigate(`/dashboard/messages/${post.id}`)}
                      className="w-full px-6 py-4 hover:bg-gray-50 transition-colors text-left flex items-center justify-between group"
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-gray-900 group-hover:text-primary-600 mb-1 flex items-center gap-2">
                          <ChatBubbleLeftIcon className="h-5 w-5 flex-shrink-0" />
                          {post.title}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span className="font-medium text-gray-700">{post.authorName}</span>
                          <span>•</span>
                          <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <HeartIcon className="h-4 w-4" />
                            {post.likesCount || 0}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <ChatBubbleLeftIcon className="h-4 w-4" />
                            {post.replies?.length || 0} replies
                          </span>
                        </div>
                      </div>
                      <ChevronRightIcon className="h-5 w-5 text-gray-400 group-hover:text-primary-600 flex-shrink-0 ml-4" />
                    </button>
                  ))}
                </div>

                {/* View All Link */}
                {categoryPosts.length > 5 && (
                  <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                    <button
                      onClick={() => setSelectedCategory(category.value)}
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                      View all {categoryPosts.length} discussions →
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        // Filtered Posts List
        <div className="space-y-3">
          {filteredPosts.map(post => (
            <button
              key={post.id}
              onClick={() => navigate(`/dashboard/messages/${post.id}`)}
              className="w-full bg-white shadow rounded-lg px-6 py-4 hover:bg-gray-50 transition-colors text-left flex items-center justify-between group"
            >
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 mb-2 flex items-center gap-2">
                  <ChatBubbleLeftIcon className="h-5 w-5 flex-shrink-0" />
                  {post.title}
                </h3>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span className="font-medium text-gray-700">{post.authorName}</span>
                  <span>•</span>
                  <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <HeartIcon className="h-4 w-4" />
                    {post.likesCount || 0}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <ChatBubbleLeftIcon className="h-4 w-4" />
                    {post.replies?.length || 0} replies
                  </span>
                </div>
              </div>
              <ChevronRightIcon className="h-5 w-5 text-gray-400 group-hover:text-primary-600 flex-shrink-0 ml-4" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessageBoardPage;
