import { Switch } from "@headlessui/react";
import React from "react";

const Toggle = ({ enabled, setEnabled, bgEnabled, bgDisabled }) => {
  return (
    <Switch
      checked={enabled}
      onChange={setEnabled}
      className={`${enabled ? bgEnabled : bgDisabled}
          relative inline-flex h-[28px] w-[55px] shrink-0 cursor-pointer rounded-full border-2 border-slate-300 transition-colors duration-200 ease-in-out focus:outline-none`}
    >
      <span className="sr-only">Use setting</span>
      <span
        aria-hidden="true"
        className={`${enabled ? "translate-x-[29px]" : "translate-x-[2px]"}
            pointer-events-none inline-block h-[20px] w-[20px] mt-[2px] transform rounded-full bg-white ring-0 transition duration-200 ease-in-out`}
      />
    </Switch>
  );
};

export default Toggle;
