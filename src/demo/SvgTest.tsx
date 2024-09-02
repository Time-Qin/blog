import { useState } from "react";
import "./index.css";

const SvgTest = () => {
  const [easing, setEasing] = useState("linear");
  const [easingT, setEasingT] = useState("linear");
  return (
    <div id="svg-test">
      <h3>绘制圆环</h3>
      <p>
        我们首先创建一个svg标签。<code>viewBox="0 0 800 800"</code>
        将原点设置在左上角，并使宽度和高度各为 800 个单位。
      </p>
      <p>
        然后，我们创建一个圆形元素。<code>cx</code>和<code>cy</code>
        属性将圆心分别定位在 x 轴和 y 轴上 400 个单位的位置;半径为200 个单位；（
        <code>r</code>）， 描边宽度40 个单位。
        <code>fill="none"</code>
        确保圆是空心的，从而形成我们的旋转器的基本形状。
      </p>
      <div className="h-[500px] flex justify-center items-center border-model">
        <svg viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
          <circle
            cx="400"
            cy="400"
            fill="none"
            r="200"
            strokeWidth="50"
            stroke="#E387FF"
          />
        </svg>
      </div>
      <div className="bg-[#24292e] overflow-x-auto border-model mt-[10px]">
        <pre>
          <code>
            <span className="sign-code">
              &lt;<span className="ele-code">svg</span>
              <span className="propty-code"> viewBox</span>=
              <span className="value-code">"0 0 800 800"</span>
              <span className="propty-code"> xmlns</span>=
              <span className="value-code">"http://www.w3.org/2000/svg" </span>
              &gt;
            </span>
            <br />
            <span className="sign-code">
              &nbsp;&nbsp;&lt;
              <span className="ele-code">circle</span>
              <span className="propty-code"> cx</span>=
              <span className="value-code">"400"</span>
              <span className="propty-code"> cy</span>=
              <span className="value-code">"400"</span>
              <span className="propty-code"> fill</span>=
              <span className="value-code">"none"</span>
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;
              <span className="propty-code"> r</span>=
              <span className="value-code">"200"</span>
              <span className="propty-code"> stroke-width</span>=
              <span className="value-code">"50"</span>
              <span className="propty-code"> stroke</span>=
              <span className="value-code">"#E387FF"</span>
              /&gt;
            </span>
            <br />
            <span className="sign-code">
              &lt;/<span className="ele-code">svg</span>&gt;
            </span>
          </code>
        </pre>
      </div>
      <h3 className="mt-[10px]">将圆环“砍一刀”</h3>
      <p>
        <code>stroke-dasharray</code>属性，它控制图形笔划中的划线和间隙的模式。
      </p>
      <p>
        例如，值<code>600 200</code>
        意味着600个单位，然后是200个单位的差距。可以提供多于2个值；值
        <code>600 200 400 100</code>
        意味着模式由600个单位，200个单位的缺口，400个单位,100个单位的缺口组成。
      </p>
      <p>
        在下面的示例中，我们为间隙设置了一个较大的值，以确保只显示一个图形。当破折号的值为
        <code>dash=0</code>时，我们得不到任何可见的东西(间隙占据了所有可见的笔划)
        ，当值为1257时(给定半径为200)
        ，我们又得到了一个完整的圆。这是因为圆的周长是2 * π * 半径(2 * 3.1416 *
        200 = 1,256.64)
      </p>
      <div className="h-[500px] flex justify-center items-center border-model">
        <svg viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
          <circle
            cx="400"
            cy="400"
            fill="none"
            r="200"
            strokeWidth="50"
            stroke="#E387FF"
            strokeDasharray="700 1400"
          />
        </svg>
      </div>
      <div className="bg-[#24292e] overflow-x-auto border-model mt-[10px]">
        <pre>
          <code>
            <span className="sign-code">
              &lt;<span className="ele-code">svg</span>
              <span className="propty-code"> viewBox</span>=
              <span className="value-code">"0 0 800 800"</span>
              <span className="propty-code"> xmlns</span>=
              <span className="value-code">"http://www.w3.org/2000/svg" </span>
              &gt;
            </span>
            <br />
            <span className="sign-code">
              &nbsp;&nbsp;&lt;
              <span className="ele-code">circle</span>
              <span className="propty-code"> cx</span>=
              <span className="value-code">"400"</span>
              <span className="propty-code"> cy</span>=
              <span className="value-code">"400"</span>
              <span className="propty-code"> fill</span>=
              <span className="value-code">"none"</span>
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;
              <span className="propty-code"> r</span>=
              <span className="value-code">"200"</span>
              <span className="propty-code"> stroke-width</span>=
              <span className="value-code">"50"</span>
              <span className="propty-code"> stroke</span>=
              <span className="value-code">"#E387FF"</span>
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;
              <span className="propty-code"> stroke-dasharray</span>=
              <span className="value-code">"700 1400"</span>
              /&gt;
            </span>
            <br />
            <span className="sign-code">
              &lt;/<span className="ele-code">svg</span>&gt;
            </span>
          </code>
        </pre>
      </div>
      <h3 className="mt-[10px]">使切口变得圆滑</h3>
      <p>
        <code>strokeLinecap="round"</code>属性可以给图形添加圆角效果
      </p>
      <div className="h-[500px] flex justify-center items-center border-model">
        <svg viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
          <circle
            cx="400"
            cy="400"
            fill="none"
            r="200"
            strokeWidth="50"
            stroke="#E387FF"
            strokeDasharray="700 1400"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div className="bg-[#24292e] overflow-x-auto border-model mt-[10px]">
        <pre>
          <code>
            <span className="sign-code">
              &lt;<span className="ele-code">svg</span>
              <span className="propty-code"> viewBox</span>=
              <span className="value-code">"0 0 800 800"</span>
              <span className="propty-code"> xmlns</span>=
              <span className="value-code">"http://www.w3.org/2000/svg" </span>
              &gt;
            </span>
            <br />
            <span className="sign-code">
              &nbsp;&nbsp;&lt;
              <span className="ele-code">circle</span>
              <span className="propty-code"> cx</span>=
              <span className="value-code">"400"</span>
              <span className="propty-code"> cy</span>=
              <span className="value-code">"400"</span>
              <span className="propty-code"> fill</span>=
              <span className="value-code">"none"</span>
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;
              <span className="propty-code"> r</span>=
              <span className="value-code">"200"</span>
              <span className="propty-code"> stroke-width</span>=
              <span className="value-code">"50"</span>
              <span className="propty-code"> stroke</span>=
              <span className="value-code">"#E387FF"</span>
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;
              <span className="propty-code"> stroke-dasharray</span>=
              <span className="value-code">"700 1400"</span>
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;
              <span className="propty-code"> stroke-linecap</span>=
              <span className="value-code">"round"</span>
              /&gt;
            </span>
            <br />
            <span className="sign-code">
              &lt;/<span className="ele-code">svg</span>&gt;
            </span>
          </code>
        </pre>
      </div>
      <h3 className="mt-[10px]">控制🔪“砍”的位置</h3>
      <p>
        <code>stroke-dashoffset</code>属性可以偏移“橡皮擦”的开始
      </p>
      <div className="h-[500px] flex justify-center items-center border-model">
        <svg viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
          <circle
            cx="400"
            cy="400"
            fill="none"
            r="200"
            strokeWidth="50"
            stroke="#E387FF"
            strokeDasharray="700 1400"
            strokeLinecap="round"
            strokeDashoffset="0"
          />
        </svg>
      </div>
      <div className="bg-[#24292e] overflow-x-auto border-model mt-[10px]">
        <pre>
          <code>
            <span className="sign-code">
              &lt;<span className="ele-code">svg</span>
              <span className="propty-code"> viewBox</span>=
              <span className="value-code">"0 0 800 800"</span>
              <span className="propty-code"> xmlns</span>=
              <span className="value-code">"http://www.w3.org/2000/svg" </span>
              &gt;
            </span>
            <br />
            <span className="sign-code">
              &nbsp;&nbsp;&lt;
              <span className="ele-code">circle</span>
              <span className="propty-code"> cx</span>=
              <span className="value-code">"400"</span>
              <span className="propty-code"> cy</span>=
              <span className="value-code">"400"</span>
              <span className="propty-code"> fill</span>=
              <span className="value-code">"none"</span>
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;
              <span className="propty-code"> r</span>=
              <span className="value-code">"200"</span>
              <span className="propty-code"> stroke-width</span>=
              <span className="value-code">"50"</span>
              <span className="propty-code"> stroke</span>=
              <span className="value-code">"#E387FF"</span>
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;
              <span className="propty-code"> stroke-dasharray</span>=
              <span className="value-code">"700 1400"</span>
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;
              <span className="propty-code"> stroke-linecap</span>=
              <span className="value-code">"round"</span>
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;
              <span className="propty-code"> stroke-dashoffset</span>=
              <span className="value-code">"0"</span>
              /&gt;
            </span>
            <br />
            <span className="sign-code">
              &lt;/<span className="ele-code">svg</span>&gt;
            </span>
          </code>
        </pre>
      </div>
      <h3 className="mt-[10px]">用CSS旋转图形</h3>
      <p>只是一个简单的 CSS 动画，让这个圆不断地围绕它的中心旋转:</p>
      <div className="h-[342px] flex items-center ">
        <div className="flex-[1] border-model">
          <svg viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
            <circle
              className="spin"
              cx="400"
              cy="400"
              fill="none"
              r="200"
              strokeWidth="50"
              stroke="#E387FF"
              strokeDasharray="700 1400"
              strokeLinecap="round"
              style={{ "--easing": easing } as any}
            />
          </svg>
        </div>
        <div className="h-[100%] flex-[1] ml-[10px] border-model">
          <div className=" p-[24px]">
            <label htmlFor="">选择:</label>
            <select
              className="bg-[#6cc] px-[4px] py-[2px] rounded-[4px]"
              onChange={(e) => {
                const { value } = e.target;
                if (value) {
                  setEasing(value);
                }
              }}
            >
              <option value="linear">linear</option>
              <option value="ease">ease</option>
              <option value="ease-in">ease-in</option>
              <option value="ease-out">ease-out</option>
              <option value="ease-in-out">ease-in-out</option>
            </select>
          </div>
        </div>
      </div>
      <div className="bg-[#24292e] overflow-x-auto border-model mt-[10px]">
        <pre>
          <code>
            <span className="sign-code">
              &lt;<span className="ele-code">style</span>&gt;
            </span>
            <br />
            <span className="sign-code">
              <span className="value-code">@keyframes spin </span>
              {"{"}
            </span>
            <br />
            &nbsp;&nbsp;
            <span className="sign-code">
              <span className="ele-code">to </span>
              {"{"}
            </span>
            <br />
            <span className="sign-code">
              &nbsp;&nbsp;&nbsp;&nbsp;
              <span className="propty-code">transform: rotate(360deg);</span>
            </span>
            <br />
            &nbsp;&nbsp;
            <span className="sign-code">{"}"}</span>
            <br />
            <span className="sign-code">{"}"}</span>
            <br />
            <br />
            <span className="sign-code">
              <span className="ele-code">.spin </span>
              {"{"}
            </span>
            <br />
            <span className="propty-code"> transform-origin: center;</span>
            <br />
            <span className="propty-code">
              {" "}
              animation: spin 2s {easing} infinite;
            </span>
            <br />
            <span className="sign-code">{"}"}</span>
            <br />
            <span className="sign-code">
              &lt;/<span className="ele-code">style</span>&gt;
            </span>
            <br />
            <br />
            <span className="sign-code">
              &lt;<span className="ele-code">svg</span>
              <span className="propty-code"> viewBox</span>=
              <span className="value-code">"0 0 800 800"</span>
              <span className="propty-code"> xmlns</span>=
              <span className="value-code">"http://www.w3.org/2000/svg" </span>
              &gt;
            </span>
            <br />
            <span className="sign-code">
              &nbsp;&nbsp;&lt;
              <span className="ele-code">circle</span>
              <span className="propty-code"> class</span>=
              <span className="value-code">"spin"</span>
              <span className="propty-code"> cx</span>=
              <span className="value-code">"400"</span>
              <span className="propty-code"> cy</span>=
              <span className="value-code">"400"</span>
              <span className="propty-code"> fill</span>=
              <span className="value-code">"none"</span>
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;
              <span className="propty-code"> r</span>=
              <span className="value-code">"200"</span>
              <span className="propty-code"> stroke-width</span>=
              <span className="value-code">"50"</span>
              <span className="propty-code"> stroke</span>=
              <span className="value-code">"#E387FF"</span>
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;
              <span className="propty-code"> stroke-dasharray</span>=
              <span className="value-code">"700 1400"</span>
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;
              <span className="propty-code"> stroke-linecap</span>=
              <span className="value-code">"round"</span>
              /&gt;
            </span>
            <br />
            <span className="sign-code">
              &lt;/<span className="ele-code">svg</span>&gt;
            </span>
          </code>
        </pre>
      </div>
      <h3 className="mt-[10px]">动画效果</h3>
      <p>
        我们还可以对<code>stroke-dasharray</code>属性的值进行动画处理
      </p>
      <div className="h-[342px] flex items-center ">
        <div className="flex-[1] border-model">
          <svg viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
            <circle
              className="progress"
              cx="400"
              cy="400"
              fill="none"
              r="200"
              strokeWidth="50"
              stroke="#E387FF"
              strokeDasharray="700 1400"
              strokeLinecap="round"
              style={{ "--easing": easingT } as any}
            />
          </svg>
        </div>
        <div className="h-[100%] flex-[1] ml-[10px] border-model">
          <div className=" p-[24px]">
            <label htmlFor="">选择:</label>
            <select
              className="bg-[#6cc] px-[4px] py-[2px] rounded-[4px]"
              onChange={(e) => {
                const { value } = e.target;
                if (value) {
                  setEasingT(value);
                }
              }}
            >
              <option value="linear">linear</option>
              <option value="ease">ease</option>
              <option value="ease-in">ease-in</option>
              <option value="ease-out">ease-out</option>
              <option value="ease-in-out">ease-in-out</option>
            </select>
          </div>
        </div>
      </div>
      <div className="bg-[#24292e] overflow-x-auto border-model mt-[10px]">
        <pre>
          <code>
            <span className="sign-code">
              &lt;<span className="ele-code">style</span>&gt;
            </span>
            <br />
            <span className="sign-code">
              <span className="value-code">@keyframes progress </span>
              {"{"}
            </span>
            <br />
            &nbsp;&nbsp;
            <span className="sign-code">
              <span className="ele-code">from </span>
              {"{"}
            </span>
            <br />
            <span className="sign-code">
              &nbsp;&nbsp;&nbsp;&nbsp;
              <span className="propty-code">stroke-dasharray: 0 1400;</span>
            </span>
            <br />
            &nbsp;&nbsp;
            <span className="sign-code">{"}"}</span>
            <br />
            &nbsp;&nbsp;
            <span className="sign-code">
              <span className="ele-code">to </span>
              {"{"}
            </span>
            <br />
            <span className="sign-code">
              &nbsp;&nbsp;&nbsp;&nbsp;
              <span className="propty-code">stroke-dasharray: 1257 1400;</span>
            </span>
            <br />
            &nbsp;&nbsp;
            <span className="sign-code">{"}"}</span>
            <br />
            <span className="sign-code">{"}"}</span>
            <br />
            <br />
            <span className="sign-code">
              <span className="ele-code">.progress </span>
              {"{"}
            </span>
            <br />
            <span className="propty-code">
              {" "}
              animation: progress 2s {easingT} infinite;
            </span>
            <br />
            <span className="propty-code">
              {" "}
              animation-direction: alternate;
            </span>
            <br />
            <span className="sign-code">{"}"}</span>
            <br />
            <span className="sign-code">
              &lt;/<span className="ele-code">style</span>&gt;
            </span>
            <br />
            <br />
            <span className="sign-code">
              &lt;<span className="ele-code">svg</span>
              <span className="propty-code"> viewBox</span>=
              <span className="value-code">"0 0 800 800"</span>
              <span className="propty-code"> xmlns</span>=
              <span className="value-code">"http://www.w3.org/2000/svg" </span>
              &gt;
            </span>
            <br />
            <span className="sign-code">
              &nbsp;&nbsp;&lt;
              <span className="ele-code">circle</span>
              <span className="propty-code"> class</span>=
              <span className="value-code">"progress"</span>
              <span className="propty-code"> cx</span>=
              <span className="value-code">"400"</span>
              <span className="propty-code"> cy</span>=
              <span className="value-code">"400"</span>
              <span className="propty-code"> fill</span>=
              <span className="value-code">"none"</span>
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;
              <span className="propty-code"> r</span>=
              <span className="value-code">"200"</span>
              <span className="propty-code"> stroke-width</span>=
              <span className="value-code">"50"</span>
              <span className="propty-code"> stroke</span>=
              <span className="value-code">"#E387FF"</span>
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;
              <span className="propty-code"> stroke-dasharray</span>=
              <span className="value-code">"700 1400"</span>
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;
              <span className="propty-code"> stroke-linecap</span>=
              <span className="value-code">"round"</span>
              /&gt;
            </span>
            <br />
            <span className="sign-code">
              &lt;/<span className="ele-code">svg</span>&gt;
            </span>
          </code>
        </pre>
      </div>
      <h3 className="mt-[10px]">动态漩涡效果</h3>
      <p>
        动画 <code>stroke-dasharray</code> 和 <code>stroke-dashoff</code>{" "}
        值实现了一个动态漩涡效果
      </p>
      <div className="h-[450px] flex justify-center items-center border-model">
        <svg viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
          <circle
            className="spin2"
            cx="400"
            cy="400"
            fill="none"
            r="200"
            strokeWidth="50"
            stroke="#E387FF"
            strokeDasharray="700 1400"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div className="bg-[#24292e] overflow-x-auto border-model mt-[10px]">
        <pre>
          <code>
            <span className="sign-code">
              &lt;<span className="ele-code">style</span>&gt;
            </span>
            <br />
            <span className="sign-code">
              <span className="value-code">@keyframes spin </span>
              {"{"}
            </span>
            <br />
            &nbsp;&nbsp;
            <span className="sign-code">
              <span className="ele-code">to </span>
              {"{"}
            </span>
            <br />
            <span className="sign-code">
              &nbsp;&nbsp;&nbsp;&nbsp;
              <span className="propty-code">transform: rotate(360deg);</span>
            </span>
            <br />
            &nbsp;&nbsp;
            <span className="sign-code">{"}"}</span>
            <br />
            <span className="sign-code">{"}"}</span>
            <br />
            <span className="sign-code">
              <span className="value-code">@keyframes spin2 </span>
              {"{"}
            </span>
            <br />
            &nbsp;&nbsp;
            <span className="sign-code">
              <span className="ele-code">0% </span>
              {"{"}
            </span>
            <br />
            <span className="sign-code">
              &nbsp;&nbsp;&nbsp;&nbsp;
              <span className="propty-code">stroke-dasharray: 1, 800;</span>
            </span>
            <br />
            <span className="sign-code">
              &nbsp;&nbsp;&nbsp;&nbsp;
              <span className="propty-code">stroke-dashoffset: 0;</span>
            </span>
            <br />
            &nbsp;&nbsp;
            <span className="sign-code">{"}"}</span>
            <br />
            &nbsp;&nbsp;
            <span className="sign-code">
              <span className="ele-code">50% </span>
              {"{"}
            </span>
            <br />
            <span className="sign-code">
              &nbsp;&nbsp;&nbsp;&nbsp;
              <span className="propty-code">stroke-dasharray: 400, 400;</span>
            </span>
            <br />
            <span className="sign-code">
              &nbsp;&nbsp;&nbsp;&nbsp;
              <span className="propty-code">stroke-dashoffset: -200px;</span>
            </span>
            <br />
            &nbsp;&nbsp;
            <span className="sign-code">{"}"}</span>
            <br />
            &nbsp;&nbsp;
            <span className="sign-code">
              <span className="ele-code">100% </span>
              {"{"}
            </span>
            <br />
            <span className="sign-code">
              &nbsp;&nbsp;&nbsp;&nbsp;
              <span className="propty-code">stroke-dasharray: 800, 1;</span>
            </span>
            <br />
            <span className="sign-code">
              &nbsp;&nbsp;&nbsp;&nbsp;
              <span className="propty-code">stroke-dashoffset: -800;</span>
            </span>
            <br />
            &nbsp;&nbsp;
            <span className="sign-code">{"}"}</span>
            <br />
            <span className="sign-code">{"}"}</span>
            <br />
            <br />
            <span className="sign-code">
              <span className="ele-code">.spin2 </span>
              {"{"}
            </span>
            <br />
            &nbsp;&nbsp;
            <span className="propty-code">transform-origin: center;</span>
            <br />
            &nbsp;&nbsp;
            <span className="propty-code">
              animation: spin2 1.5s ease-in-out infinite,
              <br />
              &nbsp;&nbsp; spin 2s linear infinite;
            </span>
            <br />
            &nbsp;&nbsp;
            <span className="propty-code">animation-direction: alternate;</span>
            <br />
            <span className="sign-code">{"}"}</span>
            <br />
            <span className="sign-code">
              &lt;/<span className="ele-code">style</span>&gt;
            </span>
            <br />
            <br />
            <span className="sign-code">
              &lt;<span className="ele-code">svg</span>
              <span className="propty-code"> viewBox</span>=
              <span className="value-code">"0 0 800 800"</span>
              <span className="propty-code"> xmlns</span>=
              <span className="value-code">"http://www.w3.org/2000/svg" </span>
              &gt;
            </span>
            <br />
            <span className="sign-code">
              &nbsp;&nbsp;&lt;
              <span className="ele-code">circle</span>
              <span className="propty-code"> class</span>=
              <span className="value-code">"spin2"</span>
              <span className="propty-code"> cx</span>=
              <span className="value-code">"400"</span>
              <span className="propty-code"> cy</span>=
              <span className="value-code">"400"</span>
              <span className="propty-code"> fill</span>=
              <span className="value-code">"none"</span>
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;
              <span className="propty-code"> r</span>=
              <span className="value-code">"200"</span>
              <span className="propty-code"> stroke-width</span>=
              <span className="value-code">"50"</span>
              <span className="propty-code"> stroke</span>=
              <span className="value-code">"#E387FF"</span>
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;
              <span className="propty-code"> stroke-dasharray</span>=
              <span className="value-code">"700 1400"</span>
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;
              <span className="propty-code"> stroke-linecap</span>=
              <span className="value-code">"round"</span>
              /&gt;
            </span>
            <br />
            <span className="sign-code">
              &lt;/<span className="ele-code">svg</span>&gt;
            </span>
          </code>
        </pre>
      </div>
    </div>
  );
};

export default SvgTest;
