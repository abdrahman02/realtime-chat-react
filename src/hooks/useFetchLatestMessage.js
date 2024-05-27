import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { baseUrl, getRequest } from "../utils/services";

export const useFetchLatestMessage = (chat) => {
  const { newMessage, notifications } = useContext(ChatContext);
  const [latestMessage, setLatestMessage] = useState(null);

  useEffect(() => {
    const getMessage = async () => {
      const response = await getRequest(`${baseUrl}/messages/${chat?._id}`);
      if (response.success === false)
        return console.log("Error getting message", response.msg);

      const lastMessage = response.data[response.data.length - 1];
      setLatestMessage(lastMessage);
    };

    getMessage();
  }, [newMessage, notifications]);

  return { latestMessage };
};
