import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { MessageSquare } from 'lucide-react';
import './Comments.css';

const Comments = () => {
    const [comments, setComments] = useState([
        { id: 1, author: 'Sarah', avatar: 'https://ui-avatars.com/api/?name=Sarah&background=ec4899&color=fff', content: 'Great article! Really enjoyed the insights on edge computing.', date: '2 hours ago' },
        { id: 2, author: 'John Doe', avatar: null, content: 'Could you elaborate more on the durability aspect?', date: '5 hours ago' }
    ]);
    const [newComment, setNewComment] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setComments([
            {
                id: Date.now(),
                author: 'You',
                avatar: 'https://ui-avatars.com/api/?name=You&background=6366f1&color=fff',
                content: newComment,
                date: 'Just now'
            },
            ...comments
        ]);
        setNewComment('');
    };

    return (
        <section className="comments-section">
            <h3 className="comments-title">
                <MessageSquare size={20} />
                Responses ({comments.length})
            </h3>

            <form onSubmit={handleSubmit} className="comment-form">
                <textarea
                    className="comment-input"
                    placeholder="What are your thoughts?"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={3}
                />
                <div className="comment-form-actions">
                    <Button type="submit" size="sm" disabled={!newComment.trim()}>
                        Respond
                    </Button>
                </div>
            </form>

            <div className="comments-list">
                {comments.map(comment => (
                    <div key={comment.id} className="comment-item">
                        <div className="comment-header">
                            <Avatar src={comment.avatar} alt={comment.author} size="sm" />
                            <div className="comment-meta">
                                <span className="comment-author">{comment.author}</span>
                                <span className="comment-date">{comment.date}</span>
                            </div>
                        </div>
                        <p className="comment-content">{comment.content}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Comments;
