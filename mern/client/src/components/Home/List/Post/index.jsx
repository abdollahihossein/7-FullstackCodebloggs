import React, { useState, useEffect } from "react";
import "./PostCard.css";

const PostCard = () => {
  const [posts, setPosts] = useState([]);
  const email = localStorage.getItem("email");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await fetch(`http://localhost:5000/user/${email}`);
        const userData = await userResponse.json();
        const userId = userData._id;

        const postResponse = await fetch(
          `http://localhost:5000/all-post/${userId}`
        );
        const postData = await postResponse.json();
        setPosts(postData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [email]);

  const parseDate = (dateString) => {
    const [datePart, timePart] = dateString.split(", ");
    const [day, month, year] = datePart.split("/").map(Number);
    const [hour, minute, second] = timePart.split(":").map(Number);

    return new Date(year, month - 1, day, hour, minute, second);
  };

  const handleLikeClick = (index) => {
    const updatedPosts = [...posts];
    updatedPosts[index].likes += 1;
    setPosts(updatedPosts);
  };

  if (!posts) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {posts.map((post, index) => (
        <div key={post._id} className="post-card">
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
      ))}
    </div>
  );
};

export default PostCard;
