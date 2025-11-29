import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Profile from './pages/Profile'
import AccountNotFound from './pages/AccountNotFound'
import Test from './Test'



function App() {
    return (
        <Routes>
            <Route index element={<Login/>}/>
            <Route path='/profile' element={<AccountNotFound/>}/>
            <Route path='/profile/:username' element={<Profile/>}/>
            <Route path='/test' element={<Test/>}/>
        </Routes>
    )
}

export default App