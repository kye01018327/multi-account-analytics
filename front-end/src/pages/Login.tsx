import { useNavigate } from 'react-router'


export default function Login() {
    return (
        <>
            <Title/>
            <SignInForm/>
            <SignUpButton/>
        </>
    )
}

function Title() {
    return (
        <div>Login Page</div>
    )
}

function SignInForm() {
    let navigate = useNavigate()
    return (
        <form onSubmit={(e) => {
            e.preventDefault
            navigate('home')}}>
            <input name='Username' placeholder='Username'/>
            <input name='Password' placeholder='Password'/>
            <button type='submit'>Log In</button>
        </form>
    )
}

function SignUpButton() {
    let navigate = useNavigate()
    return (
        <button onClick={() => {navigate('/signup')}}>Sign Up</button>
    )
}