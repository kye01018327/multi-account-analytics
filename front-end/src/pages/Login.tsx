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
    const [profilename, setProfilename] = useState('')
    const [message, setMessage] = useState('')
    let navigate = useNavigate()

    async function handleViewProfile(e: any) {
        e.preventDefault()
        if (profilename == '') {
            setMessage('Profile name cannot be blank')
            return
        }
        const res = await fetch(`http://127.0.0.1:5000/profiles/${profilename}`)
        if (res.status == 404) {
            setMessage('Profile does not exist')
            return
        }
        const data = await res.json()
        if (data[0] != '') {
            navigate(`/profile/${profilename}`)
        }
    }

    const handleCreateProfile = (e: any) => {
        e.preventDefault()
        setMessage('Profile creation currently WIP')
        if (profilename != '') {
            // Profile Creation functionality
        }
    }

    return (
        <>
            <input onChange={(e) => {
                setProfilename(e.target.value)}
            } name='Username' placeholder='Username'/>

            <button onClick={handleViewProfile}>View Profile</button>
            <button onClick={handleCreateProfile}>Create Profile</button>
            <div>{message}</div>
        </>
    )
}