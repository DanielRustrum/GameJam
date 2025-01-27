import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.scss'

import { Menu } from './pages/Menu'
import { Field } from './pages/Field'
import { Stronghold } from './pages/Stronghold';
import { End } from './pages/Gameover';
import { Town } from './pages/Town';
import { Explore } from './pages/Explore';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/GameJam">
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/field" element={<Field />} />
        <Route path="/upgrade" element={<Stronghold />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/end-game" element={<End />} />
        <Route path="/town" element={<Town />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
