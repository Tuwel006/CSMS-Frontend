import MatchSliderWrapper from '@/components/ui/CurrentMatch/MatchSLiderWrapper'

const LandingPage = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-blue-600 text-white p-2 sm:p-3 text-center text-lg sm:text-xl font-bold">
        Live Cricket Scores
      </header>

      <main className="container mx-auto mt-2 sm:mt-4 px-2">
        <MatchSliderWrapper />
      </main>

      <footer className="bg-gray-200 text-center p-2 sm:p-3 mt-4 sm:mt-6 text-xs sm:text-sm">
        &copy; 2025 Cricket App
      </footer>
    </div>
  )
}

export default LandingPage