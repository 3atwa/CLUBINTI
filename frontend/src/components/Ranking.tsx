
import { Trophy, TrendingUp, Users2 } from 'lucide-react';
import { Link } from 'react-router-dom';
const topClubs = [
    {
      id: '1',
      name: 'CLL',
      avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEzUbN9QQve8lGE6HfLfal9Z0ulYJd0lsiJQ&s',
      members: 156,
      engagement: 92,
      position: 1,
      trend: 'up'
    },
    {
      id: '2',
      name: 'Tunivision',
      avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXTKVNt-OCoYY4z_xypW7ZkpW_ZK6QzZFqIQ&s',
      members: 143,
      engagement: 88,
      position: 2,
      trend: 'up'
    },
    {
      id: '3',
      name: 'Forma Club',
      avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYrOzKU4BK-eB_-WfTNuREmTVNkJK234UAYg&s',
      members: 128,
      engagement: 85,
      position: 3,
      trend: 'down'
    },
    {
      id: '4',
      name: 'Astro ',
      avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTN1qsBIF25FpWw27unDfK3Kwa7Yej0x_kKkg&s',
      members: 112,
      engagement: 82,
      position: 4,
      trend: 'same'
    },
    {
      id: '5',
      name: 'Cinéclub',
      avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSktZfoqUTqg2vxd-ZqN4-6mQuHxK_FtYbN8Q&s',
      members: 98,
      engagement: 79,
      position: 5,
      trend: 'up'
    }
  ];


  
function Ranking() {

    const getTrendIcon = (trend: string) => {
        switch (trend) {
          case 'up':
            return <TrendingUp size={16} className="text-green-500" />;
          case 'down':
            return <TrendingUp size={16} className="text-red-500 transform rotate-180" />;
          default:
            return <TrendingUp size={16} className="text-gray-400 transform rotate-90" />;
        }
      };


  return (
    <div className="hidden lg:block w-80">
    <div className="sticky top-20">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
            Top Performing Clubs
          </h3>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {topClubs.map((club) => (
            <Link
              key={club.id}
              to={`/club/${club.id}`}
              className="flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="w-6 font-semibold text-gray-500 dark:text-gray-400">
                #{club.position}
              </span>
              <img
                src={club.avatar}
                alt={club.name}
                className="w-10 h-10 rounded-full object-cover mx-3"
              />
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                  {club.name}
                </h4>
                <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                  <Users2 size={14} className="mr-1" />
                  <span>{club.members} members</span>
                  <span className="mx-2">•</span>
                  <span>{club.engagement}% engaged</span>
                </div>
              </div>
              {getTrendIcon(club.trend)}
            </Link>
          ))}
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50">
          <Link
            to="/rankings"
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium flex items-center justify-center"
          >
            View Complete Rankings
          </Link>
        </div>
      </div>
    </div>
  </div>
  );
}

export default Ranking;