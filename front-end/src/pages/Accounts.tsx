import { useNavigate } from 'react-router'
import { AccountsComponent } from '../shared_components/AccountComponents'


export default function Accounts() {
    let navigate = useNavigate()
    return (
        <>
            <button onClick={() => {navigate('/')}}>Go back</button>
            <hr/>
            <AccountsComponent/>
        </>
    )
}