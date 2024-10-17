import "./simpleTimeline.css"

const simpleTimeline = () => {
  return (
    <>
      <div className="timeline">
        <div className="events">
          {/* <!-- The first `1989` event --> */}
          <div className="event life">
            {/* <!-- The circle is an svg --> */}
            <svg
              className="marker"
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
            >
              <circle cx="6" cy="6" r="6"></circle>
            </svg>
            {/* <!-- The event info --> */}
            <div className="content">
              <time>1999</time>
              <div className="text">
                <p>I was born in the JinZhai</p>
              </div>
            </div>
          </div>
          <div className="event programming">
            {/* <!-- The circle is an svg --> */}
            <svg
              className="marker"
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
            >
              <circle cx="6" cy="6" r="6"></circle>
            </svg>
            {/* <!-- The event info --> */}
            <div className="content">
              <time>2008</time>
              <div className="text">
                <p>I met the computers for the first time</p>
              </div>
            </div>
          </div>
          <div className="event family">
            {/* <!-- The circle is an svg --> */}
            <svg
              className="marker"
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
            >
              <circle cx="6" cy="6" r="6"></circle>
            </svg>
            {/* <!-- The event info --> */}
            <div className="content">
              <time>2017</time>
              <div className="text">
                <p>I began to learn programming languages</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default simpleTimeline
