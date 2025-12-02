import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Accounts from './pages/Accounts'
import Test from './Test'



function App() {
    return (
        <Routes>
            <Route index element={<Login/>}/>
            <Route path='/profile/:profileName' element={<Profile/>}/>
            <Route path='/accounts' element={<Accounts/>}/>
            <Route path='/test' element={<Test/>}/>
        </Routes>
    )
}

export default App