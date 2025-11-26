import { useNavigate } from 'react-router'


function Login() {
    let navigate = useNavigate()
    return (
        <>
            <div>Hello Login page</div>
            <button onClick={() => {navigate('/home')}}>Log In</button>
            <button onClick={() => {navigate('/createaccount')}}>Create Account</button>
        </>
    )
}

export default Login