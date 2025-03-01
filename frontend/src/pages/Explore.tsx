import React, { useState, useEffect } from 'react';
import { Club } from '../types';
import { Search, Plus, Bell, Users, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CreateClubModal } from '../components/CreateClubModal';

const clubs: Club[] = [
  {
    id: '1',
    name: 'Photography Club',
    description: 'For photography enthusiasts and beginners alike.',
    coverImage: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&q=80',
    logo: 'https://images.unsplash.com/photo-1554080353-a576cf803bda?auto=format&fit=crop&q=80',
    memberCount: 156,
    category: 'Arts',
    activities: []
  },
  {
    id: '2',
    name: 'Debate Society',
    description: 'Fostering critical thinking through meaningful discussions.',
    coverImage: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&q=80',
    logo: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80',
    memberCount: 89,
    category: 'Academic',
    activities: []
  },
  {
    id: '3',
    name: 'Tech Innovators',
    description: 'Building the future through technology and innovation.',
    coverImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80',
    logo: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80',
    memberCount: 145,
    category: 'Technology',
    activities: []
  },
  {
    id: '4',
    name: 'Art Collective',
    description: 'Exploring creativity through various art forms and collaborative projects.',
    coverImage: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80',
    logo: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80',
    memberCount: 178,
    category: 'Arts',
    activities: []
  },
  {
    id: '5',
    name: 'Environmental Action',
    description: 'Working together to create a more sustainable future for our planet.',
    coverImage: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&q=80',
    logo: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&q=80',
    memberCount: 134,
    category: 'Social',
    activities: []
  }
];

export function Explore() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [clubsList, setClubsList] = useState(clubs);
  const [followedClubs, setFollowedClubs] = useState<string[]>([]);
  const [joinedClubs, setJoinedClubs] = useState<string[]>([]);
  const [filteredClubs, setFilteredClubs] = useState(clubs);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  const categories = ['All', 'Arts', 'Academic', 'Technology', 'Social', 'Sports', 'Other'];
  
  // Filter clubs based on search term and category
  useEffect(() => {
    let results = clubsList;
    
    // Filter by search term
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      results = results.filter(club => 
        club.name.toLowerCase().includes(lowercasedSearch) || 
        club.description.toLowerCase().includes(lowercasedSearch)
      );
    }
    
    // Filter by category
    if (selectedCategory !== 'All') {
      results = results.filter(club => club.category === selectedCategory);
    }
    
    setFilteredClubs(results);
  }, [searchTerm, clubsList, selectedCategory]);
  
  const handleCreateClub = (clubData: any) => {
    const newClub: Club = {
      id: String(clubsList.length + 1),
      name: clubData.name,
      description: clubData.description,
      coverImage: clubData.coverImage,
      logo: clubData.coverImage, // Using cover image as logo for simplicity
      memberCount: 1,
      category: clubData.category,
      activities: []
    };
    
    setClubsList([...clubsList, newClub]);
  };

  const handleJoinClub = (e: React.MouseEvent, clubId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (joinedClubs.includes(clubId)) {
      setJoinedClubs(joinedClubs.filter(id => id !== clubId));
    } else {
      setJoinedClubs([...joinedClubs, clubId]);
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

  const clearSearch = () => {
    setSearchTerm('');
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 pb-20">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-0">Discover Clubs</h2>
            
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none sm:w-64">
                <input
                  type="text"
                  placeholder="Search clubs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                {searchTerm && (
                  <button 
                    onClick={clearSearch}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
              
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus size={20} className="mr-2" />
                Create Club
              </button>
            </div>
          </div>
          
          {/* Category filters */}
          <div className="mb-6 flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          {/* Search results info */}
          {searchTerm && (
            <div className="mb-4 text-gray-600 dark:text-gray-300">
              Found {filteredClubs.length} {filteredClubs.length === 1 ? 'club' : 'clubs'} for "{searchTerm}"
            </div>
          )}
          
          {/* No results message */}
          {filteredClubs.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 dark:text-gray-400 text-lg mb-4">No clubs found matching your search</div>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Clear filters
              </button>
            </div>
          )}
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredClubs.map((club) => (
              <Link
                key={club.id}
                to={`/club/${club.id}`}
                className="block group"
              >
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={club.coverImage}
                      alt={club.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {club.name}
                      </h3>
                      <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full text-sm">
                        {club.category}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{club.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">{club.memberCount} members</span>
                      <div className="flex gap-2">
                        <button 
                          className={`${
                            joinedClubs.includes(club.id)
                              ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                              : 'bg-indigo-600 text-white hover:bg-indigo-700'
                          } px-3 py-1.5 rounded-md transition-colors flex items-center`}
                          onClick={(e) => handleJoinClub(e, club.id)}
                        >
                          <Users className="w-4 h-4 mr-1" />
                          {joinedClubs.includes(club.id) ? 'Joined' : 'Join'}
                        </button>
                        
                        <button 
                          className={`${
                            followedClubs.includes(club.id)
                              ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                              : 'border border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-700'
                          } px-3 py-1.5 rounded-md transition-colors flex items-center`}
                          onClick={(e) => handleFollowClub(e, club.id)}
                        >
                          <Bell className="w-4 h-4 mr-1" />
                          {followedClubs.includes(club.id) ? 'Following' : 'Follow'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <CreateClubModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateClub}
      />
    </div>
  );
}