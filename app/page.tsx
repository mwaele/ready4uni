import { Button } from "@/components/ui/button"
import { IcpInfoSection } from "@/components/icp-info-section"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center py-20 px-4 bg-gradient-to-b from-blue-50 to-white">
        <div className="text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-blue-900">
            Kenyan University & Course Selection Assistant
          </h1>
          <p className="text-lg mb-8 text-gray-700">
            Find the perfect university and course based on your high school grades. Our intelligent matching system
            helps you discover the best options for your academic future.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/university-selection">Find Universities</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
              <Link href="/course-selection">Find Courses</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ICP Information Section */}
      <IcpInfoSection />

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-900">How It Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3 text-blue-800">Enter Your Grades</h3>
              <p className="text-gray-600">
                Input your high school grades for different subjects to get personalized recommendations. Our system
                considers your strengths and academic performance.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3 text-blue-800">Get University Matches</h3>
              <p className="text-gray-600">
                Our advanced ICP algorithm matches your grades with university requirements and cutoff points. We
                consider trends and subject clusters for optimal recommendations.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3 text-blue-800">Explore Course Options</h3>
              <p className="text-gray-600">
                Discover courses that align with your academic strengths and interests. Get detailed information about
                each course including career prospects.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-900">Why Use Our Platform</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-blue-800">Accurate Matching</h3>
                <p className="text-gray-600">
                  Our algorithm considers cutoff points, subject clusters, and grade requirements to provide accurate
                  university and course matches.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-blue-800">Fast Results</h3>
                <p className="text-gray-600">
                  Get instant recommendations based on your grades, saving you time and effort in researching
                  universities and courses.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-blue-800">Comprehensive Information</h3>
                <p className="text-gray-600">
                  Access detailed information about universities and courses, including cutoff points, duration, and
                  career prospects.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-blue-800">Blockchain Verification</h3>
                <p className="text-gray-600">
                  All university and course data is verified on the Internet Computer blockchain, ensuring transparency
                  and immutability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect University?</h2>
          <p className="text-lg mb-8 opacity-90">
            Start your academic journey today by entering your grades and discovering the best universities and courses
            for your future.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/university-selection">Get Started Now</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

