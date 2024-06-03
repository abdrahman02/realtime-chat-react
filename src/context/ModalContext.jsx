import { createContext, useCallback, useContext, useState } from "react";
import PropTypes from "prop-types";

const ModalContext = createContext();
export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined)
    throw new Error("useModal must be used within a ModalContextProvider");
  return context;
};

export const ModalContextProvider = ({ children }) => {
  const [modalInfo, setModalInfo] = useState({
    open: false,
    status: "",
    messages: [],
  });

  const showModal = useCallback((status, messages) => {
    setModalInfo({
      open: true,
      status,
      messages: Array.isArray(messages) ? messages : [messages],
    });
  }, []);

  const closeModal = useCallback(() => {
    setModalInfo((prev) => ({ ...prev, open: false }));
  }, []);

  const value = {
    modalInfo,
    setModalInfo,
    showModal,
    closeModal,
  };

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
};
ModalContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
