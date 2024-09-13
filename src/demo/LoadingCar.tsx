import "./LoadingCar.css"

const LoadingCar = () => {
  return (
    <div className="loading-car h-[300px]">
      <svg className="truck" viewBox="0 0 48 24" width="48px" height="24px">
        <g
          fill="none"
          stroke="currentcolor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1"
          transform="translate(0,2)"
        >
          <g className="tt-bb">
            <g strokeDasharray="105 105">
              <polyline
                className="tt-oo1"
                points="2 17,1 17,1 11,5 9,7 1,39 1,39 6"
              />
              <polyline className="tt-oo2" points="39 12,39 17,31.5 17" />
              <polyline className="tt-oo3" points="22.5 17,11 17" />
              <polyline className="tt-ww1" points="6.5 4,8 4,8 9,5 9" />
              <polygon className="tt-ww2" points="10 4,10 9,14 9,14 4" />
            </g>
            <polyline
              className="tt-ll"
              points="43 8,31 8"
              strokeDasharray="10 2 10 2 10 2 10 2 10 2 10 26"
            />
            <polyline
              className="tt-ll"
              points="47 10,31 10"
              strokeDasharray="14 2 14 2 14 2 14 2 14 18"
            />
          </g>
          <g strokeDasharray="15.71 15.71">
            <g className="tt-ee">
              <circle className="tt-ee-spin" r="2.5" cx="6.5" cy="17" />
            </g>
            <g className="tt-ee">
              <circle className="tt-ee-spin" r="2.5" cx="27" cy="17" />
            </g>
          </g>
        </g>
      </svg>
    </div>
  )
}

export default LoadingCar
