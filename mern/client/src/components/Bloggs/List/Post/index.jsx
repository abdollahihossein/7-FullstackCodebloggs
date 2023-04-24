import React, { useState, useEffect } from "react";
import "./PostCard.css";
import Initials from "../../Avatar";

const PostCard = () => {
  const [posts, setPosts] = useState([]);
  const email = localStorage.getItem("email");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postResponse = await fetch(`http://localhost:5000/all-post`);
        const postData = await postResponse.json();

        // Fetch the user names
        const usersPromises = postData.map(async (post) => {
          const userResponse = await fetch(
            `http://localhost:5000/users/${post.user_id}`
          );
          const userData = await userResponse.json();
          if (userData) {
            return `${userData.first_name} ${userData.last_name}`;
          } else {
            console.error(`No user data found for user_id: ${post.user_id}`);
            return "Unknown User";
          }
        });

        const users = await Promise.all(usersPromises);

        // Add user names to the posts
        const postsWithUserNames = postData.map((post, index) => {
          return { ...post, user_name: users[index] };
        });

        setPosts(postsWithUserNames);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [email]);

  const parseDate = (dateString) => {
    // "2020-12-01T00:00:00.000Z"
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
    <div className="posts-container">
      {posts.map((post, index) => (
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
      ))}
    </div>
  );
};

export default PostCard;
