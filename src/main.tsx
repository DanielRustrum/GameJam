import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.scss'

import { Menu } from './pages/Menu'
import { Stage } from './pages/Stage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/play" element={<Stage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
