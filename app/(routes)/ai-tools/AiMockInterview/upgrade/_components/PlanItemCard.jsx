// Setting up the upgrade section
"use client"
import { useUser } from '@clerk/nextjs'
import React from 'react'

function PlanItemCard({plan}) {
  const {user}=useUser();
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm sm:px-8 lg:p-12 bg-white dark:bg-gray-900">
    <div className="text-center">

      <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
        {plan.name}
        <span className="sr-only">Plan</span>
      </h2>

      <p className="mt-2 sm:mt-4">
        <strong className="text-3xl font-bold text-gray-900 dark:text-gray-100 sm:text-4xl"> {plan.cost}$ </strong>

        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">/month</span>
      </p>
    </div>

    <ul className="mt-6 space-y-2">
        {plan.offering.map((item,index)=>(
             <li key={index} className="flex items-center gap-1 mb-2">
                <h2 className="text-gray-700 dark:text-gray-300">{item.value}</h2>
             </li>
        ))}
     

  
    </ul>

    {plan.cost > 0 ? (
      <a
        href={plan.paymentLink+'?prefilled_email='+user?.primaryEmailAddress.emailAddress}
        target='_blank'
        className="mt-8 block rounded-full border border-border bg-background px-12 py-3 text-center text-sm font-medium text-foreground hover:ring-1 hover:ring-border focus:outline-none focus:ring active:text-foreground"
      >
        Get Started
      </a>
    ) : (
      <div className="mt-8 text-center text-sm font-medium text-green-600 dark:text-green-400">
        You are on the free plan!
      </div>
    )}
  </div>
  )
}

export default PlanItemCard