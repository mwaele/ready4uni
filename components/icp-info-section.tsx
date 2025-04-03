import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function IcpInfoSection() {
  return (
    <section className="py-16 px-4 bg-gradient-to-b from-purple-50 to-white">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-purple-900">Powered by Internet Computer Protocol</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="border-purple-100">
            <CardHeader>
              <CardTitle className="text-xl text-purple-800">Smart Contracts</CardTitle>
              <CardDescription>Secure and transparent matching</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Our platform uses canister smart contracts on ICP to store and process cluster weights, cutoff points,
                and student results. This ensures tamper-proof and transparent university and course recommendations.
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-100">
            <CardHeader>
              <CardTitle className="text-xl text-purple-800">Decentralized Web App</CardTitle>
              <CardDescription>No central point of failure</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Our application is hosted fully on-chain using ICP's decentralized storage and computing. This means
                high availability, censorship resistance, and no reliance on centralized servers.
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-100">
            <CardHeader>
              <CardTitle className="text-xl text-purple-800">AI Recommendations</CardTitle>
              <CardDescription>Personalized suggestions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Using on-chain AI models, our platform analyzes trends, student preferences, and historical data to
                suggest personalized degree options that help students choose future-proof careers.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

