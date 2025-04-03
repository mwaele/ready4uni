import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BlockchainVerification } from "@/components/blockchain-verification"

interface UniversityCardProps {
  id: number
  name: string
  cutoff?: number
  previousCutoff?: number
  matchScore?: number
  meetsCutoff?: boolean
  location?: string
  type?: string
  ranking?: number
  established?: number
  website?: string
  description?: string
}

export function UniversityCard({
  id,
  name,
  cutoff,
  previousCutoff,
  matchScore,
  meetsCutoff,
  location,
  type,
  ranking,
  established,
  website,
  description,
}: UniversityCardProps) {
  const cutoffTrend = previousCutoff && cutoff ? previousCutoff - cutoff : 0

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{name}</CardTitle>
            {location && <CardDescription>{location}</CardDescription>}
          </div>
          {type && <Badge variant={type === "Public" ? "default" : "outline"}>{type}</Badge>}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        {description && <p className="text-sm text-gray-600 mb-4">{description}</p>}

        <div className="grid grid-cols-2 gap-2 text-sm">
          {cutoff && (
            <div>
              <span className="font-medium">Cutoff 2024:</span> {cutoff.toFixed(3)}
            </div>
          )}
          {previousCutoff && (
            <div>
              <span className="font-medium">Cutoff 2023:</span> {previousCutoff.toFixed(3)}
            </div>
          )}
          {cutoffTrend !== 0 && (
            <div>
              <span className="font-medium">Trend:</span>{" "}
              <span className={cutoffTrend > 0 ? "text-green-600" : "text-red-600"}>
                {cutoffTrend > 0 ? "↓ " : "↑ "}
                {Math.abs(cutoffTrend).toFixed(3)}
              </span>
            </div>
          )}
          {ranking && (
            <div>
              <span className="font-medium">Ranking:</span> #{ranking}
            </div>
          )}
          {established && (
            <div>
              <span className="font-medium">Est:</span> {established}
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
                className={`h-2.5 rounded-full ${meetsCutoff ? "bg-green-600" : "bg-yellow-500"}`}
                style={{ width: `${Math.min(100, Math.round(matchScore))}%` }}
              ></div>
            </div>
            {meetsCutoff !== undefined && (
              <p className="text-xs mt-1">
                {meetsCutoff
                  ? "Your grades meet the cutoff requirements"
                  : "Your grades are below the cutoff requirements"}
              </p>
            )}
          </div>
        )}

        <div className="mt-4">
          <BlockchainVerification type="university" id={id} />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {website && (
          <Button variant="outline" size="sm" asChild>
            <a href={website} target="_blank" rel="noopener noreferrer">
              Visit Website
            </a>
          </Button>
        )}
        <Button size="sm" asChild>
          <Link href={`/course-selection?university=${id}`}>View Courses</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

