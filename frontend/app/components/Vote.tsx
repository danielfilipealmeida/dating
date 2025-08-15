import React, { useState } from 'react'
import { vote } from '../actions' 
import { CheckIcon, NoSymbolIcon } from '@heroicons/react/24/solid'


interface VoteProps {
  votingUserId: string
  votedUserId: string
}

export default function Vote({ votingUserId, votedUserId }: VoteProps) {
  const handleLike = async () => {
    
    try {
      await vote(votingUserId, votedUserId, true);
      alert('Vote successful!')
    } catch (error) {
      console.error('Error liking:', error)
      alert('Failed to like.')
    }
  }

  const handleDislike = async () => {
    try {
      await vote(votingUserId, votedUserId, true);
      alert('Vote successful!')
    } catch (error) {
      console.error('Error disliking:', error)
      alert('Failed to dislike.')
    }
  }

  return (
    <div>
      <button
        onClick={handleLike}
        className='bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600'
      >
        <CheckIcon className="h-5 w-5 inline-block mr-2" />
        Like!
      </button>
      <button
        onClick={handleDislike}
        className='bg-red-500 text-white px-4 py-2 rounded ml-4 shadow hover:bg-red-600'
      >
        <NoSymbolIcon className="h-5 w-5 inline-block mr-2" />
        Pass!
      </button>
    </div>
  )
}
