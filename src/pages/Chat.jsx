import UserChat from "@/components/chat/UserChat";
import InputEmoji from "react-input-emoji";
import { memo, useCallback, useState } from "react";
import { useChat } from "@/context/ChatContext";
import { useAuth } from "@/context/AuthContext";
import ModalSearch from "@/components/chat/ModalSearch";

const Chat = () => {
  const { userChats } = useChat();
  const { user } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <div className="flex h-[calc(100vh-95px)] md:h-[calc(100vh-103px)]">
      <div className="w-1/3 h-full border-r px-4 pt-4">
        <div className="mb-4">
          <button
            onClick={openModal}
            className="p-2 bg-emerald-700 text-primary-foreground rounded w-full"
          >
            New User?
          </button>
        </div>
        <div className="h-full overflow-y-auto">
          {/* <h3 className="text-lg font-semibold mb-2">Users in Chat</h3> */}
          {/* <ul>
            {users.map((user) => (
              <li
                key={user.id}
                className="p-2 border-b cursor-pointer"
                onClick={() => setCurrentChat(user)}
              >
                {user.name}
              </li>
            ))}

            <li className="p-2 border-b cursor-pointer">
              Lorem ipsum dolor sit.
            </li>
          </ul> */}

          {userChats?.map((chat, index) => {
            return (
              // <div key={index} onClick={() => updateCurrentChat(chat)}>
              <div key={index}>
                <UserChat chat={chat} user={user} />
              </div>
            );
          })}
          <UserChat />
          <UserChat />
          <UserChat />
          <UserChat />
          <UserChat />
          <UserChat />
          <UserChat />
          <UserChat />
          <UserChat />
          <UserChat />
          <UserChat />
          <UserChat />
        </div>
      </div>
      <div className="w-2/3 h-full p-4">
        {/* {currentChat ? ( */}
        <>
          <div className="border-b pb-2 mb-4">
            {/* <h3 className="text-lg font-semibold">{currentChat.name}</h3> */}
            <h3 className="text-lg font-semibold">Lorem, ipsum dolor.</h3>
          </div>
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto mb-4">
              {/* {messages
                  .filter((msg) => msg.user.id === currentChat.id)
                  .map((msg, index) => (
                    <div key={index} className="mb-2">
                      <p>{msg.text}</p>
                    </div>
                  ))} */}

              <div className="mb-2">
                <p>
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Qui
                  officia error dolorum fugit sunt eos hic, illum dolore
                  doloribus expedita neque. Quia deleniti voluptatum quam unde,
                  facilis optio odio qui culpa laborum corporis quos possimus,
                  tenetur, quasi suscipit tempore ipsam.
                </p>
              </div>
            </div>
            <div className="flex">
              <InputEmoji
                placeholder="Type a message"
                // value={textMessage}
                // onChange={setTextMessage}
                fontFamily="nunito"
                borderColor="rgba(72, 112, 223, 0.2)"
                // onEnter={() =>
                //   sendTextMessage(
                //     textMessage,
                //     user,
                //     currentChat._id,
                //     setTextMessage
                //   )
                // }
                shouldReturn={true}
              />
              <button
                className="send-btn"
                // onClick={() =>
                //   sendTextMessage(
                //     textMessage,
                //     user,
                //     currentChat._id,
                //     setTextMessage
                //   )
                // }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-send"
                  viewBox="0 0 16 16"
                >
                  <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
                </svg>
              </button>

              {/* <input
                type="text"
                className="flex-1 p-2 border rounded"
                placeholder="Type a message..."
                // value={message}
                // onChange={(e) => setMessage(e.target.value)}
              />
              <button
                // onClick={handleSendMessage}
                className="ml-2 p-2 bg-blue-500 text-white rounded"
              >
                Send
              </button> */}
            </div>
          </div>
        </>
        {/* ) : (
          <p>Select a user to start chatting</p>
        )} */}
      </div>
      <ModalSearch
        open={isModalOpen}
        onClose={closeModal}
        // onSelectUser={handleSelectUser}
      />
    </div>
  );
};

export default memo(Chat);
