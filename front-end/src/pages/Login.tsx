import { useState } from 'react'
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
    const [username, setUsername] = useState('')
    let navigate = useNavigate()

    const handleSubmit = (e: any) => {
        e.preventDefault()
        if (username != '') {
            navigate(`/profile/${username}`)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <input onChange={(e) => {
                setUsername(e.target.value)}
            } name='Username' placeholder='Username'/>
            <button type='submit'>View Profile</button>
            <button type='submit'>Create Profile</button>
        </form>
    )
}