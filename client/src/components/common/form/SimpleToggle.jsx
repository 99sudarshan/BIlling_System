import { Switch } from "@headlessui/react";

const SimpleToggle = ({ enabled, handleChange }) => {
  return (
    <div className="">
      <Switch
        checked={enabled}
        onChange={handleChange}
        className={`${enabled ? "bg-button" : "bg-background-dark_paper"}
          relative inline-flex flex-shrink-0 h-[32px] w-[60px] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
      >
        <span
          aria-hidden="true"
          className={`${enabled ? "translate-x-[30px]" : "translate-x-0.5"}
            pointer-events-none inline-block h-[24px] w-[24px] my-auto rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200`}
        />
      </Switch>
    </div>
  );
};

export default SimpleToggle;
