import { useState } from "react";
import './index.css'

// interface DynamicProgressProps {
//   // percent?: number;
// }

export default function DynamicProgress() {
  const [percent, setPercent] = useState(0);

  return (
    <div className="bg-[#6cc] overflow-hidden">
      <div className="relative bg-[#cc4f4f] w-[300px] h-[300px] leading-[300px] text-[100px] text-center border-[4px] rounded-[300px] mx-auto mt-[20px] overflow-hidden">
        <span className="relative z-10">{percent.toFixed(1)}</span>
        <div className="wave" style={{top:`${300-(percent*3)}px`}}></div>
      </div>
      <div className="h-[40px] flex items-center justify-center">
        <progress
          className="w-[300px] h-[8px] rounded-[10px] overflow-hidden"
          max={100}
          value={percent}
          onClick={(e) => {
            const long = e.nativeEvent.offsetX / 250;
            setPercent((long > 1 ? 1 : long) * 100);
          }}
        ></progress>
      </div>
    </div>
  );
};

// export default DynamicProgress;
