import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Profile from './pages/Profile'


function App() {
    return (
        <Routes>
            <Route index element={<Login/>}/>
            <Route path='/profile' element={<Profile/>}/>
        </Routes>
    )
}

export default App