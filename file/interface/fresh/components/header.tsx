export default function Header({isLoggedIn, userName}: { isLoggedIn?: boolean, userName?: string }) {
  return (
    <div className='flex justify-end'>
      {isLoggedIn ? <a href='/account'>Welcome, {userName}</a> : <a href='/sign-in'>Log in</a>}
    </div>
  )
}