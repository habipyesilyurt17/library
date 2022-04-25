const Modal = (props) => {
  return (
    <>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white rounded shadow-2xl w-1/3 absolute py-8 px-6 sm:px-10">
          <div className="border-b mb-2 py-2 flex justify-between items-center">
            <h3 className="font-semibold text-lg">{props.title}</h3>
            <svg
              onClick={props.onCancel}
              className="h-6 w-6 cursor-pointer p-1 hover:bg-gray-300 rounded-full"
              id="close-modal"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
          <section className="">{props.children}</section>
          <section className="mt-4">
            {props.canConfirm && (
              <button
                className={`${
                  props.confirmColor === "danger"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }  w-full px-4 py-2 rounded text-white`}
                onClick={props.onConfirm}
              >
                {props.confirmText}
              </button>
            )}
          </section>
        </div>
      </div>
    </>
  );
};

export default Modal;
