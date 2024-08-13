import { QuilttProvider } from '@quiltt/react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
	title: 'Quiltt Next.js Template',
	description: 'A template for using Quiltt with Next.js',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body className={inter.variable} suppressHydrationWarning>
				<QuilttProvider>{children}</QuilttProvider>
			</body>
		</html>
	)
}
