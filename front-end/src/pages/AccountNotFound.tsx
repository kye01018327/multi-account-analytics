import { useNavigate } from "react-router"

export default function AccountNotFound() {
    let navigate = useNavigate()
    return (
        <>
            <div>Account Not Found</div>
            <button onClick={() => {navigate('/')}}>Go back</button>
        </>
    )
}