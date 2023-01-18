import { Fragment, useContext } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { AppContext } from "../../contexts/appContexts";
import Spinner from "../feedback/spinner2";

const Confirm = ({ show, setShow, handler, itemId }) => {
  return (
    <Transition.Root show={show} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 flex items-end md:items-center justify-center px-3 text-center bg-black bg-opacity-60 backdrop-blur z-[999]"
        onClose={() => setShow(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enterTo="opacity-100 translate-y-0 sm:scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 translate-y-0 sm:scale-100"
          leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <Dialog.Panel className="w-full md:max-w-md rounded-lg bg-white border-2 border-red-500 shadow-xl mb-6 pb-6 px-4">
            <Dialog.Title
              as="h3"
              className="mt-6 text-center text-2xl font-bold tracking-tight text-red-600 mb-6"
            >
              Are you sure?
            </Dialog.Title>
            <div className="flex justify-center gap-2">
              <button className="bg-red-600 w-24 py-1 font-bold text-white rounded-md hover:bg-red-500" onClick={() => setShow(false)}>
                No
              </button>
              <button className="bg-slate-500 w-24 py-1 font-bold text-white rounded-md hover:bg-slate-400">
                Yes
              </button>
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  );
};

export default Confirm;
