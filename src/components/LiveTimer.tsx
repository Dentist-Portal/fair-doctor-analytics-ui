import { useEffect, useState } from "react";

const LiveTimer = () => {
  const [dateState, setDateState] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDateState(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <p className=" text-xs text-gray-600 hidden md:block">
      {dateState.toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
      })}
    </p>
  );
};

export default LiveTimer;
