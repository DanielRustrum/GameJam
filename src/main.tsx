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
    <BrowserRouter>
      <Routes>
        <Route path="/GameJam" element={<Menu />} />
        <Route path="/GameJam/field" element={<Field />} />
        <Route path="/GameJam/upgrade" element={<Stronghold />} />
        <Route path="/GameJam/explore" element={<Explore />} />
        <Route path="/GameJam/end-game" element={<End />} />
        <Route path="/GameJam/town" element={<Town />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
