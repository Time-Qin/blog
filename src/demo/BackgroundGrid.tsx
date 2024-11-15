import "./BackgroundGrid.css"

const BackgroundGrid = () => {
  return (
    <div className="background-grid">
      <div>
        <h4>使用背景图</h4>
        <div className="flex items-center">
          <span>单个背景图：</span>
          <i className="grid-solo ml-[8px]"></i>
        </div>
        <span>利用单个背景图不断重复渲染出整个网格：</span>
        <div className="grid-1"></div>
        <span>使用background-size样式控制网格大小；但要注意该属性值需要和SVG文件里的参数width和height保持一致，否则会出现线条粗细不一致的问题,如下：</span>
        <div className="flex items-center">
          <div className="flex-[1] grid-2 text-center">size:40px</div>
          <div className="flex-[1] grid-3 text-center">size:20px</div>
        </div>
        <h4>使用线性渐变</h4>
        <span>利用css的linear-gradient()函数实现</span>
        <div className="grid-linear"></div>
        <h4>边缘虚化</h4>
        <span>利用css的mask-image属性实现，这里通过径向渐变的方式实现：</span>
        <div className="grid-mask"></div>
        <span>四周线性渐变的遮罩效果实现：</span>
        <div className="grid-mask2"></div>
        <h4>点阵矩阵背景</h4>
        <span>利用css的radial-gradient函数实现，创建圆形填充背景色。</span>
        <div className="grid-circle"></div>
        <h4>马赛克背景</h4>
        <span>构建格子花纹实现</span>
        <div className="grid-grid"></div>
      </div>
    </div>
  )
}

export default BackgroundGrid
