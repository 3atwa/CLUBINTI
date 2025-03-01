import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Activity, Club, CommonMember, Comment } from '../types';
import { Users, Heart, MessageCircle, Share2, Camera, Calendar, Plus, Settings, Bell, BellOff } from 'lucide-react';
import { BackButton } from '../components/BackButton';
import { CreatePostModal } from '../components/CreatePostModal';
import { CommentSection } from '../components/CommentSection';

// Mock data for the club profile
const clubData: Club = {
  id: '1',
  name: 'Photography Club',
  description: 'A community of photography enthusiasts sharing their passion for capturing moments. Join us to learn, share, and grow together in the art of photography.',
  coverImage: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&q=80',
  logo: 'https://images.unsplash.com/photo-1554080353-a576cf803bda?auto=format&fit=crop&q=80',
  memberCount: 156,
  category: 'Arts',
  activities: [],
  ownerId: '1', // Current user's ID
  commonMembers: [
    {
      id: '1',
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80'
    },
    {
      id: '2',
      name: 'Michael Kim',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80'
    },
    {
      id: '3',
      name: 'Emma Watson',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80'
    }
  ]
};

const clubPosts: Activity[] = [
  {
    id: '1',
    clubId: '1',
    clubName: 'Photography Club',
    clubAvatar: clubData.logo,
    title: 'Street Photography Workshop',
    description: 'Amazing shots from our street photography workshop! Our members learned techniques for capturing urban life and architecture. 📸 #StreetPhotography #Workshop',
    date: '2024-03-20',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80',
    likes: 24,
    isLiked: false,
    comments: [
      {
        id: '1',
        userId: '2',
        userName: 'Michael Kim',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80',
        text: 'The workshop was amazing! I learned so much about composition and lighting.',
        date: '2024-03-21T10:30:00Z'
      }
    ]
  },
  {
    id: '2',
    clubId: '1',
    clubName: 'Photography Club',
    clubAvatar: clubData.logo,
    title: 'Nature Photography Exhibition',
    description: 'Preparations for our upcoming nature photography exhibition are in full swing! Here\'s a sneak peek of some stunning submissions. 🌿 #NaturePhotography #Exhibition',
    date: '2024-03-18',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80',
    likes: 42,
    isLiked: true,
    comments: []
  }
];

