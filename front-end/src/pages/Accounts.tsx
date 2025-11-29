import { useEffect, useState } from "react"
import { useNavigate } from "react-router"


export default function Accounts() {
    return (
        <>
            <ManageAccountsForm/>
            <GoBackButton/>
            <DisplayAccounts/>
        </>
    )
}


function ManageAccountsForm() {
    const [accountName, setAccountName] = useState('')

    async function handleAddAccount() {
        const data = {accountName}
        console.log(data)
        const res = await fetch('http://127.0.0.1:5000/add_account', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })
        const result = await res.json()
        console.log(result)

    }

    async function handleRemoveAccount() {

    }
    return (
        <>
            <input placeholder='Account' onChange={(e) => {setAccountName(e.target.value)}}/>
            <button onClick={handleAddAccount}>Add Account</button>
            <button onClick={handleRemoveAccount}>Remove Account</button>
        </>
    )
}

function DisplayAccounts() {
    const [accounts, setAccounts] = useState([])
    const [update, setUpdate] = useState(true)
    useEffect(() => {
        async function getAccounts() {
            const res = await fetch(`http://127.0.0.1:5000/allaccounts`)
            const result = await res.json()
            setAccounts(result)
            console.log(accounts)
        }
        getAccounts()
    }, [update])

    function handleClick() {
        setUpdate(!update)
    }

    return (
        <>
            <button onClick={handleClick}>Update</button>
            <ul>
                {accounts.map((account, index) => (
                    <li key={index}>
                        {account}
                    </li>
                ))}
            </ul>
        </>
    )
}

function GoBackButton() {
    const navigate = useNavigate()
    return (
        <button onClick={() => navigate('/')}>Go back</button>
    )
}