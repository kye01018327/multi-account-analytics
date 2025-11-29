import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Accounts from './pages/Accounts'



function App() {
    return (
        <Routes>
            <Route index element={<Login/>}/>
            <Route path='/profile/:profileName' element={<Profile/>}/>
            <Route path='/accounts' element={<Accounts/>}/>
        </Routes>
    )
}

export default App