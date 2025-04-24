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
import { CourseContentPage } from './pages/CourseContentPage'
import { CourseCreationPage } from './pages/CourseCreationPage'
import EditSectionPage from './pages/EditSectionPage'
import EditContentPage from './pages/EditContentPage'
import { RoleContextProvider } from './context/RoleContext'
import { ToastContainer } from 'react-toastify';
import { Examspage } from './pages/Examspage'
import { ExamCreationPage } from './pages/ExamCreationPage'
import { QuestionCreationPage } from './pages/QuestionCreationPage'
import { ExamQuestionsPage } from './pages/ExamQuestionspage'
import { ExamResultPage } from './pages/ExamResultPage'
import { ExamUpdatePage } from './pages/ExamUpdationPage'
import { PerformancePage } from './pages/PerformancePage'
import { ForgetPasswordPage } from './pages/ForgetPasswordPage'
import { CourseCertificatePage } from './pages/CourseCertificatePage'
import CourseUpdateForm from './pages/EditCoursePage'
import AdminLoginPage from './pages/_admin/AdminLogin'
import AdminPanel from './pages/_admin/AdminPanel'
import Dashboard from './pages/_admin/components/AdminDashboard'
import AdminCourses from './pages/_admin/components/AdminCourses'
import AdminExams from './pages/_admin/components/AdminExams'
import AdminUsers from './pages/_admin/components/AdminUsers'
import { CourseEnrollmentInfoPage } from './pages/CourseEnrollmentInfoPage'
import { ProfilePage } from './pages/user/ProfilePage'
import { AdminAuthProvider } from './context/AdminContext'
import { ExamLoginPage } from './pages/ExamLoginPage'

