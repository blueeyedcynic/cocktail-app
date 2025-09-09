import './globals.css'

export const metadata = {
  title: 'Virtual Cocktail Crafter',
  description: 'Discover cocktails based on what you have on hand',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}