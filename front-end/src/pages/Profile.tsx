import { useNavigate } from 'react-router'


function Profile() {
    let navigate = useNavigate()
    return (
        <>
            <div>Profile page</div>
            <button onClick={() => {navigate('/')}}>Log Out</button>
        </>
    )
}

export default Profile