import React from "react";
import "./PostCard.css";
import Initials from "../../Avatar";

const PostCard = ({ post, handleLikeClick, index }) => {
  const parseDate = (dateString) => {
    // "2020-12-01T00:00:00.000Z"
    const [datePart, timePart] = dateString.split(", ");
    const [day, month, year] = datePart.split("/").map(Number);
    const [hour, minute, second] = timePart.split(":").map(Number);

    return new Date(year, month - 1, day, hour, minute, second);
  };

  return (
    <div key={post._id} className="post-container">
      <Initials name={post.user_name} />
      <div className="post-card">
        <div className="post-card__text">{post.content}</div>
        <div className="post-card__header">
          <span className="post-card__date">
            {parseDate(post.time_stamp).toLocaleString()}
          </span>
          <button
            className="post-card__like-btn"
            onClick={() => handleLikeClick(index)}
          >
            Like {post.likes > 0 && `(${post.likes})`}
          </button>
        </div>
        <div className="post-card__comments">
          {post.Comments &&
            post.Comments.map((comment, index) => (
              <div key={index} className="comment">
                {comment}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
