import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, increment, arrayUnion } from 'firebase/firestore';
import { db } from '../config/firebase';
import useAuthStore from '../store/useAuthStore';
import { format } from 'date-fns';
import { 
  ArrowLeftIcon,
  HeartIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

const MessageThreadPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user, userProfile } = useAuthStore();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    { value: 'general', label: 'General Discussion', color: 'bg-gray-100 text-gray-800' },
    { value: 'workout-tips', label: 'Workout Tips', color: 'bg-blue-100 text-blue-800' },
    { value: 'nutrition', label: 'Nutrition', color: 'bg-green-100 text-green-800' },
    { value: 'progress', label: 'Progress & Achievements', color: 'bg-purple-100 text-purple-800' },
    { value: 'questions', label: 'Questions & Help', color: 'bg-yellow-100 text-yellow-800' },
  ];

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    try {
      const postRef = doc(db, 'messageboard', postId);
      const postSnap = await getDoc(postRef);
      
      if (postSnap.exists()) {
        setPost({ id: postSnap.id, ...postSnap.data() });
      } else {
        console.error('Post not found');
        navigate('/dashboard/messages');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching post:', error);
      setLoading(false);
    }
  };

  const handleLikePost = async () => {
    if (!post) return;
    
    const hasLiked = post.likes?.includes(user.uid);
    
    try {
      const postRef = doc(db, 'messageboard', postId);
      
      if (hasLiked) {
        await updateDoc(postRef, {
          likes: post.likes.filter(id => id !== user.uid),
          likesCount: increment(-1)
        });
      } else {
        await updateDoc(postRef, {
          likes: [...(post.likes || []), user.uid],
          likesCount: increment(1)
        });
      }
      
      fetchPost();
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleAddReply = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    console.log('=== ADDING REPLY ===');
    console.log('Post ID:', postId);
    console.log('Reply content:', replyContent);

    setSubmitting(true);
    try {
      const postRef = doc(db, 'messageboard', postId);
      const newReply = {
        id: Date.now().toString(),
        content: replyContent,
        authorId: user.uid,
        authorName: userProfile?.displayName || 'Anonymous',
        createdAt: new Date().toISOString(),
        likes: [],
        likesCount: 0
      };

      console.log('Updating document with reply:', newReply);
      
      await updateDoc(postRef, {
        replies: arrayUnion(newReply)
      });

      console.log('✅ Reply added successfully!');
      setReplyContent('');
      fetchPost();
    } catch (error) {
      console.error('❌ Error adding reply:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      if (error.code === 'permission-denied') {
        alert('Permission denied. Please update your Firestore rules to allow updates to the messageboard collection.');
      } else {
        alert(`Failed to add reply: ${error.message}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikeReply = async (replyId) => {
    if (!post) return;

    try {
      const postRef = doc(db, 'messageboard', postId);
      const updatedReplies = post.replies.map(reply => {
        if (reply.id === replyId) {
          const hasLiked = reply.likes?.includes(user.uid);
          return {
            ...reply,
            likes: hasLiked 
              ? reply.likes.filter(id => id !== user.uid)
              : [...(reply.likes || []), user.uid],
            likesCount: hasLiked 
              ? (reply.likesCount || 0) - 1 
              : (reply.likesCount || 0) + 1
          };
        }
        return reply;
      });

      await updateDoc(postRef, {
        replies: updatedReplies
      });

      fetchPost();
    } catch (error) {
      console.error('Error liking reply:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <p className="text-gray-500">Post not found</p>
          <button
            onClick={() => navigate('/dashboard/messages')}
            className="mt-4 text-primary-600 hover:text-primary-700"
          >
            Back to Message Board
          </button>
        </div>
      </div>
    );
  }

  const category = categories.find(c => c.value === post.category);
  const hasLiked = post.likes?.includes(user.uid);

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate('/dashboard/messages')}
        className="mb-6 inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeftIcon className="h-4 w-4 mr-2" />
        Back to Message Board
      </button>

      {/* Original Post */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${category?.color || 'bg-gray-100 text-gray-800'}`}>
            {category?.label || post.category}
          </span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {post.title}
        </h1>

        <p className="text-gray-700 mb-4 whitespace-pre-wrap">
          {post.content}
        </p>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <span className="font-medium text-gray-900">
            {post.authorName}
          </span>
          <span>•</span>
          <span>
            {format(new Date(post.createdAt), 'MMM d, yyyy - h:mm a')}
          </span>
        </div>

        {/* Like Button */}
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={handleLikePost}
            className={`flex items-center gap-2 ${hasLiked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'} transition-colors`}
          >
            {hasLiked ? (
              <HeartSolidIcon className="h-5 w-5" />
            ) : (
              <HeartIcon className="h-5 w-5" />
            )}
            <span className="text-sm font-medium">
              {post.likesCount || 0} {(post.likesCount || 0) === 1 ? 'Like' : 'Likes'}
            </span>
          </button>
        </div>
      </div>

      {/* Replies Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <ChatBubbleLeftIcon className="h-6 w-6" />
          Replies ({post.replies?.length || 0})
        </h2>

        {/* Reply Form */}
        <form onSubmit={handleAddReply} className="mb-6">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="Add your reply..."
            required
          />
          <div className="mt-2 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
            >
              {submitting ? 'Posting...' : 'Post Reply'}
            </button>
          </div>
        </form>

        {/* Replies List */}
        <div className="space-y-4">
          {post.replies?.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No replies yet. Be the first to reply!
            </p>
          ) : (
            post.replies?.map((reply) => {
              const hasLikedReply = reply.likes?.includes(user.uid);
              
              return (
                <div key={reply.id} className="border-l-2 border-gray-200 pl-4 py-2">
                  <p className="text-gray-700 mb-2 whitespace-pre-wrap">
                    {reply.content}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                    <span className="font-medium text-gray-900">
                      {reply.authorName}
                    </span>
                    <span>•</span>
                    <span>
                      {format(new Date(reply.createdAt), 'MMM d, yyyy - h:mm a')}
                    </span>
                  </div>
                  <button
                    onClick={() => handleLikeReply(reply.id)}
                    className={`flex items-center gap-1 ${hasLikedReply ? 'text-red-600' : 'text-gray-400 hover:text-red-600'} transition-colors`}
                  >
                    {hasLikedReply ? (
                      <HeartSolidIcon className="h-4 w-4" />
                    ) : (
                      <HeartIcon className="h-4 w-4" />
                    )}
                    <span className="text-xs">
                      {reply.likesCount || 0}
                    </span>
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageThreadPage;
