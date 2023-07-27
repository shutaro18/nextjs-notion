import React, { ReactNode } from 'react'
import Navbar from './Navbar/Navbar'

type LayoutProps = { children: ReactNode; };

const Layout = ({children}: LayoutProps) => {
  return (
    <div>
        <Navbar />
        {children}
    </div>
  )
}

export default Layout
