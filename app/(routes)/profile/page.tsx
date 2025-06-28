import { UserProfile } from '@clerk/nextjs'
import React from 'react'

const Profile = () => {
  return (
    <div>
      <UserProfile routing="hash"/>
    </div>
  )
}

export default Profile
