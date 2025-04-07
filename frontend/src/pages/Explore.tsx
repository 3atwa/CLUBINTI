import React, { useState, useEffect } from 'react';
import { Club } from '../types';
import { Search, Plus, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CreateClubModal } from '../components/CreateClubModal';
import { useAuth } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
interface DecodedToken {
  sub: string;
  // Add other fields if needed like email, exp, etc.
}


export function Explore() {
  const [searchTerm, setSearchTerm] = useState('');
  const { isAuthenticated} = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [clubsList, setClubsList] = useState<Club[]>([]);
  const [filteredClubs, setFilteredClubs] = useState<Club[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const categories = ['All', 'Arts', 'Academic', 'Technology', 'Social', 'Sports', 'Other'];

  const token = localStorage.getItem('access_token') || "";
  const decoded = jwtDecode<DecodedToken>(token); 
  const handleCreateClub = async (clubData: any) => {
    const userString = localStorage.getItem('user');
  
    if (!userString) {
      alert('You need to be logged in to create clubs');
      return;
    }
  
    const user = JSON.parse(userString); // ✅ Parse the user from localStorage
  
    const clubDataWithOwner = {
      ...clubData,
      ownerId: decoded.sub, // ✅ Extract ownerId after parsing
    };
  
    try {
      const response = await fetch('http://localhost:3002/clubs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clubDataWithOwner),
      });
  
      if (!response.ok) {
        throw new Error('Failed to create club');
      }
  
      const newClub = await response.json(); // Backend returns the created club
      setClubsList((prev) => [...prev, newClub]); // Update UI with new club
    } catch (error) {
      console.error('Error creating club:', error);
    }
  };
  
  





  // Fetch clubs from backend
  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await fetch('http://localhost:3002/clubs');
        if (!response.ok) throw new Error('Failed to fetch clubs');
        const data = await response.json();
        setClubsList(data);
        setFilteredClubs(data);
        setLoading(false);
      } catch (err) {
        setError('Could not load clubs');
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  // Filter clubs based on search term and category
  useEffect(() => {
    let results = clubsList;

    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      results = results.filter(
        (club) =>
          club.name.toLowerCase().includes(lowercasedSearch) ||
          club.description.toLowerCase().includes(lowercasedSearch)
      );
    }

    if (selectedCategory !== 'All') {
      results = results.filter((club) => club.category === selectedCategory);
    }

    setFilteredClubs(results);
  }, [searchTerm, clubsList, selectedCategory]);

  if (loading) return <p className="text-center text-gray-500">Loading clubs...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 pb-20">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-0">
              Discover Clubs
            </h2>

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
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
                { isAuthenticated &&
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus size={20} className="mr-2" />
                Create Club
              </button>
}
            </div>
          </div>

          {/* Category filters */}
          <div className="mb-6 flex flex-wrap gap-2">
            {categories.map((category) => (
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
          

          {/* No results message */}
          {filteredClubs.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 dark:text-gray-400 text-lg mb-4">No clubs found</div>
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
              <Link key={club._id} to={`/club/${club._id}`} className="block group">
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
      onSubmit={handleCreateClub}  // ✅ Correct prop name
    />


    </div>
  );
}
