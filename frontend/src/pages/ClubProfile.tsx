import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Activity, Club } from '../types';
import { Users, Heart, MessageCircle, Share2, Plus, Settings, Trash2 } from 'lucide-react';
import { BackButton } from '../components/BackButton';
import { CreatePostModal } from '../components/CreatePostModal';
import { CommentSection } from '../components/CommentSection';
import { Link } from 'react-router-dom';
import { FollowButton } from '../components/FollowButton';
import { EditClubModal } from '../components/EditClub';
import { DeleteConfirmationModal } from '../components/DeleteConfirmationModal';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  sub: string;
  // Add other fields if needed like email, exp, etc.
}
export function ClubProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [clubData, setClubData] = useState<Club | null>(null);
  const [posts, setPosts] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [expandedComments, setExpandedComments] = useState<string[]>([]);
  const [isEditClubModalOpen, setIsEditClubModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  var isOwner = false;
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  let decoded: DecodedToken | null = null;

  const token = localStorage.getItem('access_token') || "";
  if (token !== "") {
    decoded = jwtDecode<DecodedToken>(token);
  } 
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
            clubCover: club.coverImage,
            clubAvatar: club.logo,
            title: post.title || 'Untitled Post',
            description: post.description || post.content || '',
            date: post.createdAt,
            image: post.image || '',
            likes: [], // API doesn't provide likes, assuming 0
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


  useEffect(() => {
    const checkFollowingStatus = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token || !clubData?._id) return;
  
        const decoded = jwtDecode<DecodedToken>(token);       
        const userId = decoded.sub;
        const response = await fetch(`http://localhost:3002/user/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        const userData = await response.json();
  
        if (userData.followedClubs && userData.followedClubs.includes(clubData._id)) {
          setIsFollowing(true);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    checkFollowingStatus();
  }, [clubData?._id]);

  const handleClubUpdate = (updatedClub: Partial<Club>) => {
    setClubData((clubData) => {
      // Check if prevClubData is not null before merging
      if (clubData) {
        return { ...clubData, ...updatedClub };
      }
      return clubData; // Return null if prevClubData is null
    });
  };

  const handleDeleteClub = async () => {
    if (!id || !token) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`http://localhost:3002/clubs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete club');
      }

          // Step 2: Call the cleanup API to remove references to the club from other users' data
    const cleanUpResponse = await fetch('http://localhost:3002/clubs/Id/cleanup/clean/id', {
      method: 'GET',
    });

    if (!cleanUpResponse.ok) {
      throw new Error('Failed to clean up club references');
    }

      // Success! Navigate back to a safe place
      navigate('/explore'); 
      
    } catch (error) {
      console.error('Error deleting club:', error);
      alert('Failed to delete club. Please try again.');
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  const toggleComments = (activityId: string) => {
    if (expandedComments.includes(activityId)) {
      setExpandedComments(expandedComments.filter(id => id !== activityId));
    } else {
      setExpandedComments([...expandedComments, activityId]);
    }
  };

  if (clubData && user && decoded) {
    if (clubData.ownerId === decoded.sub) {
      isOwner = true;
    }
  } else {
    isOwner = false;
  }

  const handleCreatePost = async (postData: any) => {
    const userString = localStorage.getItem('user');
  
    if (!userString) {
      alert('You need to be logged in to create clubs');
      return;
    }
      if (!postData.image) {
      delete postData.image;
    }
    try {
      const response = await fetch(`http://localhost:3002/clubs/${id}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...postData, authorId: decoded?.sub }),
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


  const handleDeletePost = async (postId: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this post?');
    if (!confirmed) return;
  
    try {
      const token = localStorage.getItem('access_token') || '';
      const response = await fetch(`http://localhost:3002/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete post');
      }
  
      // Remove post from state
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Could not delete post. Please try again.');
    }
  };
  

  const handleLike = async (activityId: string) => {
    if (!user || !decoded) return;
      
    // Optimistic update
    setPosts(posts.map(activity => {
      if (activity.id === activityId) {
        return {
          ...activity,
          likes: [...activity.likes, decoded.sub], // Add user ID to likes array
          isLiked: true, // Mark this post as liked
        };
      }
      return activity;
    }));
  
    // Send API call to like the post
    try {
      await fetch(`http://localhost:3002/posts/${activityId}/like/${decoded.sub}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
    } catch (error) {
      console.error('Failed to like post:', error);
      // Revert the optimistic update if the API call fails
    }
  };
  const handleUnlike = async (activityId: string) => {
    if (!user || !decoded) return;
    // Optimistic update
    setPosts(posts.map(activity => {
      if (activity.id === activityId) {
        return {
          ...activity,
          likes: activity.likes.filter(like => like !== decoded.sub), // Remove user ID from likes array
          isLiked: false, // Mark this post as unliked
        };
      }
      return activity;
    }));
  
    // Send API call to unlike the post
    try {
      await fetch(`http://localhost:3002/posts/${activityId}/unlike/${decoded.sub}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
    } catch (error) {
      console.error('Failed to unlike post:', error);
      // Revert the optimistic update if the API call fails
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
                <>
                  <button 
                    onClick={() => setIsEditClubModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Settings size={20} className="mr-2" />
                    Manage Club
                  </button>
                  <button 
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full font-semibold hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                  >
                    <Trash2 size={20} className="mr-2" />
                    Delete Club
                  </button>
                </>
              ) : (
                user && decoded && (
                  <FollowButton
                    userId={decoded.sub}
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
              {posts.map((post) => {
               const isLiked = post.likes.includes(user?._id); 
                return(
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
                    {isOwner && (
                    <div className="flex justify-end px-4 pb-3">
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="flex items-center text-sm text-red-600 dark:text-red-400 hover:underline"
                      >
                        <Trash2 size={16} className="mr-1" />
                        Delete Post
                      </button>
                    </div>
                  )}
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
                                            onClick={() => {
                                              if (isLiked) {
                                                handleUnlike(post.id); // If already liked, trigger unlike
                                              } else {
                                                handleLike(post.id); // If not liked, trigger like
                                              }
                                            }}
                                            className={`flex items-center space-x-1 ${
                                              isLiked ? 'text-red-500' : 'text-gray-600 dark:text-gray-300'
                                            } hover:text-red-500 transition-colors`}
                                          >
                          <Heart
                            size={20}
                            className={isLiked ? 'fill-current' : ''}
                          />
                          <span>{post.likes.length}</span>
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
                );
})}
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
      <EditClubModal
        isOpen={isEditClubModalOpen}
        onClose={() => setIsEditClubModalOpen(false)}
        club={clubData}
        onSave={handleClubUpdate}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteClub}
        title="Delete Club"
        message="Are you sure you want to delete this club? This action cannot be undone and all club posts will be permanently deleted."
        confirmLabel="Delete Club"
        isLoading={isDeleting}
      />
    </div>
  );
}