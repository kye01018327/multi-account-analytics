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
    const [message, setMessage] = useState('')
    let navigate = useNavigate()

    const handleViewProfile = (e: any) => {
        e.preventDefault()
        if (username != '') {
            // Check if profile exists

            // Navigate to 
            navigate(`/profile/${username}`)
        }
    }

    const handleCreateProfile = (e: any) => {
        e.preventDefault()
        setMessage('Profile creation currently WIP')
        if (username != '') {
            // Profile Creation functionality
        }
    }

    return (
        <>
            <input onChange={(e) => {
                setUsername(e.target.value)}
            } name='Username' placeholder='Username'/>

            <button onClick={handleViewProfile}>View Profile</button>
            <button onClick={handleCreateProfile}>Create Profile</button>
            <div>{message}</div>
        </>
    )
}