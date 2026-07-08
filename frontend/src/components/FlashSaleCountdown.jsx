import { useEffect, useState } from "react";

function FlashSaleCountdown({ endTime }) {
  const calculateTime = () => {
    const difference = new Date(endTime).getTime() - Date.now();

    if (difference <= 0) {
      return {
        days: "00",
        hours: "00",
        minutes: "00",
        seconds: "00",
      };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));

    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );

    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return {
      days: String(days).padStart(2, "0"),
      hours: String(hours).padStart(2, "0"),
      minutes: String(minutes).padStart(2, "0"),
      seconds: String(seconds).padStart(2, "0"),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTime());

  useEffect(() => {
    setTimeLeft(calculateTime());

    const timer = setInterval(() => {
      setTimeLeft(calculateTime());
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  return (
    <div className="flex items-center gap-2">
      <span className="bg-black text-white px-3 py-2 rounded-lg min-w-[52px] text-center">
        {timeLeft.days}
      </span>

      <span className="font-bold">:</span>

      <span className="bg-black text-white px-3 py-2 rounded-lg min-w-[52px] text-center">
        {timeLeft.hours}
      </span>

      <span className="font-bold">:</span>

      <span className="bg-black text-white px-3 py-2 rounded-lg min-w-[52px] text-center">
        {timeLeft.minutes}
      </span>

      <span className="font-bold">:</span>

      <span className="bg-black text-white px-3 py-2 rounded-lg min-w-[52px] text-center">
        {timeLeft.seconds}
      </span>
    </div>
  );
}

export default FlashSaleCountdown;