function App() {

  return (
    <>
          <main className='min-h-screen'>
            <Routes>
              <Route path='/signup' element={<SignupPage />}/>
              <Route path='/login' element={
                <AuthProvider>
                  <LoginPage />
                </AuthProvider>
                }/>
              <Route path='/verifyPage' element={<VerifyPage />}/>
                <Route
                  path='/' 
                  element={
                    <AuthProvider>
                      <RootLayout>
                        <Home />
                      </RootLayout>
                    </AuthProvider>
                  } />
                  <Route 
                    path='/dashboard' 
                    element={
                      <AuthProvider>
                        <ProtectedRoute>
                          <RoleContextProvider>
                              <DashboardPage />   
                          </RoleContextProvider>
                        </ProtectedRoute>
                      </AuthProvider>
                    } />

                  <Route 
                    path='/profile/:userId' 
                    element={
                      <AuthProvider>
                      <ProtectedRoute>
                        <RoleContextProvider>
                            <ProfilePage />   
                        </RoleContextProvider>
                      </ProtectedRoute>
                      </AuthProvider>
                    } />

                  <Route 
                    path='/courses' 
                    element={
                      <AuthProvider>
                      <ProtectedRoute>
                        <RootLayout>
                          <Coursepage />
                        </RootLayout>
                      </ProtectedRoute>
                      </AuthProvider>
                    } />
                  <Route 
                    path='/courses/:course_id' 
                    element={
                      <AuthProvider>
                      <ProtectedRoute>
                        <RootLayout>
                          <CourseDetailPage />
                        </RootLayout>
                      </ProtectedRoute>
                      </AuthProvider>
                    } />

                  <Route 
                    path='/courses/:course_id/courseContent' 
                    element={
                      <AuthProvider>
                      <ProtectedRoute>
                        <RootLayout>
                          <CourseContentPage />
                        </RootLayout>
                      </ProtectedRoute>
                      </AuthProvider>
                    } />

                  <Route 
                    path='/dashboard/course-create' 
                    element={
                      <AuthProvider>
                      <ProtectedRoute>
                          <CourseCreationPage />
                      </ProtectedRoute>
                      </AuthProvider>
                    } />

                  <Route
                      path='/courses/:courseId/updateCourse'   
                      element={
                        <AuthProvider>
                        <ProtectedRoute>
                            <CourseUpdateForm />
                        </ProtectedRoute>
                      </AuthProvider>
                      
                    } />

                  <Route 
                    path='/courses/:courseId/editSections' 
                    element={
                      <AuthProvider>
                      <ProtectedRoute>
                          <EditSectionPage />
                      </ProtectedRoute>
                      </AuthProvider>
                    } /> 

                  <Route 
                    path='/courses/:courseId/:sectionId/editContent' 
                    element={
                      <AuthProvider>
                      <ProtectedRoute>
                          <EditContentPage />
                      </ProtectedRoute>
                      </AuthProvider>
                    } /> 
                  
                  <Route 
                    path='/exams' 
                    element={
                      <AuthProvider>


                      <ProtectedRoute>
                          <Examspage />
                      </ProtectedRoute>
                      </AuthProvider>
                    } />

                  <Route 
                    path='/exams/exam-create' 
                    element={
                      <AuthProvider>


                      <ProtectedRoute>
                          <ExamCreationPage />
                      </ProtectedRoute>
                      </AuthProvider>
                    } /> 

                  <Route 
                    path='/exams/:examId/manage-questions' 
                    element={
                      <AuthProvider>


                      <ProtectedRoute>
                          <QuestionCreationPage />
                      </ProtectedRoute>
                      </AuthProvider>
                    } />
                  <Route
                    path='/exams/:examId/examQuestions' 
                    element={
                      <AuthProvider>


                      <ProtectedRoute>
                          <ExamQuestionsPage />
                      </ProtectedRoute>
                      </AuthProvider>
                    } />
                    
                    <Route
                    path='/exams/:examId/examResult' 
                    element={
                      <AuthProvider>


                      <ProtectedRoute>
                          <ExamResultPage />
                      </ProtectedRoute>
                      </AuthProvider>
                    } />

                    <Route
                      path='/exams/:examId/examUpdation' 
                      element={
                        <AuthProvider>
                          

                      <ProtectedRoute>
                          <ExamUpdatePage />
                      </ProtectedRoute>
                        </AuthProvider>
                    } />

                    <Route
                      path='/exams/:examId/performance'   
                      element={
                        <AuthProvider>


                      <ProtectedRoute>
                          <PerformancePage />
                      </ProtectedRoute>
                        </AuthProvider>
                    } />

                    <Route
                      path='/exams/:examId/login'   
                      element={
                        <AuthProvider>
                      <ProtectedRoute>
                          <ExamLoginPage />
                      </ProtectedRoute>
                        </AuthProvider>
                    } />

                    <Route
                      path='/reset-password'   
                      element={
                        <AuthProvider>
                          <ForgetPasswordPage />
                        </AuthProvider>
                    } />
                    <Route
                      path='/courses/:course_id/courseCertificate'   
                      element={
                        <AuthProvider>


                      <ProtectedRoute>
                          <CourseCertificatePage />
                      </ProtectedRoute>
                        </AuthProvider>
                    } />

                    <Route path="/courses/:course_id/enrollments"
                    
                      element={                        
                      <AuthProvider>
                    <ProtectedRoute>
                        <CourseEnrollmentInfoPage />
                    </ProtectedRoute>
                      </AuthProvider>} />

                      <Route path='/admin-login' element={
                        <AdminAuthProvider>
                          <AdminLoginPage />
                        </AdminAuthProvider>
                        }/>
                      <Route path="/admin" element={
                        <>
                          <AdminAuthProvider>
                            <AdminPanel />
                          </AdminAuthProvider>
                        </>
                        
                        }>
                        <Route path="dashboard" element={
                          <>
                            <AdminAuthProvider>
                              <Dashboard />
                            </AdminAuthProvider>
                          </>
                          } />
                        <Route path="courses" element={<AdminCourses />} />
                        <Route path="exams" element={<AdminExams />} />
                         <Route path="users" element={<AdminUsers />} />
                        {/* <Route path="submissions" element={<Submissions />} /> */}
                    </Route>

                </Routes>
          </main>
      <ToastContainer position="top-right" /> 
    </>
  )
}

export default App
