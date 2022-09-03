const IconManager = ({ icon, ...remaining }) => {
  let { className } = remaining;
  const commonClass = "w-6 h-6";
  remaining.className = className ? className : commonClass;

  return "no icons found";
};
export default IconManager;
