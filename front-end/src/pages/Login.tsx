import { useNavigate } from 'react-router'


function Login() {
    let navigate = useNavigate()
    return (
        <button onClick={() => {navigate('/home')}}>Log In</button>
    )
}

export default Login