import Link from 'next/link'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <>

      <nav className='header'>
        <div className='container flex justify-between px-6 py-6 mx-auto py lg:px-0'>
          {/* left header  */}
          <div className='flex items-center space-x-4'>
            <Link href='/'>
              <a className='text-2xl font-bold text-teal-800'>Andre{"'"}s Kitchen</a>
            </Link>
          </div>
          {/* right header */}
        </div>
      </nav>
      <main>
        <Component {...pageProps} />
      </main>
    </>
  )

}

export default MyApp
