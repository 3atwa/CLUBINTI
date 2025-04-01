import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Activity, Club, Comment } from '../types';
import { Users, Heart, MessageCircle, Share2, Plus, Settings, Bell, BellOff } from 'lucide-react';
import { BackButton } from '../components/BackButton';
import { CreatePostModal } from '../components/CreatePostModal';
import { CommentSection } from '../components/CommentSection';

export function ClubProfile() {
  const { id } = useParams<{ id: string }>();
  const [clubData, setClubData] = useState<Club | null>(null);
  const [posts, setPosts] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoined, setIsJoined] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [expandedComments, setExpandedComments] = useState<string[]>([]);

  useEffect(() => {
    const fetchClubData = async () => {
      try {
        const clubResponse = await fetch(`http://localhost:3002/clubs/${id}`);
        const club = await clubResponse.json();
        setClubData(club);

        const postsResponse = await fetch(`http://localhost:3002/clubs/${club._id}/posts`);
        const clubPosts = await postsResponse.json();
        setPosts(
          clubPosts.map((post: any) => ({
            id: post._id,
            clubId: post.clubId,
            clubName: club.name,
            clubAvatar: club.coverImage,
            title: post.title || 'Untitled Post',
            description: post.description || post.content || '',
            date: post.createdAt,
            image: post.image || '',
            likes: 0, // API doesn't provide likes, assuming 0
            isLiked: false,
            comments: post.comments || [],
          }))
        );
      } catch (error) {
        console.error('Error fetching club data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchClubData();
    }
  }, [id]);

  const isOwner = clubData?.role === 'Owner';

  if (isLoading) {
    return <div className="text-center text-gray-600 dark:text-gray-300">Loading...</div>;
  }

  if (!clubData) {
    return <div className="text-center text-red-500">Club not found</div>;
  }

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

      {/* Club Info */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="flex items-center">
              <img
                src={clubData.coverImage}
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
                <button className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  <Settings size={20} className="mr-2" />
                  Manage Club
                </button>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => setIsJoined(!isJoined)}
                    className={`${
                      isJoined
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    } px-6 py-2 rounded-full font-semibold transition-colors`}
                  >
                    {isJoined ? 'Joined' : 'Join Club'}
                  </button>
                  
                  <button
                    onClick={() => setIsFollowing(!isFollowing)}
                    className={`${
                      isFollowing
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                        : 'border border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400'
                    } px-6 py-2 rounded-full font-semibold transition-colors`}
                  >
                    {isFollowing ? 'Unfollow' : 'Follow'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Club Description */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">About</h2>
            <p className="text-gray-600 dark:text-gray-300">{clubData.description}</p>
          </div>
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

          {posts.length > 0 ? (
            <div className="space-y-6">
              {posts.map((post) => (
                <div key={post.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">{post.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(post.date).toLocaleString()}
                    </p>
                    <p className="mt-4 text-gray-800 dark:text-gray-200">{post.description}</p>
                    {post.image && (
                      <img src={post.image} alt={post.title} className="mt-4 w-full rounded-lg" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 dark:text-gray-300">No posts yet.</p>
          )}
        </div>
      </div>

    </div>
  );
}
