import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import './index.scss'

import { Menu } from './pages/Menu'
import { Field } from './pages/Field'
import { Stronghold } from './pages/Stronghold';
import { End } from './pages/Gameover';
import { Town } from './pages/Town';
import { Explore } from './pages/Explore';
import { Tutorial } from './pages/Tutorial';
import { setupBackgroundMusic } from './hooks/useBackgroundMusic';

const NotFound = () => {
  const navigate = useNavigate()

  useEffect(() => {
    navigate("/")
  }, [])


  return <p>Loading Home</p>
}

const Global = () => {
  const MusicWrapper = setupBackgroundMusic()
  
  const router_props = {
    basename: import.meta.env.BASE_URL === "/"? undefined: import.meta.env.BASE_URL
  }

  return (
    <MusicWrapper>
      <BrowserRouter {...router_props}>
        <Routes>
          <Route path="/" element={<Menu />} />
          <Route path="/field" element={<Field />} />
          <Route path="/upgrade" element={<Stronghold />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/end-game" element={<End />} />
          <Route path="/town" element={<Town />} />
          <Route path="/tutorial" element={<Tutorial />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </MusicWrapper>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Global />
  </StrictMode>,
)
