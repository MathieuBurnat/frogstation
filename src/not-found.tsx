import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { NotFound } from './pages/NotFound.tsx'
import './styles/global.css'

const root = document.getElementById('root')
if (!root) throw new Error('Élément #root introuvable dans 404.html')

createRoot(root).render(
  <StrictMode>
    <NotFound />
  </StrictMode>,
)
