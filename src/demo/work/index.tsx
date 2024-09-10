import { useEffect, useRef, useState } from "react"
import { retime } from "./api"

const RecountTime = () => {
  const [time, setTime] = useState<number>(120)
  const [time2, setTime2] = useState<number>(120)
  const [isRuning, setIsRunning] = useState<boolean>(false)
  const workerRef = useRef<Worker | null>(null)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const intervalStart = () => {
    intervalRef.current = setInterval(() => {
      request()
      setTime2((prevTime) => prevTime - 1)
    }, 1000)
  }

  const intervalStop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  useEffect(() => {
    if (time2 === 0) {
      intervalStop()
    }
  }, [time2])

  useEffect(() => {
    workerRef.current = new Worker(new URL("./CountTime.ts", import.meta.url))
    workerRef.current.onmessage = (event) => {
    //   console.log("worker", event)
      const { remainingTime } = event.data
      setTime(remainingTime)

      if (remainingTime === 0) {
        setIsRunning(false)
        alert("Countdown finished!")
      }
    }
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate()
      }
    }
  }, [])

  const handleStart = () => {
    // console.log(workerRef.current, "worker")
    if (workerRef.current) {
      workerRef.current.postMessage({ command: "start", timeInSeconds: time })
      setIsRunning(true)
    }
  }

  const handleStop = () => {
    if (workerRef.current) {
      workerRef.current.postMessage({ command: "stop" })
      setIsRunning(false)
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0")
    const secs = (seconds % 60).toString().padStart(2, "0")
    return `${minutes}:${secs}`
  }

  const request = async () => {
    await retime(1200).then((res) => {
    //   console.log("请求成功")
    })
  }

  return (
    <div className="text-center">
      <h1>worker线程倒计时--{formatTime(time)}</h1>
      <h1>主线程倒计时--{formatTime(time2)}</h1>
      <button
        className="bg-[#35971d] block text-[#fff] px-[20px] py-[5px] rounded-xl mx-auto mt-[10px]"
        disabled={isRuning}
        onClick={() => {
          handleStart()
          intervalStart()
        }}
      >
        Start
      </button>
      <button
        className="bg-[#ca2d28] block text-[#fff] px-[20px] py-[5px] rounded-xl mx-auto mt-[10px]"
        onClick={() => {
          handleStop()
          intervalStop()
        }}
      >
        Stop
      </button>
      <button
        className="bg-[#288fca] block text-[#fff] px-[20px] py-[5px] rounded-xl mx-auto mt-[10px]"
        onClick={request}
      >
        Request
      </button>
    </div>
  )
}

export default RecountTime
