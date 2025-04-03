"use client"

import { getUniversitySuggestions, seedAdditionalData } from "@/app/actions/university-actions"
import { GradeInput } from "@/components/grade-input"
import { UniversityCard } from "@/components/university-card"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

interface University {
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

export default function UniversitySelectionPage() {
  const [grades, setGrades] = useState<{ [subject: string]: string }>({})
  const [suggestions, setSuggestions] = useState<University[]>([])
  const [loading, setLoading] = useState(false)
  const [dataSeeded, setDataSeeded] = useState(false)

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
    // Seed additional data on component mount
    async function seedData() {
      const result = await seedAdditionalData()
      setDataSeeded(result)
    }

    if (!dataSeeded) {
      seedData()
    }
  }, [dataSeeded])

  const handleGradeChange = (subject: string, grade: string) => {
    setGrades((prevGrades) => ({
      ...prevGrades,
      [subject]: grade,
    }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const suggestions = await getUniversitySuggestions(grades)
      setSuggestions(suggestions)
    } catch (error) {
      console.error("Error getting suggestions:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-2">University Selection</h1>
      <p className="text-gray-600 mb-6">Enter your grades to find universities that match your academic profile</p>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-lg font-semibold mb-4">Your Grades</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
          {subjects.map((subject) => (
            <GradeInput key={subject} subject={subject} onChange={handleGradeChange} />
          ))}
        </div>
        <Button
          onClick={handleSubmit}
          disabled={loading || Object.keys(grades).length < 3}
          className="w-full md:w-auto"
        >
          {loading ? "Finding matches..." : "Find Matching Universities"}
        </Button>
        {Object.keys(grades).length < 3 && (
          <p className="text-sm text-red-500 mt-2">Please enter at least 3 subjects</p>
        )}
      </div>

      {suggestions.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Suggested Universities</h2>
          <p className="text-gray-600 mb-6">
            Based on your grades, here are the universities that match your academic profile. Click on "View Courses" to
            see available courses at each university.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suggestions.map((university) => (
              <UniversityCard key={university.id} {...university} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

