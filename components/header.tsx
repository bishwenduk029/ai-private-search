'use client'

import React from 'react'
import Link from 'next/link'
import { ModeToggle } from './mode-toggle'
import { CircleIcon } from 'lucide-react'

export const Header: React.FC = () => {
  return (
    <header className="fixed w-full p-0 md:p-2 flex justify-between items-center z-10 backdrop-blur md:backdrop-blur-none bg-background/80 md:bg-transparent">
      <div className="p-2">
        <Link className="flex items-center" href="#">
          <CircleIcon className="h-6 w-6" />
          <span className="ml-2 text-lg font-semibold">Just Ask</span>
        </Link>
      </div>
      <ModeToggle />
    </header>
  )
}

export default Header
