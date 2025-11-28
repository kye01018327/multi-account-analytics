import { useNavigate } from "react-router-dom"


export default function SignUp() {
    return (
        <>
            <div>Create Profile page</div>
            <CreateProfileForm/>
        </>
    )
}

function CreateProfileForm() {
    let navigate = useNavigate()
    return (
        <form onSubmit={() => {
            navigate('/')
        }}>
            <input placeholder="Username"/>
            <button type="submit">Create Profile</button>
        </form>
    )
}