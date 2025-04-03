import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BlockchainVerification } from "@/components/blockchain-verification"

interface CourseCardProps {
  id: number
  name: string
  cluster?: string
  matchScore?: number
  matchPercentage?: number
  averagePoints?: number
  matchedSubjects?: string[]
  duration?: string
  careerProspects?: string
  description?: string
  universityName?: string
}

export function CourseCard({
  id,
  name,
  cluster,
  matchScore,
  matchPercentage,
  averagePoints,
  matchedSubjects,
  duration,
  careerProspects,
  description,
  universityName,
}: CourseCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{name}</CardTitle>
            {universityName && <CardDescription>{universityName}</CardDescription>}
          </div>
          {cluster && <Badge variant="outline">Cluster {cluster}</Badge>}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        {description && <p className="text-sm text-gray-600 mb-4">{description}</p>}

        <div className="grid grid-cols-2 gap-2 text-sm mb-4">
          {duration && (
            <div>
              <span className="font-medium">Duration:</span> {duration}
            </div>
          )}
          {careerProspects && (
            <div className="col-span-2">
              <span className="font-medium">Career Prospects:</span> {careerProspects}
            </div>
          )}
        </div>

        {matchScore !== undefined && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">Match Score:</span>
              <span className="text-sm font-medium">{Math.round(matchScore)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${matchScore > 70 ? "bg-green-600" : matchScore > 50 ? "bg-yellow-500" : "bg-red-500"}`}
                style={{ width: `${Math.min(100, Math.round(matchScore))}%` }}
              ></div>
            </div>

            {matchPercentage !== undefined && (
              <p className="text-xs mt-2">
                <span className="font-medium">Subject Match:</span> {Math.round(matchPercentage)}%
              </p>
            )}

            {averagePoints !== undefined && (
              <p className="text-xs">
                <span className="font-medium">Average Grade Points:</span> {averagePoints.toFixed(1)}
              </p>
            )}

            {matchedSubjects && matchedSubjects.length > 0 && (
              <div className="mt-2">
                <p className="text-xs font-medium">Matched Subjects:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {matchedSubjects.map((subject, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {subject}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-4">
          <BlockchainVerification type="course" id={id} />
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-gray-500">
          {cluster && `This course belongs to cluster ${cluster}, which determines the specific subject requirements.`}
        </p>
      </CardFooter>
    </Card>
  )
}

