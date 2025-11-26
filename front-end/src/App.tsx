import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import CreateAccount from './pages/CreateAccount'
import Home from './pages/Home'


function App() {
    return (
        <Routes>
            <Route index element={<Login/>}/>
            <Route path='createaccount' element={<CreateAccount/>}/>
            <Route path='/home' element={<Home/>}/>
        </Routes>
    )
}

export default App