import './App.css'
import { Header } from './common/Header/Header'
import { Body } from './pages/Body/Body';
import { SearchProvider } from './common/SearchContext';
import { AuthProvider } from './services/AuthContext';

function App() {
  return (
    <AuthProvider>
      <SearchProvider>
        <Header />
        <Body />
      </SearchProvider>
    </AuthProvider>
  )
}

export default App
