import "./PlaneWindow.css"

const PlaneWindow = () => {
  return (
    <div className="plane-window">
      <input type="checkbox" className="toggle" />
      <figure className="chuangkou">
        <div className="switch"></div>
        <div className="yunduo">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </figure>
    </div>
  )
}

export default PlaneWindow
