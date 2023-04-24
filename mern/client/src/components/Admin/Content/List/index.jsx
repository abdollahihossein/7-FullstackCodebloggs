import React, { useState, useEffect } from "react";
import PostCard from "./Post";
import "./post.css";

function PostList() {
  const [posts, setPosts] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const [filteredPosts, setFilteredPosts] = useState([]);

  const email = localStorage.getItem("email");

  const fetchData = async () => {
    try {
      const url = "http://localhost:5000/all-post";
      const postResponse = await fetch(url);
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
      return postsWithUserNames;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData().then((postsWithUserNames) => {
      setFilteredPosts(postsWithUserNames);
    });
  }, [email]);

  const filterPosts = (fromDate, toDate) => {
    const fromTimestamp = fromDate ? new Date(fromDate).getTime() : -Infinity;
    const toTimestamp = toDate ? new Date(toDate).getTime() : Infinity;

    return filteredPosts.filter((post) => {
      const postTimestamp = new Date(post.date).getTime();
      return postTimestamp >= fromTimestamp && postTimestamp <= toTimestamp;
    });
  };

  const handleLikeClick = (index) => {
    const updatedPosts = [...posts];
    updatedPosts[index].likes += 1;
    setPosts(updatedPosts);
  };

  const handleSearchClick = () => {
    const filteredPosts = filterPosts(fromDate, toDate);
    setFilteredPosts(filteredPosts);
  };

  const handleFromDateChange = (event) => {
    setFromDate(event.target.value);
  };

  const handleToDateChange = (event) => {
    setToDate(event.target.value);
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredPosts.length / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  if (!posts) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container-post">
      <div className="date-range-container">
        <label>
          From Date:
          <input type="date" onChange={handleFromDateChange} />
        </label>
        <label>
          To Date:
          <input type="date" onChange={handleToDateChange} />
        </label>
        <button onClick={handleSearchClick}>Search</button>
      </div>
      <div style={{ width: "600px" }}>
        {currentPosts.map((post, index) => (
          <PostCard
            key={post._id}
            post={post}
            handleLikeClick={handleLikeClick}
            index={index}
          />
        ))}
      </div>
      <div className="pagination">
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => handlePageClick(number)}
            className={number === currentPage ? "active" : ""}
          >
            {number}
          </button>
        ))}
      </div>
    </div>
  );
}

export default PostList;
