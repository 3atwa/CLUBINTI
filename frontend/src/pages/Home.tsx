import { useState, useEffect } from 'react';
import { Activity, Club } from '../types';
import { Heart, MessageCircle, Share2, Users, Award, Sparkles } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import { CommentSection } from '../components/CommentSection';
import Ranking from '../components/Ranking';
import { jwtDecode } from 'jwt-decode';
interface DecodedToken {
  sub: string;
  // Add other fields if needed like email, exp, etc.
}

export function Home() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [expandedComments, setExpandedComments] = useState<string[]>([]);
  const [followedClubs, setFollowedClubs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  let decoded: DecodedToken | null = null;

  const token = localStorage.getItem('access_token') || "";
  if (token !== "") {
    decoded = jwtDecode<DecodedToken>(token);
  } 
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  // Fetch user data and followed clubs
  useEffect(() => {
    const fetchUserData = async () => {
      if (token=="" || !decoded) return;
      try {
        const response = await fetch(`http://localhost:3002/user/user/${decoded.sub}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (!response.ok) throw new Error('Failed to fetch user data');
        
        const userData = await response.json();
        if (userData.followedClubs) {
          setFollowedClubs(userData.followedClubs);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [user?._id, token]);

  
  // Fetch posts and clubs data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        // Fetch all clubs in one request
        const clubsResponse = await fetch('http://localhost:3002/clubs');
        if (!clubsResponse.ok) {
          throw new Error('Failed to fetch clubs');
        }
        const clubs: Club[] = await clubsResponse.json();

        // Use Promise.all to fetch posts for all clubs in parallel
        const postsPromises = clubs.map(club => 
          fetch(`http://localhost:3002/clubs/${club._id}/posts`)
            .then(res => {
              if (!res.ok) throw new Error(`Failed to fetch posts for club ${club._id}`);
              return res.json();
            })
            .then(posts => ({
              club,
              posts
            }))
        );
        
        const clubsWithPosts = await Promise.all(postsPromises);
        
        // Process all posts
        const allActivities = clubsWithPosts.flatMap(({ club, posts }) => 
          posts.map((post: any) => ({
            id: post._id,
            clubId: club._id,
            clubName: club.name,
            clubAvatar: club.coverImage,
            title: post.title || '',
            description: post.description || post.content || '',
            date: post.createdAt,
            image: post.image || '',
            likes: post.likes || [],
            isLiked: false,
            comments: post.comments || [],
            isFollowed: followedClubs.includes(club._id)
          }))
        );
        
        // Sort by date (newest first) and then by followed status
        const sortedActivities = allActivities.sort((a, b) => {
          // First sort by followed status
          if (a.isFollowed && !b.isFollowed) return -1;
          if (!a.isFollowed && b.isFollowed) return 1;
          
          // Then sort by date (newest first)
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        
        setActivities(sortedActivities);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [followedClubs]);

  const handleLike = async (activityId: string) => {
    if (!user || !decoded) return;
      
    // Optimistic update
    setActivities(activities.map(activity => {
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
    setActivities(activities.map(activity => {
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

  const toggleComments = (activityId: string) => {
    setExpandedComments(prev => 
      prev.includes(activityId) 
        ? prev.filter(id => id !== activityId)
        : [...prev, activityId]
    );
  };

  const handleAddComment = async ( commentText: string) => {
    if(!user  || !decoded ) {
      <Navigate to={'/login'}/>
    };
    
    const newComment = {
      id: Date.now().toString(),
      userId: user.sub,
      userName: user.name || 'Anonymous User',
      userAvatar: user.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80',
      text: commentText,
      date: new Date().toISOString()
    };


  };

  // Find the index where followed posts end and suggestions begin
  const firstSuggestionIndex = activities.findIndex(activity => !activity.isFollowed);
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 pb-20">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          {/* Top Clubs Banner */}
          <div className="mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-md overflow-hidden">
            <div className="p-6 flex flex-col sm:flex-row items-center justify-between">
              <div className="text-white mb-4 sm:mb-0">
                <h2 className="text-2xl font-bold flex items-center">
                  <Award className="w-6 h-6 mr-2" />
                  Club Rankings
                </h2>
                <p className="mt-1 opacity-90">Discover the top performing clubs on campus</p>
              </div>
              <Link
                to="/top-clubs"
                className="px-6 py-2 bg-white text-indigo-600 rounded-full font-semibold hover:bg-gray-100 transition-colors"
              >
                View Rankings
              </Link>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Recent Activities Feed */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">Latest Updates</h2>
              
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  {activities.map((activity, index) => {
                    // Insert the Suggestions header before the first non-followed club post
                    const showSuggestionsHeader = index === firstSuggestionIndex && index > 0 && !activity.isFollowed;
                    const isLiked = activity.likes.includes(user?._id); 
                    return (
                      <div key={activity.id}>
                        {showSuggestionsHeader && (
                          <div className="mt-8 mb-4 flex items-center space-x-2">
                            <Sparkles className="h-5 w-5 text-indigo-500" />
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Suggestions</h3>
                          </div>
                        )}
                        
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                          {/* Post Header */}
                          <div className="p-4 flex items-center">
                            <Link to={`/club/${activity.clubId}`} className="flex items-center flex-1">
                              <img
                                src={activity.clubAvatar || '/default-club-avatar.png'}
                                alt={activity.clubName}
                                className="w-12 h-12 rounded-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/default-club-avatar.png';
                                }}
                              />
                              <div className="ml-3">
                                <h3 className="font-semibold text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400">
                                  {activity.clubName}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {new Date(activity.date).toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                            </Link>
                            <Link
                              to={`/club/${activity.clubId}`}
                              className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                            >
                              <Users size={16} className="mr-1" />
                              <span>View Club</span>
                            </Link>
                          </div>

                          {/* Post Content */}
                          <div className="px-4 pb-3">
                            {activity.title && (
                              <h4 className="font-medium text-lg mb-2 text-gray-900 dark:text-gray-100">{activity.title}</h4>
                            )}
                            <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line">{activity.description}</p>
                          </div>

                          {activity.image && (
                            <img
                              src={activity.image}
                              alt={activity.title || 'Post image'}
                              className="w-full aspect-video object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          )}

                          {/* Post Actions */}
                          <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                          <button
                                            onClick={() => {
                                              if (isLiked) {
                                                handleUnlike(activity.id); // If already liked, trigger unlike
                                              } else {
                                                handleLike(activity.id); // If not liked, trigger like
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
                                            <span>{activity.likes.length}</span>
                                          </button>
                                <button 
                                  onClick={() => toggleComments(activity.id)}
                                  className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                                >
                                  <MessageCircle size={20} />
                                  <span>
                                    {activity.comments && activity.comments.length > 0 
                                      ? `Comments (${activity.comments.length})` 
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
                          {expandedComments.includes(activity.id) && (
                            <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700">
                              <CommentSection 
                                postId={activity.id}
                                comments={activity.comments || []}
                                onAddComment={handleAddComment}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Rankings Sidebar */}
            <div className="lg:w-80 mt-8 lg:mt-0">
              <Ranking />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}