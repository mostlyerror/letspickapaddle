export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Find Your Perfect Pickleball Paddle
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Take our quick quiz and get personalized paddle recommendations based on your play style
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/quiz"
              className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              Start Quiz
            </a>
            <a
              href="/paddles"
              className="px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-lg hover:bg-gray-50 transition-colors border-2 border-blue-600"
            >
              Browse All Paddles
            </a>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-blue-600 text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-2">Personalized Matches</h3>
            <p className="text-gray-600">
              Our algorithm analyzes your skill level, play style, and preferences to find your ideal paddle
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-blue-600 text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-2">Quick & Easy</h3>
            <p className="text-gray-600">
              Answer 8 simple questions in under 2 minutes and get instant recommendations
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-blue-600 text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-semibold mb-2">Expert Curated</h3>
            <p className="text-gray-600">
              Choose from 20+ top-rated paddles from trusted brands like Selkirk, JOOLA, and Engage
            </p>
          </div>
        </div>

        <div className="bg-blue-600 text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Match?</h2>
          <p className="text-xl mb-6">Join thousands of players who found their perfect paddle</p>
          <a
            href="/quiz"
            className="inline-block px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Take the Quiz Now
          </a>
        </div>
      </div>
    </div>
  );
}
