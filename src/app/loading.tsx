import React from 'react'

const loading = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading ResilienceOS+...</p>
        </div>
      </div>
  )
}

export default loading