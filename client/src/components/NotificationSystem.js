import React, { useState } from "react";

const NotificationSystem = ({ userId }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "donation",
      title: "New Donation Received!",
      message: "You received a donation of KSh 5,000 from Anonymous Donor",
      date: new Date().toISOString(),
      read: false,
    },
    {
      id: 2,
      type: "milestone",
      title: "Campaign Milestone Reached",
      message: "Your campaign has reached 50% of its funding goal!",
      date: new Date(Date.now() - 86400000).toISOString(),
      read: false,
    },
    {
      id: 3,
      type: "update",
      title: "Progress Report Due",
      message: "Please submit your academic progress report for this semester",
      date: new Date(Date.now() - 172800000).toISOString(),
      read: true,
    },
  ]);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="notification-system">
      <div className="notification-header">
        <h3>Notifications</h3>
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </div>

      <div className="notifications-list">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`notification-item ${
              notification.read ? "read" : "unread"
            }`}
            onClick={() => markAsRead(notification.id)}
          >
            <div className="notification-icon">
              {notification.type === "donation" && ""}
              {notification.type === "milestone" && ""}
              {notification.type === "update" && ""}
            </div>
            <div className="notification-content">
              <h4>{notification.title}</h4>
              <p>{notification.message}</p>
              <span className="notification-date">
                {new Date(notification.date).toLocaleDateString()}
              </span>
            </div>
            {!notification.read && <div className="unread-dot"></div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationSystem;
