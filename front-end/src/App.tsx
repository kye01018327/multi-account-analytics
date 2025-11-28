import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import CreateProfile from './pages/CreateProfile'
import Home from './pages/Home'


function App() {
    return (
        <Routes>
            <Route index element={<Login/>}/>
            <Route path='signup' element={<CreateProfile/>}/>
            <Route path='/home' element={<Home/>}/>
        </Routes>
    )
}

export default App