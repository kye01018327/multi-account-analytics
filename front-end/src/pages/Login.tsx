import { useNavigate } from 'react-router'


export default function Login() {
    return (
        <>
            <Title/>
            <ProfileForm/>
        </>
    )
}

function Title() {
    return (
        <div>Login Page</div>
    )
}

function ProfileForm() {
    let navigate = useNavigate()
    return (
        <form onSubmit={(e) => {
            e.preventDefault
            navigate('home')}}>
            <input name='Username' placeholder='Username'/>
            <button type='submit'>View Profile</button>
            <button type='submit'>Create Profile</button>
        </form>
    )
}