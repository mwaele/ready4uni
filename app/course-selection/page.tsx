"use client"

import { getCourseSuggestions } from "@/app/actions/course-actions"
import { getUniversities, getUniversityById } from "@/app/actions/university-actions"
import { CourseCard } from "@/components/course-card"
import { GradeInput } from "@/components/grade-input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

interface University {
  id: number
  name: string
  cutoff_2024?: number
  cutoff_2023?: number
  location?: string
  type?: string
  ranking?: number
  established?: number
  website?: string
  description?: string
}

interface Course {
  id: number
  name: string
  cluster?: string
  matchScore?: number
  matchPercentage?: number
  averagePoints?: number
  matchedSubjects?: string[]
  duration?: string
  career_prospects?: string
  description?: string
  universities?: { name: string }
}

export default function CourseSelectionPage() {
  const searchParams = useSearchParams()
  const initialUniversityId = searchParams.get("university")

  const [universities, setUniversities] = useState<University[]>([])
  const [selectedUniversity, setSelectedUniversity] = useState<number | null>(
    initialUniversityId ? Number(initialUniversityId) : null,
  )
  const [universityDetails, setUniversityDetails] = useState<University | null>(null)
  const [grades, setGrades] = useState<{ [subject: string]: string }>({})
  const [suggestions, setSuggestions] = useState<Course[]>([])
  const [loading, setLoading] = useState(false)

  const subjects = [
    "English",
    "Kiswahili",
    "Mathematics",
    "Biology",
    "Chemistry",
    "Physics",
    "History",
    "Geography",
    "CRE",
    "Business Studies",
    "Agriculture",
  ]

  useEffect(() => {
    async function fetchUniversities() {
      const data = await getUniversities()
      setUniversities(data)
    }
    fetchUniversities()
  }, [])

  useEffect(() => {
    async function fetchUniversityDetails() {
      if (selectedUniversity) {
        const data = await getUniversityById(selectedUniversity)
        setUniversityDetails(data)
      } else {
        setUniversityDetails(null)
      }
    }
    fetchUniversityDetails()
  }, [selectedUniversity])

  const handleGradeChange = (subject: string, grade: string) => {
    setGrades((prevGrades) => ({
      ...prevGrades,
      [subject]: grade,
    }))
  }

  const handleSubmit = async () => {
    if (!selectedUniversity) return

    setLoading(true)
    try {
      const suggestions = await getCourseSuggestions(selectedUniversity, grades)
      setSuggestions(suggestions)
    } catch (error) {
      console.error("Error getting suggestions:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-2">Course Selection</h1>
      <p className="text-gray-600 mb-6">
        Select a university and enter your grades to find courses that match your academic profile
      </p>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Select University</label>
          <Select
            value={selectedUniversity?.toString()}
            onValueChange={(value) => setSelectedUniversity(Number(value))}
          >
            <SelectTrigger className="w-full max-w-md">
              <SelectValue placeholder="Select a university" />
            </SelectTrigger>
            <SelectContent>
              {universities.map((university) => (
                <SelectItem key={university.id} value={university.id.toString()}>
                  {university.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {universityDetails && (
          <div className="mb-6 p-4 bg-gray-50 rounded-md">
            <h3 className="font-semibold">{universityDetails.name}</h3>
            {universityDetails.location && <p className="text-sm text-gray-600">{universityDetails.location}</p>}
            {universityDetails.cutoff_2024 && (
              <p className="text-sm mt-2">
                <span className="font-medium">Cutoff Points (2024):</span> {universityDetails.cutoff_2024.toFixed(3)}
              </p>
            )}
          </div>
        )}

        <h2 className="text-lg font-semibold mb-4">Your Grades</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
          {subjects.map((subject) => (
            <GradeInput key={subject} subject={subject} onChange={handleGradeChange} />
          ))}
        </div>

        <Button
          onClick={handleSubmit}
          disabled={loading || !selectedUniversity || Object.keys(grades).length < 3}
          className="w-full md:w-auto"
        >
          {loading ? "Finding matches..." : "Find Matching Courses"}
        </Button>

        {!selectedUniversity && <p className="text-sm text-red-500 mt-2">Please select a university</p>}
        {Object.keys(grades).length < 3 && (
          <p className="text-sm text-red-500 mt-2">Please enter at least 3 subjects</p>
        )}
      </div>

      {suggestions.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Suggested Courses</h2>
          <p className="text-gray-600 mb-6">
            Based on your grades, here are the courses at {universityDetails?.name} that match your academic profile.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suggestions.map((course) => (
              <CourseCard
                key={course.id}
                {...course}
                universityName={universityDetails?.name}
                careerProspects={course.career_prospects}
              />
            ))}
          </div>
        </div>
      )}

      {suggestions.length === 0 && !loading && selectedUniversity && Object.keys(grades).length >= 3 && (
        <div className="mt-8 text-center p-8 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">No Matching Courses Found</h3>
          <p className="text-gray-600">Try adjusting your grades or selecting a different university.</p>
        </div>
      )}
    </div>
  )
}

