import { useRef, useState } from "react"
import Defuddle from "defuddle"
import "./ExtractHtml.css"

const ExtractHtml = () => {
  const tabs = [
    {
      label: "Content",
      tab: "content",
    },
    {
      label: "Metadata",
      tab: "metadata",
    },
    {
      label: "Debug",
      tab: "debug",
    },
  ]
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const urlRef = useRef<HTMLInputElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)
  const metadataOutputRef = useRef<HTMLPreElement>(null)
  const debugOutputRef = useRef<HTMLPreElement>(null)
  const errorContainerRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState<string>("content")

  const onClearInput = () => {
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  const onClearOutput = () => {
    if (outputRef.current) {
      outputRef.current.innerHTML = ""
      metadataOutputRef.current!.textContent = ""
      debugOutputRef.current!.textContent = ""
      hideError()
    }
  }
  const parseBtnOnClick = () => {
    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(inputRef.current!.value, "text/html")

      const defuddle = new Defuddle(doc, {
        url: urlRef.current!.value,
      })
      const result = defuddle.parse()

      // Log the full result for debugging
      console.log("Defuddle Result:", result)

      // Display content
      outputRef.current!.innerHTML = result.content

      // Display metadata - show all fields except content
      const { content, ...metadata } = result
      metadataOutputRef.current!.textContent = JSON.stringify(metadata, null, 2)

      // Display debug info with actual properties
      debugOutputRef.current!.textContent = JSON.stringify(
        {
          title: result.title || null,
          description: result.description || null,
          domain: result.domain || null,
          favicon: result.favicon || null,
          image: result.image || null,
          parseTime: result.parseTime || null,
          published: result.published || null,
          schemaOrgData: result.schemaOrgData || null,
          site: result.site || null,
          wordCount: result.wordCount || null,
          content: result.content ? "Content present" : "No content",
        },
        null,
        2
      )

      hideError()
    } catch (error: any) {
      console.error("Defuddle Error:", error)
      console.error("Error Stack:", error.stack)
      showError(error.message)
    }
  }
  const tabOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const targetTab = e.currentTarget.dataset.tab
    setActiveTab(targetTab!)
  }

  // Error handling
  function showError(message: string) {
    errorContainerRef.current!.textContent = message
    errorContainerRef.current!.classList.add("show")
  }

  function hideError() {
    errorContainerRef.current!.classList.remove("show")
  }
  return (
    <div className="container">
      {/* <header>
        <h1>Defuddle Playground</h1>
      </header> */}
      <div className="playground-container">
        <div className="input-section">
          <h2>Input HTML</h2>
          <div className="controls">
            <button id="clearInput" className="btn" onClick={onClearInput}>
              Clear
            </button>
          </div>
          <div className="url-input">
            <input
              ref={urlRef}
              type="text"
              id="url"
              className="padding-0"
              placeholder="URL..."
            />
          </div>
          <textarea
            ref={inputRef}
            id="input"
            placeholder="Paste your HTML here..."
          ></textarea>
        </div>

        <div className="output-section">
          <h2>Output</h2>
          <div className="controls">
            <button
              id="parse"
              className="btn primary"
              onClick={parseBtnOnClick}
            >
              Parse HTML
            </button>
            <button id="clearOutput" className="btn" onClick={onClearOutput}>
              Clear
            </button>
          </div>
          <div className="output-container">
            <div className="output-tabs">
              {tabs.map((tab, index) => (
                <button
                  key={index}
                  className={activeTab == tab.tab ? "tab active" : "tab"}
                  data-tab={tab.tab}
                  onClick={tabOnClick}
                >
                  {tab.label}
                </button>
              ))}
              {/* <button className="tab" data-tab="metadata" onClick={tabOnClick}>
                Metadata
              </button>
              <button className="tab" data-tab="debug" onClick={tabOnClick}>
                Debug
              </button> */}
            </div>
            <div
              className={
                activeTab == "content" ? "tab-content active" : "tab-content"
              }
              id="content"
            >
              <div ref={outputRef} id="output" className="output-content"></div>
            </div>
            <div
              className={
                activeTab == "metadata" ? "tab-content active" : "tab-content"
              }
              id="metadata"
            >
              <pre
                ref={metadataOutputRef}
                id="metadataOutput"
                className="output-content"
              ></pre>
            </div>
            <div
              className={
                activeTab == "debug" ? "tab-content active" : "tab-content"
              }
              id="debug"
            >
              <pre
                ref={debugOutputRef}
                id="debugOutput"
                className="output-content"
              ></pre>
            </div>
          </div>
        </div>
      </div>

      <div className="error-container" id="errorContainer"></div>
    </div>
  )
}

export default ExtractHtml
