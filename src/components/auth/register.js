import { Fragment, useContext } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { AppContext } from "../../contexts/appContexts";
import Spinner from "../feedback/spinner2";

export default function Register() {
  const contexts = useContext(AppContext);

  return (
    <Transition show={contexts.showRegister} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 flex items-end md:items-center justify-center px-3 text-center bg-black bg-opacity-60 backdrop-blur z-[999]"
        onClose={() => contexts.setShowRegister(false)}
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
          <Dialog.Panel className="w-full md:max-w-md rounded-lg bg-white shadow-xl mb-6 pb-6 px-4">
            <Dialog.Title
              as="h3"
              className="mt-6 text-center text-3xl font-bold tracking-tight text-red-600 mb-6"
            >
              Register
            </Dialog.Title>
            {contexts.regisMessage !== "" && contexts.regisMessage}
            <form
              className="mt-3"
              onSubmit={(e) => contexts.handlerRegister.mutate(e)}
            >
              <div className="mb-3">
                <input
                  name="email"
                  type="email"
                  required
                  className="block w-full rounded-md border-[2px] border-red-600 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-gray-400 focus:outline-none focus:ring-0"
                  placeholder="Email"
                  value={contexts.regisData.email}
                  onChange={contexts.OnChangeFormRegis}
                />
              </div>
              <div className="mb-3">
                <input
                  name="password"
                  type="password"
                  required
                  className="block w-full rounded-md border-[2px] border-red-600 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-gray-400 focus:outline-none focus:ring-0"
                  placeholder="Password"
                  value={contexts.regisData.password}
                  onChange={contexts.OnChangeFormRegis}
                />
              </div>
              <div className="mb-3">
                <input
                  name="name"
                  type="text"
                  required
                  className="block w-full rounded-md border-[2px] border-red-600 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-gray-400 focus:outline-none focus:ring-0"
                  placeholder="Full Name"
                  value={contexts.regisData.name}
                  onChange={contexts.OnChangeFormRegis}
                />
              </div>
              <div className="mb-5">
                <select
                  name="role"
                  className="block w-full rounded-md border-[2px] border-red-600 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-gray-400 focus:outline-none focus:ring-0"
                  value={contexts.regisData.role}
                  onChange={contexts.OnChangeFormRegis}
                >
                  <option>Chosee Role</option>
                  <option value="customer">As Customer</option>
                  <option value="admin">As Admin</option>
                </select>
              </div>
              <button
                type="submit"
                className="flex justify-center items-center group w-full rounded-md bg-red-600 hover:bg-red-500 py-[5px] px-4 text-md font-semibold text-white focus:outline-none"
              >
                {contexts.isLoading && (
                  <div className="w-7 h-7 mr-2">
                    <Spinner fill="text-red-50" />
                  </div>
                )}
                <div className="h-8 flex items-center">Register</div>
              </button>
            </form>
            <div>
              <h5 className="mt-4">
                Already have an account ? Click{" "}
                <span
                  className="text-red-600 hover:text-red-400 cursor-pointer"
                  onClick={() => {
                    contexts.setShowRegister(false);
                    setTimeout(() => {
                      contexts.setShowLogin(true);
                    }, 400);
                  }}
                >
                  Here
                </span>
              </h5>
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}
