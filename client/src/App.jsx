import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { MainLayout } from './Layout'
import { FoliosPage } from './Pages'

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<FoliosPage />} />
          <Route path="/folios" element={<FoliosPage />} />
          {/* Add more routes here as needed */}
        </Routes>
      </MainLayout>
    </Router>
  )
}

export default App
