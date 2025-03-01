import React, { useState } from 'react';
import { Activity } from '../types';
import { Heart, MessageCircle, Share2, Users, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CommentSection } from '../components/CommentSection';

const recentActivities: Activity[] = [
  {
    id: '1',
    clubId: '1',
    clubName: 'Photography Club',
    clubAvatar: 'https://images.unsplash.com/photo-1554080353-a576cf803bda?auto=format&fit=crop&q=80',
    title: 'Photography Workshop Results',
    description: 'Amazing results from our weekend workshop! Our members captured some stunning shots of the city skyline. Swipe through to see some of the best photographs taken by our talented photographers. We\'re so proud of everyone\'s progress! 📸✨',
    date: '2024-03-20',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80',
    likes: 24,
    isLiked: false,
    comments: []
  },
  {
    id: '2',
    clubId: '2',
    clubName: 'Debate Society',
    clubAvatar: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80',
    title: 'Upcoming Debate Tournament',
    description: 'Get ready for our biggest event of the year! We\'re hosting an inter-university debate tournament next week. Topics will include climate change, artificial intelligence, and global economics. Don\'t miss this opportunity to showcase your debating skills! 🎯🗣️',
    date: '2024-03-22',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80',
    likes: 18,
    isLiked: true,
    comments: [
      {
        id: '1',
        userId: '3',
        userName: 'Emma Watson',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80',
        text: 'Looking forward to this! Will there be a livestream for those who can\'t attend in person?',
        date: '2024-03-22T14:30:00Z'
      }
    ]
  }
];

export function Home() {
  const [activities, setActivities] = useState(recentActivities);
  const [expandedComments, setExpandedComments] = useState<string[]>([]);

  const handleLike = (activityId: string) => {
    setActivities(activities.map(activity => {
      if (activity.id === activityId) {
        return {
          ...activity,
          likes: activity.isLiked ? activity.likes - 1 : activity.likes + 1,
          isLiked: !activity.isLiked
        };
      }
      return activity;
    }));
  };

  const toggleComments = (activityId: string) => {
    if (expandedComments.includes(activityId)) {
      setExpandedComments(expandedComments.filter(id => id !== activityId));
    } else {
      setExpandedComments([...expandedComments, activityId]);
    }
  };

  const handleAddComment = (activityId: string, commentText: string) => {
    const newComment = {
      id: Date.now().toString(),
      userId: '1',
      userName: 'John Doe',
      userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80',
      text: commentText,
      date: new Date().toISOString()
    };

    setActivities(activities.map(activity => {
      if (activity.id === activityId) {
        return {
          ...activity,
          comments: [...(activity.comments || []), newComment]
        };
      }
      return activity;
    }));
  };

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

          {/* Recent Activities Feed */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">Latest Updates</h2>
            <div className="space-y-6">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
                >
                  {/* Post Header */}
                  <div className="p-4 flex items-center">
                    <Link to={`/club/${activity.clubId}`} className="flex items-center flex-1">
                      <img
                        src={activity.clubAvatar}
                        alt={activity.clubName}
                        className="w-12 h-12 rounded-full object-cover"
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
                    <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line">{activity.description}</p>
                  </div>

                  {activity.image && (
                    <img
                      src={activity.image}
                      alt={activity.title}
                      className="w-full aspect-video object-cover"
                    />
                  )}

                  {/* Post Actions */}
                  <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => handleLike(activity.id)}
                          className={`flex items-center space-x-1 ${
                            activity.isLiked ? 'text-red-500' : 'text-gray-600 dark:text-gray-300'
                          } hover:text-red-500 transition-colors`}
                        >
                          <Heart
                            size={20}
                            className={activity.isLiked ? 'fill-current' : ''}
                          />
                          <span>{activity.likes}</span>
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
                    <div className="px-4 pb-4">
                      <CommentSection 
                        postId={activity.id}
                        comments={activity.comments || []}
                        onAddComment={handleAddComment}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}