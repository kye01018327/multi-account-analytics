import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'


export default function Profile() {
    let navigate = useNavigate()
    const [name, setName] = useState('')
    const { profileName } = useParams()
    const [accounts, setAccounts] = useState([])
    const [update, setUpdate] = useState(true)
    const [accountName, setAccountName] = useState('')
    useEffect(() => {
        async function fetchData() {
            const res = await fetch(`http://127.0.0.1:5000/profiles/${profileName}`)
            if (!res.ok) {
                setName('ERROR')
                return
            }
            const d = await res.json()
            setName(d['profile_name'])
            setAccounts(d['accounts'])
        }
        fetchData()
    }, [update])

    async function handleLinkAccount() {
        const data = {profileName, accountName}
        console.log(data)
        const res = await fetch('http://127.0.0.1:5000/link_account', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })
        const result = await res.json()
        console.log(result)

    }

    async function handleUnlinkAccount() {
        const data = {profileName, accountName}
        const res = await fetch('http://127.0.0.1:5000/unlink_account', {
            'method': 'POST',
            'headers': {'Content-Type': 'application/json'},
            'body': JSON.stringify(data)
        })
        const result = await res.json()
        console.log(result)
    }
    return (
        <>
            {/* Profile Name */}
            <div>{ name }</div>

            {/* Link / Unlink Accounts feature */}
            <input placeholder='Account' onChange={(e) => {setAccountName(e.target.value)}}/>
            <button onClick={handleLinkAccount}>Link Account</button>
            <button onClick={handleUnlinkAccount}>Unlink Account</button>

            {/* Logout Button */}
            <button onClick={() => {navigate('/')}}>Log Out</button>
            
            <br/>
            <br/>

            {/* Display Linked Accounts */}
            <button onClick={() => {setUpdate(!update)}}>Update</button>
            <ul>
                {accounts.map((account: any, index: any) => (
                    <li key={index}>
                        {account}
                    </li>
                ))}
            </ul>
        </>
    )
}