import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Activity, Club, Comment } from '../types';
import { Users, Heart, MessageCircle, Share2, Plus, Settings, Bell, BellOff } from 'lucide-react';
import { BackButton } from '../components/BackButton';
import { CreatePostModal } from '../components/CreatePostModal';
import { CommentSection } from '../components/CommentSection';
import { Link } from 'react-router-dom';
import { FollowButton } from '../components/FollowButton';

export function ClubProfile() {
  const { id } = useParams<{ id: string }>();
  const [clubData, setClubData] = useState<Club | null>(null);
  const [posts, setPosts] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [expandedComments, setExpandedComments] = useState<string[]>([]);


  var isOwner = false;
   const userString = localStorage.getItem('user');
   const user = userString? JSON.parse(userString) : null;

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


  const token = localStorage.getItem('access_token');


  useEffect(() => { 
    // Fetch the user's followed clubs from the backend to check if the user is following this club
    const checkFollowingStatus = async () => {
      try {
        const response = await fetch(`http://localhost:3002/user/user/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await response.json();
        console.log(userData);
        if (userData.followedClubs && userData.followedClubs.includes(clubData?._id)) {
          setIsFollowing(true); // Set isFollowing if the club is in the followed clubs list
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    checkFollowingStatus();
  }, [user._id, clubData?._id, token]);





  const toggleComments = (activityId: string) => {
    if (expandedComments.includes(activityId)) {
      setExpandedComments(expandedComments.filter(id => id !== activityId));
    } else {
      setExpandedComments([...expandedComments, activityId]);
    }
  };

  if(clubData && user){
    if(clubData.ownerId === user._id){
      isOwner = true;
    }
  }
  else{
     isOwner = false;
  }


  const handleCreatePost = async (postData: any) => {
    const userString = localStorage.getItem('user');
  
    if (!userString) {
      alert('You need to be logged in to create clubs');
      return;
    }
  
    const user = JSON.parse(userString); // ✅ Parse the user from localStorage
    if (!postData.image) {
      delete postData.image;
    }
    try {
      const response = await fetch(`http://localhost:3002/clubs/${id}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...postData, authorId: user._id }),
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      const newPost = await response.json();
      setPosts((prev) => [newPost, ...prev]);
      setIsCreatePostModalOpen(false);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };




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
                  user && (
                    <FollowButton
                      userId={user._id}
                      clubId={clubData._id}
                      token={localStorage.getItem('access_token') || ''}
                      isFollowing={isFollowing}
                      onToggle={setIsFollowing}
                    />
                  )
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
            {(isOwner) && (
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
                  {/* Post Header */}
                                      <div className="p-4 flex items-center">
                                        <Link to={`/club/${post.clubId}`} className="flex items-center flex-1">
                                          <img
                                            src={clubData.coverImage}
                                            alt={clubData.name}
                                            className="w-12 h-12 rounded-full object-cover"
                                          />
                                          <div className="ml-3">
                                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400">
                                              {post.clubName}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                              {new Date(post.date).toLocaleDateString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                              })}
                                            </p>
                                          </div>
                                        </Link>
                                        <Link
                                          to={`/club/${post.clubId}`}
                                          className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                                        >
                                          <Users size={16} className="mr-1" />
                                          <span>View Club</span>
                                        </Link>
                                      </div>
                  
                                      {/* Post Content */}
                                      <div className="px-4 pb-3">
                                        <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line">{post.description}</p>
                                      </div>
                  
                                      {post.image && (
                                        <img
                                          src={post.image}
                                          alt={post.title}
                                          className="w-full aspect-video object-cover"
                                        />
                                      )}
                  
                                      {/* Post Actions */}
                                      <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700">
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center space-x-4">
                                            <button
                                              className={`flex items-center space-x-1  hover:text-red-500 transition-colors`}
                                            >
                                              <Heart
                                                size={20}
                                                className={post.isLiked ? 'fill-current' : ''}
                                              />
                                              <span>{post.likes}</span>
                                            </button>
                                            <button 
                                              className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                                              onClick={() => toggleComments(post.id)}
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
                                      </div>
                    {/* Comment Section */}
                    {expandedComments.includes(post.id) && (
                      <div className="px-4 pb-4">
                        <CommentSection 
                          postId={post.id}
                          comments={post.comments || []}
                          onAddComment={handleCreatePost}
                        />
                      </div>
                    )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 dark:text-gray-300">No posts yet.</p>
          )}
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
