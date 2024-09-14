import { useEffect, useRef } from "react"
import "./PrintingText.css"

const loop = true
const sleepTime = 100
const topics = [
  "JavaScript",
  "TypeScript",
  "Node.js",
  "React",
  "Vue.js",
  "Astro",
  "Bun",
  "Deno",
  "CSS-in-JS",
]

const PrintingText = () => {
  const languageRef = useRef<HTMLSpanElement>(null)
  const defaultText = topics[0]
  let currentIndex = 0
  let reverse = true

  useEffect(() => {
    let timer = setTimeout(() => {
      animate()
    }, 3000)
    return () => {
      clearTimeout(timer)
    }
  }, [])

  const animate = async () => {
    let index = 0
    //循环
    while (loop || index < topics.length) {
      const currentTopic = topics[currentIndex]
      if (reverse) {
        await reduceText(currentTopic)
        await sleep(sleepTime * 5)
      } else {
        await increaseText(currentTopic)
        await sleep(sleepTime * 15)

        await reduceText(currentTopic)
        await sleep(sleepTime * 5)
      }

      index++
      if (currentIndex === topics.length - 1) {
        currentIndex = 0
      } else {
        currentIndex++
      }
    }
  }

  const reduceText = async (text: string) => {
    for (let i = text.length; i > 0; i--) {
      if (languageRef.current) {
        languageRef.current.textContent = text.substring(0, i - 1)
        if (i === 1) {
          reverse = false
        }
        await sleep(sleepTime)
      }
    }
  }

  const increaseText = async (text: string) => {
    for (let i = 0; i < text.length; i++) {
      if (languageRef.current) {
        languageRef.current.textContent = text.substring(0, i + 1)
        await sleep(sleepTime)
      }
    }
  }

  const sleep = (ms: number) => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms)
    })
  }

  return (
    <h1>
      <div className="flex whitespace-pre-wrap ">
        The Best of{" "}
        <span className="underline decoration-[#f77103]" ref={languageRef}>
          {defaultText}
        </span>
        <span className="animate-cursor-pulse">|</span>
      </div>
    </h1>
  )
}

export default PrintingText
