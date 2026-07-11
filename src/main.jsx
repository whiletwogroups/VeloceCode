import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { RoadmapProvider } from './context/RoadmapContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RoadmapProvider>
      <App />
    </RoadmapProvider>
  </React.StrictMode>,
)
