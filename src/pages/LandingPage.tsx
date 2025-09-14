import MatchSliderWrapper from '@/components/ui/CurrentMatch/MatchSLiderWrapper'

const LandingPage = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-blue-600 text-white p-4 text-center text-2xl font-bold">
        Live Cricket Scores
      </header>

      <main className="container mx-auto mt-5">
        <MatchSliderWrapper />
      </main>

      <footer className="bg-gray-200 text-center p-4 mt-10">
        &copy; 2025 Cricket App
      </footer>
    </div>
  )
}

export default LandingPage