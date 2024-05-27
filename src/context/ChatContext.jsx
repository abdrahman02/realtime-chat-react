import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import PropTypes from "prop-types";
import { baseUrl, postRequest, getRequest } from "../utils/services";
import { io } from "socket.io-client";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState([]);
  const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
  const [isUserChatsError, setIsUserChatsError] = useState(null);
  const [potentialChats, setPotentialChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [isMessagesError, setIsMessagesError] = useState(null);
  const [isSendMessagesError, setIsSendMessagesError] = useState(null);
  const [newMessage, setNewMessage] = useState(null);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      const response = await getRequest(`${baseUrl}/users`);

      if (response.success === false) return setIsUserChatsError(response.msg);

      const pChats = response.datas.filter((u) => {
        let isChatCreated = false;

        if (user?._id === u._id) return false;

        if (userChats) {
          isChatCreated = userChats?.some((chat) => {
            return chat.members[0] === u._id || chat.members[1] === u._id;
          });
        }

        return !isChatCreated;
      });

      setPotentialChats(pChats);
      setAllUsers(response.datas);
    };

    getUsers();
  }, [userChats]);

  useEffect(() => {
    const getUserChats = async () => {
      if (user?._id) {
        setIsUserChatsLoading(true);
        setIsUserChatsError(null);
        const response = await getRequest(`${baseUrl}/chats/${user?._id}`);

        setIsUserChatsLoading(false);
        if (response.success === false)
          return setIsUserChatsError(response.msg);

        setUserChats(response.data);
      }
    };

    getUserChats();
  }, [user]);

  const createChat = useCallback(async (firstId, secondId) => {
    const response = await postRequest(
      `${baseUrl}/chats`,
      JSON.stringify({
        firstId,
        secondId,
      })
    );
    if (response.success === false) return setIsUserChatsError(response.msg);

    setUserChats((prev) => [...prev, response.data]);
  }, []);

  const updateCurrentChat = useCallback(
    (chat) => {
      setCurrentChat(chat);
    },
    [currentChat]
  );

  useEffect(() => {
    const getMessage = async () => {
      setIsMessagesLoading(true);
      setIsMessagesError(null);
      const response = await getRequest(
        `${baseUrl}/messages/${currentChat?._id}`
      );

      setIsMessagesLoading(false);
      if (response.success === false) return setIsMessagesError(response.msg);

      setMessages(response.data);
    };

    getMessage();
  }, [currentChat]);

  const sendTextMessage = useCallback(
    async (textMessage, sender, currentChatId, setTextMessage) => {
      if (!textMessage) return setIsMessagesError("You must type something");

      const response = await postRequest(
        `${baseUrl}/messages`,
        JSON.stringify({
          chatId: currentChatId,
          senderId: sender._id,
          text: textMessage,
        })
      );

      if (response.success === false) return setIsMessagesError(response.msg);

      setNewMessage(response.data);
      setMessages((prev) => [...prev, response.data]);
      setTextMessage("");
    },
    []
  );

  // Connecting to socket
  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, [user]);

  // Add new online users
  useEffect(() => {
    if (socket == null) return;
    socket.emit("addNewUser", user?._id);
    socket.on("getOnlineUser", (res) => {
      setOnlineUsers(res);
    });

    return () => socket.off("getOnlineUser");
  }, [socket]);

  // Send message
  useEffect(() => {
    if (socket === null) return;

    const recipientId = currentChat?.members.find((id) => id !== user?._id);

    socket.emit("sendMessage", { ...newMessage, recipientId });
  }, [newMessage]);

  // Receive message and notifications
  useEffect(() => {
    if (socket === null) return;

    socket.on("getMessage", (res) => {
      if (currentChat?._id !== res.chatId) return;
      setMessages((prev) => [...prev, res]);
    });

    socket.on("getNotification", (res) => {
      const isChatOpen = currentChat?.members.some((id) => id === res.senderId);

      isChatOpen
        ? setNotifications((prev) => [{ ...res, isRead: true }, ...prev])
        : setNotifications((prev) => [res, ...prev]);
    });

    return () => {
      socket.off("getMessage");
    };
  }, [socket, currentChat]);

  const markAllNotificationsAsRead = useCallback((notification) => {
    const mNotifications = notification.map((n) => {
      return { ...n, isRead: true };
    });

    setNotifications(mNotifications);
  }, []);

  const markNotificationAsRead = useCallback(
    (n, userChats, user, notifications) => {
      // find chat to open
      const desiredChat = userChats.find((chat) => {
        const chatMembers = [user._id, n.senderId];
        const isDesiredChat = chat?.members.every((member) => {
          return chatMembers.includes(member);
        });
        return isDesiredChat;
      });

      // mark notification as read
      const mNotifications = notifications.map((el) => {
        if (n.senderId === el.senderId) {
          return { ...n, isRead: true };
        } else {
          return el;
        }
      });

      updateCurrentChat(desiredChat);
      setNotifications(mNotifications);
    }
  );

  const MarkThisUserNotificationsAsRead = useCallback(
    (thisUserNotifications, notifications) => {
      // mark notification as read
      const mNotifications = notifications.map((el) => {
        let notification;

        thisUserNotifications.forEach((n) => {
          if (n.senderId === el.senderId) {
            notification = { ...n, isRead: true };
          } else {
            notification = el;
          }
        });

        return notification;
      });

      setNotifications(mNotifications);
    },
    []
  );

  return (
    <ChatContext.Provider
      value={useMemo(
        () => ({
          userChats,
          isUserChatsLoading,
          isUserChatsError,
          potentialChats,
          createChat,
          currentChat,
          updateCurrentChat,
          messages,
          isMessagesLoading,
          isMessagesError,
          sendTextMessage,
          onlineUsers,
          notifications,
          allUsers,
          markAllNotificationsAsRead,
          markNotificationAsRead,
          MarkThisUserNotificationsAsRead,
        }),
        [
          userChats,
          isUserChatsLoading,
          isUserChatsError,
          potentialChats,
          createChat,
          currentChat,
          updateCurrentChat,
          messages,
          isMessagesLoading,
          isMessagesError,
          sendTextMessage,
          onlineUsers,
          notifications,
          allUsers,
          markAllNotificationsAsRead,
          markNotificationAsRead,
          MarkThisUserNotificationsAsRead,
        ]
      )}
    >
      {children}
    </ChatContext.Provider>
  );
};

ChatContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
  user: PropTypes.object,
};
