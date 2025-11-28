import { useNavigate } from 'react-router'


export default function Login() {
    return (
        <>
            <Title/>
            <SignInForm/>
            <CreateProfileButton/>
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
            <button type='submit'>View Profile</button>
        </form>
    )
}

function CreateProfileButton() {
    let navigate = useNavigate()
    return (
        <button onClick={() => {navigate('/createprofile')}}>Sign Up</button>
    )
}