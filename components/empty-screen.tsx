import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

const exampleMessages = [
  {
    heading: 'Why is Nvidia growing rapidly?',
    message: 'Why is Nvidia growing rapidly?'
  },
  {
    heading: 'Is the Apple Vision Pro worth buying?',
    message: 'Is the Apple Vision Pro worth buying?'
  },
  {
    heading: 'How does the Vercel AI SDK work?',
    message: 'How does the Vercel AI SDK work?'
  },
  {
    heading: 'Tesla vs Rivian',
    message: 'Tesla vs Rivian'
  }
]
export function EmptyScreen({
  submitMessage,
  className
}: {
  submitMessage: (message: string) => void
  className?: string
}) {
  return (
    <div
      className={`mx-auto w-full transition-all mt-2 rounded-lg shadow-2xl ${className}`}
    >
      <div className="bg-white p-2">
        <div className="mt-4 flex flex-col items-start rounded-lg space-y-2 mb-4">
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant="link"
              className="h-auto p-0 text-base text-orange-500"
              name={message.message}
              onClick={async () => {
                submitMessage(message.message)
              }}
            >
              <ArrowRight size={16} className="mr-2 text-background" />
              {message.heading}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
