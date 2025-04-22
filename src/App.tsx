
import './App.css'

function App() {

  return (
    <div>
      <div>
        🔍 Page Info
      </div>
      <p className='text-xl'><strong>URL:</strong> {window.location.href}</p>
      <p><strong>Title:</strong> {document.title}</p>
    </div>
  )
}

export default App
