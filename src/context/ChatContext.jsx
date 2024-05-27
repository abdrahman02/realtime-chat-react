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

  // Receive message
  useEffect(() => {
    if (socket === null) return;

    socket.on("getMessage", (res) => {
      if (currentChat?._id !== res.chatId) return;
      setMessages((prev) => [...prev, res]);
    });

    return () => {
      socket.off("getMessage");
    };
  }, [socket, currentChat]);

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
