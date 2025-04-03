import  { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { BackButton } from '../components/BackButton';
import { EditProfileModal } from '../components/EditProfil';
import { Link } from 'react-router-dom';
import { Users, Bell, Mail, Calendar, MapPin, Briefcase, Award, Settings, ChevronRight, Shield, User as UserIcon, Compass} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const mockProfile: UserProfile = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: '',
  bio: 'Software developer and photography enthusiast. Love to participate in tech and creative clubs.',
  location: 'San Francisco, CA',
  occupation: 'Software Engineer',
  joinDate: '2023-01-15',
  joinedClubs: [
    {
      id: '1',
      name: 'Photography Club',
      description: 'For photography enthusiasts and beginners alike.',
      coverImage: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&q=80',
      logo: 'https://images.unsplash.com/photo-1554080353-a576cf803bda?auto=format&fit=crop&q=80',
      memberCount: 156,
      category: 'Arts',
      activities: [],
      role: 'Member'
    },
    {
      id: '3',
      name: 'Book Club',
      description: 'A community for book lovers to discuss and recommend books.',
      coverImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80',
      logo: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&q=80',
      memberCount: 78,
      category: 'Academic',
      activities: [],
      role: 'Member'
    }
  ],
  ownedClubs: [
    {
      id: '2',
      name: 'Tech Innovators',
      description: 'A community of tech enthusiasts building the future.',
      coverImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80',
      logo: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80',
      memberCount: 45,
      category: 'Technology',
      activities: [],
      ownerId: '1',
      role: 'Owner',
      pendingMembers: [
        {
          id: '2',
          name: 'Alice Johnson',
          email: 'alice@example.com',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80',
          joinedClubs: [],
          ownedClubs: [],
          points: {}
        }
      ]
    },
    {
      id: '4',
      name: 'Coding Workshop',
      description: 'Weekly coding sessions and hackathons for developers.',
      coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80',
      logo: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80',
      memberCount: 32,
      category: 'Technology',
      activities: [],
      ownerId: '1',
      role: 'Admin'
    }
  ],
  moderatedClubs: [
    {
      id: '5',
      name: 'Design Thinkers',
      description: 'Exploring design principles and creative solutions.',
      coverImage: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80',
      logo: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80',
      memberCount: 67,
      category: 'Arts',
      activities: [],
      role: 'Moderator'
    }
  ],
  points: {
    '1': 250,
    '2': 520,
    '3': 120,
    '4': 310,
    '5': 180
  }
};

