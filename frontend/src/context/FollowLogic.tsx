// hooks/useClubFollow.ts
import { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3002';

export const useClubFollow = () => {
  const [loading, setLoading] = useState(false);

  const followClub = async (userId: string, clubId: string, token: string) => {
    console.log(userId, clubId, token);
    setLoading(true);
    try {
      const res = await axios.patch(
        `${API_BASE_URL}/user/${userId}/follow/${clubId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (error) {
      console.error('Follow failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const unfollowClub = async (userId: string, clubId: string, token: string) => {
    setLoading(true);
    try {
      const res = await axios.patch(
        `${API_BASE_URL}/user/${userId}/unfollow/${clubId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (error) {
      console.error('Unfollow failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { followClub, unfollowClub, loading };
};
