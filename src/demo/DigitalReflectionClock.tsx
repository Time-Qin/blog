import { useEffect, useState } from "react";
import "./index.css";

const formatNum = (num: number) => {
  return num < 10 ? `0${num}` : num.toString();
};

const DigitalReflectionClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();

  const data = [
    {
      name: "hours",
      value: formatNum(hours),
      color: "#012030",
      background: "#13678A",
    },
    {
      name: "minutes",
      value: formatNum(minutes),
      color: "#012030",
      background: "#13678A",
    },
    {
      name: "seconds",
      value: formatNum(seconds),
      color: "#13678A",
      background: "#012030",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div id="reflection-clock" className="bg-[#6d6d6d] text-[#fff] h-[600px]">
      <div className="text-[50px] text-center py-[20px]">当前的设备时间</div>
      <div className="clock-box flex items-center gap-[10px] px-[50px]">
        {data.map((item, index) => (
          <div
            className="flex-1 text-center rounded-[20px]"
            style={{ background: item.color }}
            key={index}
          >
            <div className="text-[80px]">{item.value}</div>
            <div
              className="text-[40px]"
              style={{ background: item.background }}
            >
              {item.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DigitalReflectionClock;
