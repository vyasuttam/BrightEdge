import './App.css'
import { Routes, Route } from 'react-router-dom'
import { LoginPage } from './pages/loginPage'
import { SignupPage } from './pages/signupPage'
import VerifyPage from './pages/verifyPage'
import { Home } from './pages/home'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './utils/ProtectedRoute'
import { RootLayout } from './layout/RootLayout'
import DashboardPage from './pages/Dashboardpage'

function App() {

  return (
    <>
      <AuthProvider>
        <main className='min-h-screen'>
          <Routes>
            <Route path='/signup' element={<SignupPage />}/>
            <Route path='/login' element={<LoginPage />}/>
            <Route path='/verifyPage' element={<VerifyPage />}/>
              <Route
                path='/home' 
                element={
                  <ProtectedRoute>
                    <Home />
                </ProtectedRoute>
                } />
                <Route 
                  path='/dashboard' 
                  element={
                    <ProtectedRoute>
                      <RootLayout>
                        <DashboardPage />
                      </RootLayout>
                    </ProtectedRoute>
                  } />
          </Routes>

        </main>
      </AuthProvider>
    </>
  )
}

export default App
