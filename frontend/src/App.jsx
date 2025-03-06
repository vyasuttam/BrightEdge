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
import { Coursepage } from './pages/Coursepage'
import { CourseDetailPage } from './pages/CourseDetailPage'

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
                    <RootLayout>
                      <Home />
                    </RootLayout>
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

                <Route 
                  path='/courses' 
                  element={
                    <ProtectedRoute>
                      <RootLayout>
                        <Coursepage />
                      </RootLayout>
                    </ProtectedRoute>
                  } />
                <Route 
                  path='/courses/:course_id' 
                  element={
                    <ProtectedRoute>
                      <RootLayout>
                        <CourseDetailPage />
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
