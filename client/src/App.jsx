import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { MainLayout } from './Layout'
import { FoliosPage, FilePage, CreateFilePage, CreateFolioPage } from './Pages'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <MainLayout>
            <FilePage />
          </MainLayout>
        } />
        <Route path="/folios" element={
          <MainLayout>
            <FoliosPage />
          </MainLayout>
        } />
        <Route path="/create-file" element={
          <MainLayout>
            <CreateFilePage />
          </MainLayout>
        } />
        <Route path="/create-folio" element={
          <MainLayout>
            <CreateFolioPage />
          </MainLayout>
        } />
        {/* Add more routes here as needed */}
      </Routes>
    </Router>
  )
}

export default App
