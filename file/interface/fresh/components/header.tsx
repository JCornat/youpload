export default function Header({ isLoggedIn, hideLogo }: { isLoggedIn?: boolean; hideLogo?: boolean }) {
  return (
    <div class='flex items-center mb-4'>
      {!hideLogo && (
        <>
          <a href='/'>
            <img
              src='/logo.svg'
              width='48'
              height='48'
              alt='the Fresh logo: a sliced lemon dripping with juice'
            />
          </a>

          <h1 class={'ml-2 text-xl font-black'}>
            <a href='/'>
              <span class={'text-yellow-400'}>You</span>
              <span class={'text-slate-500'}>pload</span>
            </a>
          </h1>
        </>
      )}

      <div class={'grow'}></div>

      {isLoggedIn
        ? (
          <>
            <a href='/account' class='font-bold mr-4'>Account</a>
            <a href='/logout' class='font-bold'>Logout</a>
          </>
        )
        : (
          <>
            <a href='/sign-up' class='font-bold mr-4'>Sign up</a>
            <a href='/sign-in' class='font-bold'>Sign in</a>
          </>
        )}
    </div>
  );
}
