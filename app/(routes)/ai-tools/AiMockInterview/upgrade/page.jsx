// Defining the upgrade function
import React from 'react'

import planData from '@/utils/planData'
import PlanItemCard from './_components/PlanItemCard'

function Upgrade() {
    return (
        <div className='flex flex-col min-h-[calc(100vh-165px)] p-10'>
            <h2 className='font-bold text-3xl text-center text-foreground'>Upgrade</h2>
            <h2 className='text-center text-gray-500 dark:text-gray-300'>Upgrade to monthly plan to access unlimited mock interview</h2>

            <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-center md:gap-8">

                {planData.map((plan,index)=>(
                     <PlanItemCard plan={plan} key={index} />
                ))}
                   


                </div>
            </div>
        </div>
    )
}

export default Upgrade