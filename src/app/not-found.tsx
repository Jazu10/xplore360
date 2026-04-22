import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-white">
      <span className="font-serif text-[120px] text-beige-dark leading-none font-semibold">404</span>
      <h1 className="font-serif text-3xl text-obsidian -mt-4 mb-4">Page Not Found</h1>
      <p className="text-obsidian/50 text-lg mb-10 max-w-md">
        The page you&apos;re looking for seems to have wandered off the map. Let us guide you home.
      </p>
      <Link href="/" className="btn-luxury">
        <span>Return Home</span>
      </Link>
    </div>
  )
}
