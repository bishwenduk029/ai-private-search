/**
 * v0 by Vercel.
 * @see https://v0.dev/t/Jr1eYlhZ12w
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Button } from '@/components/ui/button'
import { Input } from './ui/input'

export default function SearchBox() {
  return (
    <div className="flex items-center justify-center p-6 bg-[#ffefeb] min-h-[200px] z-10">
      <div className="flex items-center space-x-4 bg-white rounded-lg shadow-lg p-3 w-full md:w-[80%] max-w-screen-md mx-auto shadow-orange-light">
        <MicroscopeIcon className="text-red-500" />
        <Input
          className="flex-1 border-none outline-none bg-transparent min-w-[200px]"
          placeholder="How to graphic design"
          type="text"
        />
        <Button className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow-md">
          Search
        </Button>
      </div>
    </div>
  )
}

function MicroscopeIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 18h8" />
      <path d="M3 22h18" />
      <path d="M14 22a7 7 0 1 0 0-14h-1" />
      <path d="M9 14h2" />
      <path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z" />
      <path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" />
    </svg>
  )
}
