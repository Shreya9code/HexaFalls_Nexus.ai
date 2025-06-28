'use client'

import { SignIn } from '@clerk/nextjs'

export default function Page() {
    return (
        <div className="flex h-screen">
            {/* Left Side - Larger Image */}
            <img
                src="/image.png"
                //https://www.freepik.com/free-photos-vectors/laptop-table
                alt="Banner"
                className="hidden md:block w-2/3 h-screen object-cover"
            />

            {/* Right Side - Smaller SignIn Form */}
            <div className="w-full md:w-1/3 flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full p-6">
                    <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Welcome to Nexus.ai 👋</h2>
                    <SignIn />
                </div>
            </div>
        </div>
    )
}
