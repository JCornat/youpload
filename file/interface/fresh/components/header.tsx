export default function Header({ isLoggedIn, userName }: { isLoggedIn?: boolean; userName?: string }) {
  return (
    <div class='flex justify-end'>
      {isLoggedIn ? <a href='/account' class='underline'>Welcome, {userName}</a> : <a href='/sign-in' class='underline'>Log in</a>}
    </div>
  );
}