export function ClubProfile() {
  const { id } = useParams<{ id: string }>();
  const [posts, setPosts] = useState(clubPosts);
  const [isJoined, setIsJoined] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [expandedComments, setExpandedComments] = useState<string[]>([]);
  const isOwner = clubData.ownerId === '1'; // Check if current user is the owner

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          isLiked: !post.isLiked
        };
      }
      return post;
    }));
  };

  const handleJoin = () => {
    setIsJoined(!isJoined);
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const handleCreatePost = (postData: any) => {
    const newPost: Activity = {
      id: String(posts.length + 1),
      clubId: id || '1',
      clubName: clubData.name,
      clubAvatar: clubData.logo,
      title: postData.title,
      description: postData.description,
      date: new Date().toISOString(),
      image: postData.image,
      likes: 0,
      isLiked: false,
      comments: []
    };
    
    setPosts([newPost, ...posts]);
  };

  const toggleComments = (postId: string) => {
    if (expandedComments.includes(postId)) {
      setExpandedComments(expandedComments.filter(id => id !== postId));
    } else {
      setExpandedComments([...expandedComments, postId]);
    }
  };

  const handleAddComment = (postId: string, commentText: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      userId: '1',
      userName: 'John Doe',
      userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80',
      text: commentText,
      date: new Date().toISOString()
    };

    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...(post.comments || []), newComment]
        };
      }
      return post;
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 pb-20">
      {/* Cover Image */}
      <div className="relative h-64 w-full">
        <img
          src={clubData.coverImage}
          alt={clubData.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30" />
        <div className="absolute top-4 left-4">
          <BackButton />
        </div>
      </div>

      {/* Club Info Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="flex items-center">
              <img
                src={clubData.logo}
                alt={clubData.name}
                className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-700 shadow-lg"
              />
              <div className="ml-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{clubData.name}</h1>
                <p className="text-gray-500 dark:text-gray-400">{clubData.category}</p>
              </div>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center gap-3">
              {isOwner ? (
                <button
                  className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <Settings size={20} className="mr-2" />
                  Manage Club
                </button>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={handleJoin}
                    className={`${
                      isJoined
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    } px-6 py-2 rounded-full font-semibold transition-colors flex items-center justify-center`}
                  >
                    {isJoined ? (
                      <>
                        <Users className="w-5 h-5 mr-2" />
                        Joined
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5 mr-2" />
                        Join Club
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={handleFollow}
                    className={`${
                      isFollowing
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                        : 'border border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-700'
                    } px-6 py-2 rounded-full font-semibold transition-colors flex items-center justify-center`}
                  >
                    {isFollowing ? (
                      <>
                        <BellOff className="w-5 h-5 mr-2" />
                        Unfollow
                      </>
                    ) : (
                      <>
                        <Bell className="w-5 h-5 mr-2" />
                        Follow
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Club Stats */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex items-center">
              <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              <span className="ml-2 text-gray-600 dark:text-gray-300">
                <strong className="text-gray-900 dark:text-gray-100">{clubData.memberCount}</strong> members
              </span>
            </div>
            <div className="flex items-center">
              <Camera className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              <span className="ml-2 text-gray-600 dark:text-gray-300">
                <strong className="text-gray-900 dark:text-gray-100">{posts.length}</strong> posts
              </span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              <span className="ml-2 text-gray-600 dark:text-gray-300">
                <strong className="text-gray-900 dark:text-gray-100">2</strong> upcoming events
              </span>
            </div>
          </div>

          {/* Club Description */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">About</h2>
            <p className="text-gray-600 dark:text-gray-300">{clubData.description}</p>
          </div>

          {/* Common Members */}
          {clubData.commonMembers && clubData.commonMembers.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Common Members</h2>
              <div className="flex items-center space-x-2">
                {clubData.commonMembers.map((member) => (
                  <div key={member.id} className="flex flex-col items-center">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-300 mt-1">{member.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Posts Section */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Club Posts</h2>
            {(isJoined || isOwner) && (
              <button
                onClick={() => setIsCreatePostModalOpen(true)}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus size={20} className="mr-2" />
                Create Post
              </button>
            )}
          </div>
          
          <div className="space-y-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex items-center">
                    <img
                      src={post.clubAvatar}
                      alt={post.clubName}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="ml-3">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">{post.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(post.date).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-gray-800 dark:text-gray-200">{post.description}</p>
                  {post.image && (
                    <img
                      src={post.image}
                      alt={post.title}
                      className="mt-4 w-full aspect-video object-cover rounded-lg"
                    />
                  )}
                </div>
                <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center space-x-1 ${
                        post.isLiked ? 'text-red-500' : 'text-gray-600 dark:text-gray-300'
                      } hover:text-red-500 transition-colors`}
                    >
                      <Heart
                        size={20}
                        className={post.isLiked ? 'fill-current' : ''}
                      />
                      <span>{post.likes}</span>
                    </button>
                    <button 
                      onClick={() => toggleComments(post.id)}
                      className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      <MessageCircle size={20} />
                      <span>
                        {post.comments && post.comments.length > 0 
                          ? `Comments (${post.comments.length})` 
                          : 'Comment'}
                      </span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
                      <Share2 size={20} />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
                
                {/* Comment Section */}
                {expandedComments.includes(post.id) && (
                  <div className="px-4 pb-4">
                    <CommentSection 
                      postId={post.id}
                      comments={post.comments || []}
                      onAddComment={handleAddComment}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <CreatePostModal
        isOpen={isCreatePostModalOpen}
        onClose={() => setIsCreatePostModalOpen(false)}
        onSubmit={handleCreatePost}
      />
    </div>
  );
}