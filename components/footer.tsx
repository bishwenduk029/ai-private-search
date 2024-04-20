import React from 'react'
import Link from 'next/link'

const Footer: React.FC = () => {
  return (
    <footer className="flex flex-col items-center justify-center gap-4 py-8 text-center fixed bottom-0 w-full">
      <div className="flex justify-start">
        <div>
          <h2 className="text-2xl font-bold">Credits</h2>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              className="text-sm font-medium hover:underline"
              href="https://github.com/miurla/morphic/tree/main"
            >
              {'Morphic ->'}
            </Link>
            <span className="text-gray-500 dark:text-gray-400 mx-2">•</span>
            <Link
              className="text-sm font-medium hover:underline"
              href="https://github.com/searxng/searxng"
            >
              {'SearxNG ->'}
            </Link>
            <span className="text-gray-500 dark:text-gray-400 mx-2">•</span>
            <Link
              className="text-sm font-medium hover:underline"
              href="https://github.com/bishwenduk029"
            >
              @bishwenduk029
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
