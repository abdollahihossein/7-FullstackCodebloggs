import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./sidebar.css";

const sidebarNavItems = [
  {
    display: "Home",
    icon: <i className="bx bx-home"></i>,
    to: "/home",
  },
  {
    display: "Bloggs",
    icon: <i className="bx bx-star"></i>,
    to: "/bloggs",
  },
  {
    display: "Network",
    icon: <i className="bx bx-calendar"></i>,
    to: "/network",
  },
  {
    display: "Admin",
    icon: <i className="bx bx-calendar"></i>,
    to: "/admin",
    access: "admin",
  },
];

const Sidebar = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [stepHeight, setStepHeight] = useState(0);
  const [userAccessLevel, setUserAccessLevel] = useState(null);
  const sidebarRef = useRef();
  const indicatorRef = useRef();
  const location = useLocation();

  useEffect(() => {
    // Make a fetch request to get the user's access level
    const email = localStorage.getItem("email");
    fetch(`http://localhost:5000/user/${email}`)
      .then((response) => response.json())
      .then((data) => {
        setUserAccessLevel(data.auth_level);
        console.log(data); // log the response data to the console
      })
      .catch((error) => console.error(error));

    setTimeout(() => {
      const sidebarItem = sidebarRef.current.querySelector(
        ".sidebar__menu__item"
      );
      indicatorRef.current.style.height = `${sidebarItem.clientHeight}px`;
      setStepHeight(sidebarItem.clientHeight);
    }, 50);
  }, []);

  const handleItemClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <div className="sidebar">
      <div className="sidebar__logo"></div>
      <div ref={sidebarRef} className="sidebar__menu">
        <div
          ref={indicatorRef}
          className="sidebar__menu__indicator"
          style={{
            transform: `translateX(-50%) translateY(${
              activeIndex * stepHeight
            }px)`,
          }}
        ></div>
        {sidebarNavItems.map((item, index) => {
          // Check if the user has access to the current menu item
          const hasAccess =
            !item.access ||
            userAccessLevel === item.access ||
            userAccessLevel === "admin";

          // Only render the menu item if the user has access
          if (hasAccess) {
            return (
              <Link
                to={item.to}
                key={index}
                onClick={() => handleItemClick(index)}
              >
                <div
                  className={`sidebar__menu__item ${
                    activeIndex === index ? "active" : ""
                  }`}
                >
                  <div className="sidebar__menu__item__icon">{item.icon}</div>
                  <div className="sidebar__menu__item__text">
                    {item.display}
                  </div>
                </div>
              </Link>
            );
          }
        })}
      </div>
    </div>
  );
};

export default Sidebar;
