// withSkeleton.js
import React, { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";

const withSkeleton = (WrappedComponent, skeletonHeight = 200) => {
  return (props) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000); // You can adjust the delay here

      return () => {
        clearTimeout(timer);
      };
    }, []);

    return (
      <div>
        {loading ? (
          <Skeleton height={skeletonHeight} />
        ) : (
          <WrappedComponent {...props} />
        )}
      </div>
    );
  };
};

export default withSkeleton;
