import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'


function Profile() {
    return (
        <>
            <ProfileName/>
            <ManageAccountsForm/>
            <LogOutButton/>
        </>
    )
}


function ProfileName() {
    const [profilename, setProfilename] = useState('')
    const { param } = useParams()
    useEffect(() => {
        async function fetchData() {
            const res = await fetch(`http://127.0.0.1:5000/profiles/${param}`)
            if (!res.ok) {
                setProfilename('ERROR')
                return
            }
            const data = await res.json()
            setProfilename(data)
        }
        fetchData()
    }, [])

    return (
        <div>{ profilename }</div>
    )
}


function ManageAccountsForm() {
    const [account, setAccount] = useState('')

    async function handleAddAccount() {
        const data = {account}
        const res = await fetch('http://127.0.0.1:5000/accounts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        console.log(data)
        const result = await res.json()
        console.log(result)
    }

    async function handleRemoveAccount() {

    }
    return (
        <>
            <input placeholder='Account' onChange={(e) => {setAccount(e.target.value)}}/>
            <button onClick={handleAddAccount}>Add Account</button>
            <button onClick={handleRemoveAccount}>Remove Account</button>
        </>
    )
}


function LogOutButton() {
    let navigate = useNavigate()
    return (
        <button onClick={() => {navigate('/')}}>Log Out</button>
    )
}

export default Profile