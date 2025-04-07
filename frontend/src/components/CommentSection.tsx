import React, { useState, useEffect } from 'react';
import { Comment } from '../types';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
interface DecodedToken {
  sub: string;
  // Add other fields if needed like email, exp, etc.
}
interface CommentSectionProps {
  postId: string;
  comments?: Comment[]; // Make this optional since we'll fetch comments from API
  onAddComment: (postId: string, comment: string) => void;
}

export function CommentSection({ postId, comments: initialComments , onAddComment }: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
    const token = localStorage.getItem('access_token') || "";
    const decoded = jwtDecode<DecodedToken>(token); 
  const navigate = useNavigate(); // Initialize the navigate function

  // Fetch comments from API when component mounts or postId changes
  useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`http://localhost:3002/clubs/posts/${postId}/comments`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch comments: ${response.status}`);
        }
        
        const data = await response.json();
        setComments(data);
      } catch (err) {
        console.error('Error fetching comments:', err);
        setError('Failed to load comments. Please try again later.');
        
        // Fall back to initial comments if API call fails
        if (initialComments && initialComments.length > 0) {
          setComments(initialComments);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [postId, initialComments]);

  // Update comments when a new one is added
  useEffect(() => {
    if (initialComments) {
      setComments(prevComments => {
        // Only update if the length is different (new comment added)
        if (initialComments.length !== prevComments.length) {
          return initialComments;
        }
        return prevComments;
      });
    }
  }, [initialComments]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      navigate('/login'); // Redirect to login if the user is not logged in
      return; // Exit early to prevent further code execution
    }


    if (newComment.trim()) {
      // Prepare the data to send
      const commentData = {
        content: newComment,
        authorId: decoded.sub ,  // Replace with actual current user ID
        userName: user.name || "guest",  // Replace with actual user name
        userAvatar: user.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80",  // Replace with actual user avatar URL
      };
      console.log(commentData);
      
      try {
        // Send the comment data to the backend API
        const response = await fetch(`http://localhost:3002/clubs/posts/${postId}/comments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(commentData),
        });
  
        if (response.ok) {
          // Clear the comment input after submitting
          setNewComment('');
  
          // Get the saved comment from the response
          const savedComment = await response.json(); // Assuming the API returns the saved comment
  
          // Optimistic update: Add the new comment to the local state immediately
          setComments((prevComments) => [savedComment, ...prevComments]);
  
          // Optionally, call the onAddComment function to update the parent component's state
          onAddComment(postId, savedComment);
        } else {
          // Handle API errors (e.g., show an error message)
          console.error('Failed to save the comment');
        }
      } catch (error) {
        console.error('Error while saving the comment:', error);
      }
    }
  };
  


  return (
    <div className="mt-4 border-t border-gray-100 dark:border-gray-700 pt-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Comments</h3>
      
      {isLoading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 mb-4">{error}</div>
      ) : comments && comments.length > 0 ? (
        <div className="space-y-4 mb-6">
          {comments.map((comment) => (
            <div key={comment._id} className="flex space-x-3">
              <img 
                src={comment.userAvatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80"} 
                alt={comment.userName} 
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80";
                }}
              />
              <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">{comment.userName}</h4>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(comment.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 mb-4">No comments yet. Be the first to comment!</p>
      )}
      
      <form onSubmit={handleSubmit} className="flex items-start space-x-3">
        <img 
          src={user?.avatar || "https://secure.gravatar.com/avatar/15f8001624bd5b624aa2c00d0d25b1f4?s=168&d=mm&r=g"}
          alt="Your avatar" 
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            rows={2}
          />
          <div className="mt-2 flex justify-end">
            <button
              type="submit"
              disabled={!newComment.trim() || isLoading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Post Comment
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}