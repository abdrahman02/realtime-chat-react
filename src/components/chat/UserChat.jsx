import PropTypes from "prop-types";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import avatar from "../../assets/images/avatar.svg";
import { useChat } from "../../context/ChatContext";
import { unreadNotificationFunc } from "../../utils/unreadNotification";
import moment from "moment";
import { useFetchLatestMessage } from "../../hooks/useFetchLatestMessage";
import { memo } from "react";

const UserChat = ({ chat, user }) => {
  const { recipientUser } = useFetchRecipientUser(chat, user);
  const { onlineUsers, notifications, MarkThisUserNotificationsAsRead } =
    useChat();

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
    <div
      className="flex justify-between items-center p-2 cursor-pointer"
      onClick={() => {
        if (thisUserNotifications?.length !== 0)
          MarkThisUserNotificationsAsRead(thisUserNotifications, notifications);
      }}
    >
      <div className="flex items-center">
        <img src={avatar} alt="avatar" className="h-9 mr-2" />
        <div>
          <div className="font-semibold">{recipientUser?.name}</div>
          <div className="text-sm text-gray-600">
            {latestMessage?.text && (
              <span>{truncateText(latestMessage?.text)}</span>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <div className="text-xs text-gray-500">
          {moment(latestMessage?.createdAt).calendar()}
        </div>
        <div
          className={thisUserNotifications?.length > 0 ? "text-red-500" : ""}
        >
          {thisUserNotifications?.length > 0
            ? thisUserNotifications?.length
            : ""}
        </div>
        {isOnline && (
          <span className="bg-green-500 w-2 h-2 rounded-full mt-1"></span>
        )}
      </div>
    </div>
  );
};

UserChat.propTypes = {
  chat: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

export default memo(UserChat);
