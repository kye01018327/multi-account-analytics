import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Test from './Test'



function App() {
    return (
        <Routes>
            <Route index element={<Login/>}/>
            <Route path='/profile/:param' element={<Profile/>}/>
            <Route path='/test' element={<Test/>}/>
        </Routes>
    )
}

export default App