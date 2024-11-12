import React from 'react'

export const EmptyChat = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[496px] min-h-screen">
    <div className="animate-bounce mb-8">
      <svg
        className="w-24 h-24 text-blue-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    </div>
    <h3 className="text-3xl font-bold text-gray-700 mb-4">Start a Conversation</h3>
    <p className="text-lg text-gray-500 text-center max-w-md px-4">
      Begin your chat journey with a friendly message
    </p>
    <div className="mt-6">
      <span className="inline-block animate-pulse">
        <span className="inline-block animate-bounce mx-1 text-4xl">💬</span>
      </span>
    </div>
  </div>
  
  
  )
}
