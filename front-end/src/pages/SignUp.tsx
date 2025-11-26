import { useNavigate } from "react-router-dom"


export default function SignUp() {
    return (
        <>
            <div>Sign Up page</div>
            <CreateAccountForm/>
        </>
    )
}

function CreateAccountForm() {
    let navigate = useNavigate()
    return (
        <form onSubmit={() => {
            navigate('/')
        }}>
            <input placeholder="Username"/>
            <input placeholder="Enter Password"/>
            <button type="submit">Create Account</button>
        </form>
    )
}