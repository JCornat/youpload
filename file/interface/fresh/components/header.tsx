export default function Header({ isLoggedIn }: { isLoggedIn?: boolean }) {
  return (
    <div class='flex items-center mb-4 p-4 gap-4 text-slate-700'>
      <a href="/">
        <img
          src="/logo.svg"
          width="48"
          height="48"
          alt="the Fresh logo: a sliced lemon dripping with juice"
        />
      </a>

      <h1 class={'text-xl font-black'}>
        <a href="/">
          <span class={'text-blue-600'}>You</span>
          <span class={'text-500'}>pload</span>
        </a>
      </h1>

      <div class={'grow'}></div>

      {isLoggedIn
        ? (
          <>
            <a href='/account' class='font-bold'>Account</a>
            <a href='/logout' class='font-bold'>Logout</a>
          </>
        )
        : (
          <>
            <a href='/sign-up' class='font-bold'>Sign up</a>
            <a href='/sign-in' class='font-bold'>Sign in</a>
          </>
        )}
    </div>
  );
}
