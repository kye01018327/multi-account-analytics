import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Profile from './pages/Profile'
import AccountNotFound from './pages/AccountNotFound'


function App() {
    return (
        <Routes>
            <Route index element={<Login/>}/>
            <Route path='/profile' element={<AccountNotFound/>}/>
            <Route path='/profile/:username' element={<Profile/>}/>
        </Routes>
    )
}

export default App