export function Profile() {
  const { isAuthenticated, user } = useAuth();
  const [profile, setProfile] = useState(isAuthenticated && user ? user : mockProfile);
  const [showPendingMembers, setShowPendingMembers] = useState(false);
  const [activeTab, setActiveTab] = useState<'managed' | 'joined'>('managed');
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

  const handleProfileUpdate = (updatedProfile: Partial<UserProfile>) => {
    setProfile({ ...profile, ...updatedProfile });
  };
  
  useEffect(() => {
    if (isAuthenticated) {
        const user = localStorage.getItem('user');
<<<<<<< HEAD
        if(user){
        setProfile(JSON.parse(user));
=======
        if (user) {
          setProfile(JSON.parse(user));
>>>>>>> ad168bae35bf45027ad9ecf59d7a382f8886a10e
        }
    } else {
      setProfile(mockProfile);
    }
  }, [isAuthenticated]); // ✅ Ensure `isAuthenticated` is a dependency
  


  const handleAcceptMember = (clubId: string, memberId: string) => {
    // In a real app, this would update the backend
    console.log(`Accepted member ${memberId} for club ${clubId}`);
  };

  const handleRejectMember = (clubId: string, memberId: string) => {
    // In a real app, this would update the backend
    console.log(`Rejected member ${memberId} for club ${clubId}`);
  };

  // Combine all clubs where user has management roles
  const managedClubs = [...profile.ownedClubs, ...(profile.moderatedClubs || [])];

  // Calculate total points
  const totalPoints = Object.values(profile.points).reduce((sum, points) => sum + points, 0);

 

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 pb-20">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <div className="mb-6">
            <BackButton />
          </div>
          
          {/* Profile Header Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-8">
            {/* Rectangular Banner */}
            <div className="h-48 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 relative">
              <div className="absolute inset-0 bg-pattern opacity-10"></div>
            </div>
            
            <div className="px-6 py-6 sm:px-8 sm:py-8">
              <div className="flex flex-col sm:flex-row sm:items-end -mt-24 mb-4 gap-6">
                <div className="relative">
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-md object-cover"
                  />
                  <div className="absolute bottom-0 right-0 bg-indigo-600 text-white rounded-full p-2 border-2 border-white dark:border-gray-800">
                    <Award className="w-5 h-5" />
                  </div>
                </div>
                <div className="pt-4 sm:pt-0">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">{profile.name}</h2>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-gray-600 dark:text-gray-400">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-1" />
                      <span>{profile.email}</span>
                    </div>
                    {profile.location && (
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{profile.location}</span>
                      </div>
                    )}
                    {profile.occupation && (
                      <div className="flex items-center">
                        <Briefcase className="w-4 h-4 mr-1" />
                        <span>{profile.occupation}</span>
                      </div>
                    )}
                    {profile.joinDate && (
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>Joined {new Date(profile.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex-grow"></div>
                
                <div className="flex mt-4 sm:mt-0">
                  <button
                    onClick={() => setIsEditProfileModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Edit Profile
                  </button>
                </div>
              </div>
              
              {profile.bio && (
                <div className="mt-4 text-gray-700 dark:text-gray-300">
                  {profile.bio}
                </div>
              )}
              
              {/* Stats Row */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-4 text-center shadow-sm">
                  <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{managedClubs.length + profile.joinedClubs.length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Clubs</div>
                </div>
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-4 text-center shadow-sm">
                  <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{managedClubs.length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Managing</div>
                </div>
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-4 text-center shadow-sm">
                  <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{profile.joinedClubs.length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Memberships</div>
                </div>
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-4 text-center shadow-sm">
                  <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{totalPoints}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Points</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Clubs Tabs */}
          <div className="mb-6">
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab('managed')}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'managed'
                    ? 'border-b-2 border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Managed Clubs ({managedClubs.length})
              </button>
              <button
                onClick={() => setActiveTab('joined')}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'joined'
                    ? 'border-b-2 border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Joined Clubs ({profile.joinedClubs.length})
              </button>
            </div>
          </div>
          
          {/* Managed Clubs Section */}
          {activeTab === 'managed' && (
            <div className="space-y-6">
              {managedClubs.length > 0 ? (
                managedClubs.map((club) => (
                  <div
                    key={club.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all"
                  >
                    <div className="sm:flex">
                      <div className="sm:w-1/3 h-40 sm:h-auto">
                        <img
                          src={club.coverImage}
                          alt={club.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-6 sm:w-2/3">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center">
                            <img
                              src={club.logo}
                              alt={club.name}
                              className="w-16 h-16 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm"
                            />
                            <div className="ml-4">
                              <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{club.name}</h4>
                              <div className="flex items-center mt-1">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  club.role === 'Owner' 
                                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300' 
                                    : club.role === 'Admin'
                                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                                      : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                                }`}>
                                  <Shield className="w-3 h-3 mr-1" />
                                  {club.role}
                                </span>
                                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">{club.memberCount} members</span>
                              </div>
                            </div>
                          </div>
                          
                          {club.pendingMembers && club.pendingMembers.length > 0 && (
                            <button
                              onClick={() => setShowPendingMembers(!showPendingMembers)}
                              className="flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1 rounded-full"
                            >
                              <Bell className="w-4 h-4 mr-1" />
                              <span>{club.pendingMembers.length} pending</span>
                            </button>
                          )}
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{club.description}</p>
                        
                        {/* Pending Members List */}
                        {showPendingMembers && club.pendingMembers && (
                          <div className="mt-4 border-t border-gray-100 dark:border-gray-700 pt-4">
                            <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">Pending Requests</h5>
                            <div className="space-y-3">
                              {club.pendingMembers.map((member) => (
                                <div key={member.id} className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <img
                                      src={member.avatar}
                                      alt={member.name}
                                      className="w-8 h-8 rounded-full"
                                    />
                                    <span className="ml-2 text-sm text-gray-900 dark:text-gray-100">{member.name}</span>
                                  </div>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handleAcceptMember(club.id, member.id)}
                                      className="px-3 py-1 text-xs text-white bg-green-500 rounded hover:bg-green-600"
                                    >
                                      Accept
                                    </button>
                                    <button
                                      onClick={() => handleRejectMember(club.id, member.id)}
                                      className="px-3 py-1 text-xs text-white bg-red-500 rounded hover:bg-red-600"
                                    >
                                      Reject
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="mt-4 flex flex-wrap gap-3">
                          <Link
                            to={`/club/${club.id}`}
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                          >
                            <Settings className="w-4 h-4 mr-2" />
                            Manage Club
                          </Link>
                          
                          {profile.points[club.id] && (
                            <div className="inline-flex items-center px-4 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 rounded-lg">
                              <Award className="w-4 h-4 mr-2" />
                              {profile.points[club.id]} points
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                    <Shield className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No Managed Clubs</h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                    You don't have any clubs that you manage yet. Create a new club to get started!
                  </p>
                </div>
              )}
            </div>
          )}
          
          {/* Joined Clubs Section */}
          {activeTab === 'joined' && (
            <div className="space-y-6">
              {profile.joinedClubs.length > 0 ? (
                profile.joinedClubs.map((club) => (
                  <div
                    key={club.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all"
                  >
                    <div className="sm:flex">
                      <div className="sm:w-1/4 h-32 sm:h-auto">
                        <img
                          src={club.coverImage}
                          alt={club.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-6 sm:w-3/4">
                        <div className="flex items-center mb-4">
                          <img
                            src={club.logo}
                            alt={club.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm"
                          />
                          <div className="ml-4">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{club.name}</h4>
                            <div className="flex items-center mt-1">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                                <UserIcon className="w-3 h-3 mr-1" />
                                {club.role || 'Member'}
                              </span>
                              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">{club.category}</span>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{club.description}</p>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Users className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-1" />
                            <span className="text-sm text-gray-500 dark:text-gray-400">{club.memberCount} members</span>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            {profile.points[club.id] && (
                              <div className="inline-flex items-center text-amber-700 dark:text-amber-400">
                                <Award className="w-4 h-4 mr-1" />
                                {profile.points[club.id]} points
                              </div>
                            )}
                            
                            <Link
                              to={`/club/${club.id}`}
                              className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                            >
                              View Club
                              <ChevronRight className="w-4 h-4 ml-1" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                    <Users className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No Joined Clubs</h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                    You haven't joined any clubs yet. Explore clubs to find communities that interest you!
                  </p>
                  <Link
                    to="/explore"
                    className="inline-flex items-center px-4 py-2 mt-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Compass className="w-4 h-4 mr-2" />
                    Explore Clubs
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <EditProfileModal
        isOpen={isEditProfileModalOpen}
        onClose={() => setIsEditProfileModalOpen(false)}
        profile={profile}
        onSave={handleProfileUpdate}
      />

    </div>
  );
}