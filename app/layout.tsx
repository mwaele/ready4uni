import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Kenyan University & Course Selection",
  description: "Find the perfect university and course based on your high school grades",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <header className="bg-white border-b border-gray-200">
            <div className="container mx-auto py-4 px-4 flex justify-between items-center">
              <a href="/" className="text-xl font-bold text-blue-900">
                University Selector
              </a>
              <nav>
                <ul className="flex space-x-6">
                  <li>
                    <a href="/" className="text-gray-600 hover:text-blue-600">
                      Home
                    </a>
                  </li>
                  <li>
                    <a href="/university-selection" className="text-gray-600 hover:text-blue-600">
                      Universities
                    </a>
                  </li>
                  <li>
                    <a href="/course-selection" className="text-gray-600 hover:text-blue-600">
                      Courses
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </header>
          <main>{children}</main>
          <footer className="bg-gray-100 border-t border-gray-200 mt-10">
            <div className="container mx-auto py-6 px-4 text-center text-gray-600">
              <p>© {new Date().getFullYear()} University & Course Selection Assistant</p>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  )
}

