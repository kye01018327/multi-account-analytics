import { Routes, Route, useNavigate } from 'react-router-dom'
import Login from './pages/Login'
import Profile from './pages/Profile'


function App() {
    return (
        <Routes>
            <Route index element={<Login/>}/>
            <Route path='/profile' element={<AccountNotFound/>}/>
            <Route path='/profile/:username' element={<Profile/>}/>
        </Routes>
    )
}

function AccountNotFound() {
    let navigate = useNavigate()
    return (
        <>
            <div>Account Not Found</div>
            <button onClick={() => {navigate('/')}}>Go back</button>
        </>
    )
}

export default App