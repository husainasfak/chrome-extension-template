import './index.css'

import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import Content from './content/Content'



const root = document.createElement('div')
root.id = '__extension-container'
document.body.append(root)

createRoot(root).render(
  <StrictMode>
    <Content />
  </StrictMode>
)