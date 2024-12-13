import { useEffect, useRef } from "react"

const Pip = () => {
  const boxRef = useRef<HTMLDivElement>(null)

  const setGlobalCss = (pipWindow: Window) => {
    ;[...document.styleSheets].forEach((styleSheet) => {
      try {
        // 转成字符串方便赋值
        const cssRules = [...styleSheet.cssRules]
          .map((rule) => rule.cssText)
          .join("")
        // 创建style标签
        const style = document.createElement("style")
        // 设置为之前页面中的css信息
        style.textContent = cssRules
        // console.log('style', style);
        // 把style标签放到画中画的<head><head/>标签中
        pipWindow.document.head.appendChild(style)
      } catch (e) {
        // 通过 link 引入样式，如果有跨域，访问styleSheet.cssRules时会报错。没有跨域则不会报错
        const link = document.createElement("link")
        /**
         * rel = stylesheet 导入样式表
         * type: 对应的格式
         * media: 媒体查询（如 screen and (max-width: 600px)）
         *  href: 外部样式表的 URL
         */
        link.rel = "stylesheet"
        link.type = styleSheet.type
        link.media = styleSheet.media.toString()
        link.href = styleSheet.href ?? ""
        // console.log('error: link', link);
        pipWindow.document.head.appendChild(link)
      }
    })
  }

  const setAreaCss = (pipWindow: Window) => {
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.type = "text/css"
    link.href = "/src/demo/Pip.css"
    pipWindow.document.head.appendChild(link)
  }

  const onClose = () => {
    console.log("已退出 PIP 窗口")
  }

  const onClick = async () => {
    if (boxRef.current && "documentPictureInPicture" in window) {
      const pipWindow = await window.documentPictureInPicture.requestWindow({
        width: 300,
        height: 300,
      })
      // 设置样式
      //   setGlobalCss(pipWindow)
      setAreaCss(pipWindow)
      pipWindow.document.body.appendChild(boxRef.current.cloneNode(true))
      //清除监听
      pipWindow.removeEventListener("pagehide", onClose)
      // 监听画中画窗口的关闭事件
      pipWindow.addEventListener("pagehide", onClose)
    } else {
      alert("⚠️ 当前浏览器不支持 PiP 功能，更新浏览器或者换台电脑吧！")
    }
    //window.documentPictureInPicture.window.close(); 关闭画中画窗口
  }

  useEffect(() => {
    const onEnter = () => {
      console.log("已进入PiP窗口")
    }
    window.documentPictureInPicture.addEventListener("enter", onEnter)
    return () => {
      window.documentPictureInPicture.removeEventListener("enter", onEnter)
    }
  }, [])

  return (
    <div>
      <div
        ref={boxRef}
        className="box bg-[#6cc] w-[300px] h-[300px] text-center"
      >
        将这个盒子塞进画中画页面
      </div>
      <button onClick={onClick}>切换画中画模式</button>
    </div>
  )
}

export default Pip
