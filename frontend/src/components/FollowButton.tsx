import { useClubFollow } from '../context/FollowLogic';

export function FollowButton({
  userId,
  clubId,
  token,
  isFollowing,
  onToggle
}: {
  userId: string;
  clubId: string;
  token: string;
  isFollowing: boolean;
  onToggle: (newState: boolean) => void;
}) {
  const { followClub, unfollowClub, loading } = useClubFollow();

  const handleClick = async () => {
    try {
      if (isFollowing) {
        await unfollowClub(userId, clubId, token);
        onToggle(false);
      } else {
        await followClub(userId, clubId, token);
        onToggle(true);
      }
    } catch (err) {
      alert('Something went wrong.');
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`${
        isFollowing
          ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
          : 'border border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400'
      } px-6 py-2 rounded-full font-semibold transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {loading ? 'Please wait...' : isFollowing ? 'Unfollow' : 'Follow'}
    </button>
  );
}
