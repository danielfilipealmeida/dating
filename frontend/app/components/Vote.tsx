import React, { useState } from 'react'
import { vote } from '../actions' 


//import { useMutation } from '@apollo/client'
//import gql from 'graphql-tag'

/*
const VOTE_MUTATION = gql`
  mutation Vote($voterId: ID!, $votedForId: ID!, $like: Boolean!) {
    vote(votedId: $voterId, votedForId: $votedForId, like: $like) {
      id
      voterId
      votedForId
      like
    }
  }
`
*/

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
        style={{ backgroundColor: 'green', color: 'white' }}
      >
        Thumbs Up
      </button>
      <button
        onClick={handleDislike}
        style={{ backgroundColor: 'red', color: 'white' }}
      >
        Thumbs Down
      </button>
    </div>
  )
}
