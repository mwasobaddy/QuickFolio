import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { MainLayout } from './Layout'
import { FoliosPage, HomePage } from './Pages'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/folios" element={
          <MainLayout>
            <FoliosPage />
          </MainLayout>
        } />
        {/* Add more routes here as needed */}
      </Routes>
    </Router>
  )
}

export default App
