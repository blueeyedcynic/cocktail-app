import './globals.css'

export const metadata = {
  title: 'Cocktail Discovery App',
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