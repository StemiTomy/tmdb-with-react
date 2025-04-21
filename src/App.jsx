import './App.css'
import { Header } from './common/Header/Header'
import { AppRoutes } from './routes/AppRoutes';
import { SearchProvider } from './common/SearchContext';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <SearchProvider>
        <Header />
        <AppRoutes />
      </SearchProvider>
    </AuthProvider>
  )
}

export default App
