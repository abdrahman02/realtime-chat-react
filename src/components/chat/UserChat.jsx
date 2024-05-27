import PropTypes from "prop-types";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import { Stack } from "react-bootstrap";
import avatar from "../../assets/images/avatar.svg";
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { unreadNotificationFunc } from "../../utils/unreadNotification";
import moment from "moment";
import { useFetchLatestMessage } from "../../hooks/useFetchLatestMessage";

const UserChat = ({ chat, user }) => {
  const { recipientUser } = useFetchRecipientUser(chat, user);
  const { onlineUsers, notifications, MarkThisUserNotificationsAsRead } =
    useContext(ChatContext);

  const { latestMessage } = useFetchLatestMessage(chat);

  const unreadNotifications = unreadNotificationFunc(notifications);
  const thisUserNotifications = unreadNotifications?.filter(
    (n) => n.senderId == recipientUser._id
  );
  const isOnline = onlineUsers.some(
    (user) => user?.userId === recipientUser?._id
  );

  const truncateText = (text) => {
    let shortText = text.substring(0, 16);

    if (text.length > 16) {
      shortText = shortText + "...";
    }

    return shortText;
  };

  return (
    <Stack
      direction="horizontal"
      gap={3}
      className="user-card align-items-center p-2 justify-content-between"
      role="button"
      onClick={() => {
        if (thisUserNotifications?.length !== 0)
          MarkThisUserNotificationsAsRead(thisUserNotifications, notifications);
      }}
    >
      <div className="d-flex">
        <div className="me-2">
          <img src={avatar} alt="avatar" style={{ height: "35px" }} />
        </div>
        <div className="text-content">
          <div className="name">{recipientUser?.name}</div>
          <div className="text">
            {latestMessage?.text && (
              <span>{truncateText(latestMessage?.text)}</span>
            )}
          </div>
        </div>
      </div>

      <div className="d-flex flex-column align-items-end">
        <div className="date">
          {moment(latestMessage?.createdAt).calendar()}
        </div>
        <div
          className={
            thisUserNotifications?.length > 0 ? "this-user-notifications" : ""
          }
        >
          {thisUserNotifications?.length > 0
            ? thisUserNotifications?.length
            : ""}
        </div>
        <span className={isOnline ? "user-online" : ""}></span>
      </div>
    </Stack>
  );
};

UserChat.propTypes = {
  chat: PropTypes.object,
  user: PropTypes.object,
};

export default UserChat;
