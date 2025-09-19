import React from "react";
import comment1 from "../../assets/images/blog/comment-1-1.jpg";

const Comments = ({ comments = [], blogId }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    }) + ' . ' + date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (comments.length === 0) {
    return (
      <div>
        <h3 className="blog-details__title">No comments yet</h3>
        <p>Be the first to share your thoughts!</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="blog-details__title">
        {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
      </h3>
      <div className="comment-one">
        {comments.map((comment) => (
          <div key={comment._id} className="comment-one__single">
            <div className="comment-avatar" style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: '#f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#666',
              marginRight: '15px'
            }}>
              {getInitials(comment.author.name)}
            </div>
            <div className="comment-content" style={{ flex: 1 }}>
              <h3>{comment.author.name}</h3>
              <p className="comment-one__date">
                {formatDate(comment.createdAt)}
              </p>
              <p>{comment.content}</p>
              <a href="#none" className="thm-btn">
                Reply
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;
