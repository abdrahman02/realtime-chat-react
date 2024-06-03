import { CircleAlert, CircleCheckBig, TriangleAlert, X } from "lucide-react";
import PropTypes from "prop-types";

const Modal = ({ open, onClose, status, messages }) => {
  if (!open) return null;
  return (
    <div
      id="popup-modal"
      className={`${
        open ? "" : "hidden"
      } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-full max-h-full bg-gray-800/50 transition-all duration-200`}
    >
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-white rounded-lg shadow">
          <button
            type="button"
            className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center transition-all duration-200"
            onClick={onClose}
          >
            <X />
            <span className="sr-only">Close modal</span>
          </button>
          <div className="p-4 md:p-5 text-center">
            {status === "error" || status === "warning" ? (
              <TriangleAlert
                className={`mx-auto ${
                  status === "error" ? "text-destructive" : "text-yellow-600"
                } w-24 h-24`}
              />
            ) : (
              <CircleCheckBig className="mx-auto text-emerald-600 w-24 h-24" />
            )}
            <h3
              className={`mb-3 text-3xl font-medium ${
                status === "error"
                  ? "text-destructive"
                  : status === "warning"
                  ? "text-yellow-600"
                  : "text-emerald-600"
              } uppercase`}
            >
              {status}
            </h3>
            {status === "error" && messages && messages.length > 0 && (
              <ul className="max-h-16 mb-2 overflow-y-auto list-disc list-inside">
                {messages?.map((message, index) => (
                  <li
                    key={index}
                    className="flex justify-center items-center text-gray-600 text-sm font-light"
                  >
                    <CircleAlert className="w-4 h-4 me-2 text-destructive" />
                    {message}
                  </li>
                ))}
              </ul>
            )}
            {status === "warning" && (
              <p className="mb-2 text-gray-600 text-sm font-light">{`Apakah anda yakin ingin ${messages}?`}</p>
            )}
            {status === "success" && messages && messages.length > 0 && (
              <p className="mb-2 text-gray-600 text-sm font-light">
                {messages}
              </p>
            )}
            <button
              type="button"
              className="text-primary-foreground bg-primary/80 hover:bg-primary focus:ring-4 focus:outline-none focus:ring-secondary font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center transition-all duration-200"
              onClick={
                status === "error" || status === "success"
                  ? onClose
                  : () => true
              }
            >
              {status === "error" || status === "success"
                ? "OK"
                : "Yes, I'm sure"}
            </button>
            {status === "warning" && (
              <button
                type="button"
                className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-border hover:bg-gray-100 hover:text-primary focus:ring-4 focus:ring-gray-100 transition-all duration-200"
              >
                No, cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  status: PropTypes.oneOf(["", "error", "success", "warning"]),
  messages: PropTypes.array,
};

export default Modal;
