import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, TrendingUp, ThumbsUp, Users, Star, Trophy, Medal, Bell } from 'lucide-react';

// Mock data for club rankings
const clubRankings = [
  {
    id: '1',
    name: 'Photography Club',
    avatar: 'https://images.unsplash.com/photo-1554080353-a576cf803bda?auto=format&fit=crop&q=80',
    totalPosts: 156,
    totalLikes: 3240,
    memberCount: 324,
    engagement: 92,
    trending: true,
    description: 'A community of photography enthusiasts sharing their passion for capturing moments.'
  },
  {
    id: '2',
    name: 'Debate Society',
    avatar: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80',
    totalPosts: 89,
    totalLikes: 1678,
    memberCount: 156,
    engagement: 85,
    trending: true,
    description: 'Fostering critical thinking through meaningful discussions and debates.'
  },
  {
    id: '3',
    name: 'Tech Innovators',
    avatar: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80',
    totalPosts: 78,
    totalLikes: 890,
    memberCount: 145,
    engagement: 76,
    trending: false,
    description: 'Building the future through technology and innovation.'
  },
  {
    id: '4',
    name: 'Art Collective',
    avatar: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80',
    totalPosts: 112,
    totalLikes: 1456,
    memberCount: 178,
    engagement: 72,
    trending: false,
    description: 'Exploring creativity through various art forms and collaborative projects.'
  },
  {
    id: '5',
    name: 'Environmental Action',
    avatar: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&q=80',
    totalPosts: 67,
    totalLikes: 1230,
    memberCount: 134,
    engagement: 68,
    trending: true,
    description: 'Working together to create a more sustainable future for our planet.'
  }
];

export function TopClubs() {
  const [followedClubs, setFollowedClubs] = useState<string[]>([]);
  
  // Function to get the appropriate medal icon based on rank
  const getMedalIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 1:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-amber-700" />;
      default:
        return <Star className="w-6 h-6 text-indigo-400" />;
    }
  };
  
  const handleFollowClub = (e: React.MouseEvent, clubId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (followedClubs.includes(clubId)) {
      setFollowedClubs(followedClubs.filter(id => id !== clubId));
    } else {
      setFollowedClubs([...followedClubs, clubId]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 pb-20">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center justify-center">
              <Award className="w-8 h-8 mr-3 text-indigo-600 dark:text-indigo-400" />
              Top Performing Clubs
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover the most active and engaging clubs based on member engagement, post activity, and overall community impact.
            </p>
          </div>

          <div className="space-y-6">
            {clubRankings.map((club, index) => (
              <Link
                key={club.id}
                to={`/club/${club.id}`}
                className="block bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all transform hover:-translate-y-1"
              >
                <div className="p-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-4">
                      <div className="relative">
                        <img
                          src={club.avatar}
                          alt={club.name}
                          className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-md"
                        />
                        <div className="absolute -top-2 -left-2 bg-white dark:bg-gray-700 rounded-full p-1 shadow-md">
                          {getMedalIcon(index)}
                        </div>
                      </div>
                      <div className="mt-2 text-center">
                        <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">#{index + 1}</span>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                            {club.name}
                          </h2>
                          <p className="text-gray-600 dark:text-gray-400 mt-1">{club.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {club.trending && (
                            <div className="flex items-center text-green-500 bg-green-50 dark:bg-green-900/30 dark:text-green-400 px-3 py-1 rounded-full">
                              <TrendingUp size={16} className="mr-1" />
                              <span className="text-sm font-medium">Trending</span>
                            </div>
                          )}
                          <button
                            onClick={(e) => handleFollowClub(e, club.id)}
                            className={`${
                              followedClubs.includes(club.id)
                                ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                                : 'border border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-700/50'
                            } px-3 py-1 rounded-full transition-colors flex items-center`}
                          >
                            <Bell className="w-4 h-4 mr-1" />
                            {followedClubs.includes(club.id) ? 'Following' : 'Follow'}
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-4">
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                          <div className="flex items-center text-gray-600 dark:text-gray-400 mb-1">
                            <ThumbsUp size={16} className="mr-1" />
                            <span className="text-sm">Total Likes</span>
                          </div>
                          <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{club.totalLikes.toLocaleString()}</p>
                        </div>
                        
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                          <div className="flex items-center text-gray-600 dark:text-gray-400 mb-1">
                            <Users size={16} className="mr-1" />
                            <span className="text-sm">Members</span>
                          </div>
                          <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{club.memberCount.toLocaleString()}</p>
                        </div>
                        
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                          <div className="flex items-center text-gray-600 dark:text-gray-400 mb-1">
                            <Award size={16} className="mr-1" />
                            <span className="text-sm">Posts</span>
                          </div>
                          <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{club.totalPosts.toLocaleString()}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                          <span>Engagement Rate</span>
                          <span className="font-medium">{club.engagement}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                          <div
                            className="bg-indigo-600 dark:bg-indigo-500 h-2.5 rounded-full"
                            style={{ width: `${club.engagement}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}