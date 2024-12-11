import { useState } from "react"

interface VirtualListProps {
  className: string
  height: number
  width: number
  rowHeight: number
  list: number[]
  children: ({
    index,
    style,
  }: {
    index: number
    style: React.CSSProperties
  }) => JSX.Element
}

const Virtual = ({
  className,
  height,
  width,
  rowHeight,
  list,
  children,
}: VirtualListProps) => {
  const length = list.length
  const Childe = children
  const [scrollTop, setScrollTop] = useState(0)
  const maxHeight = length * rowHeight

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop } = e.currentTarget
    setScrollTop(scrollTop)
  }

  const computedNewList = () => {
    //可视区域索引
    const startIndex = Math.floor(scrollTop / rowHeight)
    //缓冲区索引
    const infinityIndex = Math.max(0, startIndex - 2)
    //可视区域内可展示的最大元素个数
    const visibleCount = Math.ceil(height / rowHeight)
    //可是区域内最后一个元素的索引
    const endIndex = Math.min(startIndex + visibleCount + 2, length)
    const items = []
    //向数组中添加元素
    for (let i = infinityIndex; i < endIndex; i++) {
      const itemStyle = {
        position: "absolute",
        height: `${rowHeight}px`,
        width: "100%",
        // 计算每个元素在container中的top值
        top: `${rowHeight * i}px`,
      } as React.CSSProperties
      items.push(<Childe key={i} index={i} style={itemStyle} />)
    }
    return items
  }

  return (
    <div className={className} style={{ height, width }} onScroll={onScroll}>
      <div style={{ height: `${maxHeight}px` }}>
        {/* {list.map((item, index) => {
          const top = index * rowHeight
          const style = {
            top: top > height ? height : top,
            height: rowHeight,
          }
          return <Childe key={index} index={index} style={style} />
        })} */}
        {computedNewList()}
      </div>
    </div>
  )
}

const VirtualList = () => {
  const list = Array(10000).fill(0)
  const row = ({
    index,
    style,
  }: {
    index: number
    style: React.CSSProperties
  }) => {
    return (
      <div className={index % 2 ? "bg-[#6ccc]" : "bg-[#fcc]"} style={style}>
        Row---{index}
      </div>
    )
  }

  return (
    <>
      虚拟列表
      <Virtual
        className="relative overflow-auto"
        height={200}
        width={200}
        rowHeight={50}
        list={list}
      >
        {row}
      </Virtual>
    </>
  )
}

export default VirtualList
