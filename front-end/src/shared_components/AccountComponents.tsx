import { useEffect, useState } from "react"
import { splitAccountName } from "../utils"

export function DisplayAccounts() {
    const [accounts, setAccounts] = useState([])
    const [update, setUpdate] = useState(true)
    useEffect(() => {
        async function getAccounts() {
            const res = await fetch(`http://127.0.0.1:5000/allaccounts`)
            const result = await res.json()
            setAccounts(result)
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

export function DisplayAccountMastery() {
    const [accountName, setAccountName] = useState('')
    const [totalMastery, setTotalMastery] = useState()
    
    async function handleSubmit() {
        // Send GET request to server's get masteries JSON endpoint
        const [gameName, tagLine] = splitAccountName(accountName)
        const query = new URLSearchParams({ gameName, tagLine }).toString()
        const res = await fetch(`http://127.0.0.1:5000/fetch_account_total_mastery?${query}`, {method: 'GET'})
        const result = await res.json()
        setTotalMastery(result)
    }
    return (
        <>
            <div>GET Total mastery score of account</div>
            <input placeholder='Enter account name' onChange={(e) => {setAccountName(e.target.value)}}/>
            <button onClick={handleSubmit}>Submit</button>
            <div>{totalMastery}</div>
        </>
    )
}