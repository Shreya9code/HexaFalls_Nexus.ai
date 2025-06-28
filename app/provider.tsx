"use client"
//import { AuthContext } from '@/context/AuthContext';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { createContext } from 'react'

// Theme context
type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

function Provider({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { user } = useUser();
    const [theme, setTheme] = useState<Theme>('light')

    useEffect(() => {
        // Get theme from localStorage or default to light
        const savedTheme = localStorage.getItem('theme') as Theme
        if (savedTheme) {
            setTheme(savedTheme)
            document.documentElement.classList.toggle('dark', savedTheme === 'dark')
        }
    }, [])

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light'
        setTheme(newTheme)
        localStorage.setItem('theme', newTheme)
        document.documentElement.classList.toggle('dark', newTheme === 'dark')
    }

    useEffect(() => {
        if (user && user.primaryEmailAddress?.emailAddress) {
            createNewUser();
        }
    }, [user]);

    const createNewUser = async () => {
        if (!user || !user.primaryEmailAddress?.emailAddress) {
            console.log('User not ready yet or missing email');
            return;
        }
        
        try {
            console.log('Attempting to create user with email:', user.primaryEmailAddress.emailAddress);
            const result = await axios.post('/api/user', {});
            console.log('User created:', result.data);
        } catch (error: any) {
            console.error('Error creating user:', error);
            if (error.response) {
                console.error('Response status:', error.response.status);
                console.error('Response data:', error.response.data);
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Error setting up request:', error.message);
            }
        }
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <div className={theme}>
                {children}
            </div>
        </ThemeContext.Provider>
    )
}

// Custom hook to use auth
/*export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};*/

export default Provider

