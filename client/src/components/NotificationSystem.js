import React, { useState, useEffect } from "react";

const NotificationSystem = ({ userId, campaignData, donations = [] }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Generate comprehensive notifications based on user's actual data
    const generateNotifications = () => {
      const newNotifications = [];

      // Check if campaign data exists
      if (!campaignData) {
        // No profile created yet
        newNotifications.push({
          id: 1,
          type: "welcome",
          title: "Welcome to ElimuFund!",
          message: "Complete your profile to start your education funding campaign.",
          date: new Date().toISOString(),
          read: false,
        });
      } else if (!campaignData.is_verified) {
        // Profile created but not verified yet
        newNotifications.push({
          id: 1,
          type: "info",
          title: "Profile Submitted",
          message: "Your profile has been submitted and is under review. We'll notify you once it's approved.",
          date: campaignData.created_at || new Date().toISOString(),
          read: false,
        });
      } else {
        // Profile is verified and campaign is live
        newNotifications.push({
          id: 1,
          type: "success",
          title: "Campaign Approved!",
          message: "Great news! Your campaign has been approved and is now live. Donors can now contribute to your education.",
          date: campaignData.created_at || new Date().toISOString(),
          read: false,
        });

        // Add individual donation notifications
        if (donations && donations.length > 0) {
          donations.forEach((donation, index) => {
            const donationDate = new Date(donation.created_at).toLocaleDateString('en-GB');
            newNotifications.push({
              id: 100 + index,
              type: "donation",
              title: "Donation Received!",
              message: `You received KSh ${donation.amount.toLocaleString()} ${donation.is_anonymous ? 'from an anonymous donor' : `from ${donation.donor?.username || 'a donor'}`} on ${donationDate}`,
              date: donation.created_at,
              read: false,
            });
          });
        }

        // Add milestone notifications based on actual progress
        const progressPercentage = Math.round((campaignData.amount_raised / campaignData.fee_amount) * 100);
        
        if (progressPercentage >= 25 && progressPercentage < 50) {
          newNotifications.push({
            id: 200,
            type: "milestone",
            title: "25% Milestone Reached!",
            message: `Your campaign has reached 25% of its funding goal! Keep sharing your story.`,
            date: new Date().toISOString(),
            read: false,
          });
        } else if (progressPercentage >= 50 && progressPercentage < 75) {
          newNotifications.push({
            id: 201,
            type: "milestone",
            title: "50% Milestone Reached!",
            message: `Amazing! Your campaign has reached 50% of its funding goal! You're halfway there!`,
            date: new Date().toISOString(),
            read: false,
          });
        } else if (progressPercentage >= 75 && progressPercentage < 100) {
          newNotifications.push({
            id: 202,
            type: "milestone",
            title: "75% Milestone Reached!",
            message: `Fantastic! Your campaign has reached 75% of its funding goal! Almost there!`,
            date: new Date().toISOString(),
            read: false,
          });
        } else if (progressPercentage >= 100) {
          newNotifications.push({
            id: 203,
            type: "milestone",
            title: "Goal Achieved!",
            message: "Congratulations! Your campaign has reached its funding goal! Your education is secured!",
            date: new Date().toISOString(),
            read: false,
          });
        }
      }

      // Sort notifications by date (newest first)
      newNotifications.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      setNotifications(newNotifications);
    };

    generateNotifications();
  }, [campaignData, donations]);

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
              {notification.type === "welcome" && ""}
              {notification.type === "info" && ""}
              {notification.type === "success" && ""}
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
