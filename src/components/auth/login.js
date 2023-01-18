import { Fragment, useContext } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { AppContext } from "../../contexts/appContexts";
import Spinner from "../feedback/spinner2";

export default function Login() {
  const contexts = useContext(AppContext);

  return (
    <Transition show={contexts.showLogin} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 flex items-end md:items-center justify-center px-3 text-center bg-black bg-opacity-60 backdrop-blur z-[999]"
        onClose={() => contexts.setShowLogin(false)}
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
              Login
            </Dialog.Title>
            {contexts.loginMessage !== "" && contexts.loginMessage}
            <form
              className="mt-3"
              onSubmit={(e) => contexts.handlerLogin.mutate(e)}
            >
              <div className="mb-3">
                <input
                  name="email"
                  type="email"
                  required
                  className="block w-full rounded-md border-[2px] border-red-600 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-gray-400 focus:outline-none focus:ring-0"
                  placeholder="Email"
                  value={contexts.loginData.email}
                  onChange={contexts.OnChangeFormLogin}
                />
              </div>
              <div className="mb-5">
                <input
                  name="password"
                  type="password"
                  required
                  className="block w-full rounded-md border-[2px] border-red-600 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-gray-400 focus:outline-none focus:ring-0"
                  placeholder="Password"
                  value={contexts.loginData.password}
                  onChange={contexts.OnChangeFormLogin}
                />
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
                <div className="h-8 flex items-center">Login</div>
              </button>
            </form>
            <div>
              <h5 className="mt-4">
                Don't have an account ? Click{" "}
                <span
                  className="text-red-600 hover:text-red-400 cursor-pointer"
                  onClick={() => {
                    contexts.setShowLogin(false);
                    setTimeout(() => {
                      contexts.setShowRegister(true);
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
