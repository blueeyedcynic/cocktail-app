export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Tailwind Test</h1>
        
        <div className="bg-red-500 p-4 mb-4">
          <p className="text-white">This should have RED background</p>
        </div>
        
        <div className="bg-blue-500 p-4 mb-4">
          <p className="text-yellow-400">This should have BLUE background with YELLOW text</p>
        </div>
        
        <div className="bg-green-500 p-4 mb-4">
          <p className="text-black">This should have GREEN background with BLACK text</p>
        </div>
        
        <button className="bg-white text-black px-6 py-3 hover:bg-gray-200 transition-colors">
          This should be a WHITE button with BLACK text
        </button>
      </div>
    </div>
  )
}