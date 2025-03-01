import React, { useState } from 'react';
import { Comment } from '../types';

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  onAddComment: (postId: string, comment: string) => void;
}

export function CommentSection({ postId, comments, onAddComment }: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(postId, newComment);
      setNewComment('');
    }
  };

  return (
    <div className="mt-4 border-t border-gray-100 dark:border-gray-700 pt-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Comments</h3>
      
      {comments && comments.length > 0 ? (
        <div className="space-y-4 mb-6">
          {comments.map((comment) => (
            <div key={comment.id} className="flex space-x-3">
              <img 
                src={comment.userAvatar} 
                alt={comment.userName} 
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">{comment.userName}</h4>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(comment.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300">{comment.text}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 mb-4">No comments yet. Be the first to comment!</p>
      )}
      
      <form onSubmit={handleSubmit} className="flex items-start space-x-3">
        <img 
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80" 
          alt="Your avatar" 
          className="w-10 h-10 rounded-full"
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
              disabled={!newComment.trim()}
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