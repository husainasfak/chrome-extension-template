
import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')

  useEffect(() => {
    chrome.tabs?.query({ active: true, currentWindow: true }, (tabs) => {
      console.log('tabs', tabs)
      if (tabs.length > 0) {
        setUrl(tabs[0].url || '')
        setTitle(tabs[0].title || '')
      }
    })
  }, [])

  return (
    <div>
      <h2>Current Tab Info</h2>
      <p><strong>Title:</strong> {title}</p>
      <p><strong>URL:</strong> {url}</p>
    </div>
  )
}

export default App
