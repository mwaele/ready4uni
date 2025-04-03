"use server"

import { getCourseActor, getAiActor } from "@/lib/icp-agent"
import type { StudentGrades } from "@/lib/icp-config"

// Fallback to Supabase if ICP connection fails
import { createClient } from "@supabase/supabase-js"
const supabaseUrl = process.env.SUPABASE_URL || "https://kslvukrgdsskkcwtpjyr.supabase.co"
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzbHZ1a3JnZHNza2tjd3RwanlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2MjAyOTQsImV4cCI6MjA1OTE5NjI5NH0.MEWvHBNy7ACsy-kLni2x3cYF6fy_-_GPUvwgtxAYsls"
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper functions for the fallback implementation
function convertGradeToPoints(grade: string): number {
  const gradeMap: { [key: string]: number } = {
    A: 12,
    "A-": 11,
    "B+": 10,
    B: 9,
    "B-": 8,
    "C+": 7,
    C: 6,
    "C-": 5,
    "D+": 4,
    D: 3,
    "D-": 2,
    E: 1,
  }

  return gradeMap[grade.toUpperCase()] || 0
}

function subjectMatchesRequirement(subject: string, requirement: string | null): boolean {
  if (!requirement) return false

  const reqUpper = requirement.toUpperCase()
  const subjectUpper = subject.toUpperCase()

  // Direct match
  if (reqUpper === subjectUpper) return true

  // Check for "ANY" conditions
  if (reqUpper.includes("ANY")) {
    // Group matches
    if (reqUpper.includes("GROUP II") && isGroupII(subjectUpper)) return true
    if (reqUpper.includes("GROUP III") && isGroupIII(subjectUpper)) return true
    if (reqUpper.includes("GROUP IV") && isGroupIV(subjectUpper)) return true
    if (reqUpper.includes("GROUP V") && isGroupV(subjectUpper)) return true
  }

  // Check for alternative subjects (e.g., "ENG/KIS")
  if (reqUpper.includes("/")) {
    const alternatives = reqUpper.split("/")
    return alternatives.some((alt) => alt === subjectUpper)
  }

  return false
}

// Subject group classifications
function isGroupII(subject: string): boolean {
  return ["BIOLOGY", "CHEMISTRY", "PHYSICS", "MATHEMATICS"].includes(subject)
}

function isGroupIII(subject: string): boolean {
  return ["HISTORY", "GEOGRAPHY", "CRE", "IRE", "HRE"].includes(subject)
}

function isGroupIV(subject: string): boolean {
  return [
    "HOME SCIENCE",
    "ART AND DESIGN",
    "AGRICULTURE",
    "WOODWORK",
    "METALWORK",
    "BUILDING CONSTRUCTION",
    "POWER MECHANICS",
    "ELECTRICITY",
    "DRAWING AND DESIGN",
    "AVIATION TECHNOLOGY",
  ].includes(subject)
}

function isGroupV(subject: string): boolean {
  return ["FRENCH", "GERMAN", "ARABIC", "MUSIC", "BUSINESS STUDIES", "ECONOMICS"].includes(subject)
}

export async function getCourses(universityId?: number) {
  try {
    // Try to get courses from ICP canister
    const courseActor = getCourseActor()
    const courses = universityId
      ? await courseActor.getCoursesByUniversity(universityId)
      : await courseActor.getAllCourses()
    return courses
  } catch (error) {
    console.error("Error fetching courses from ICP:", error)

    // Fallback to Supabase
    console.log("Falling back to Supabase...")
    let query = supabase.from("courses").select("*, universities(name)").order("name")

    if (universityId) {
      query = query.eq("university_id", universityId)
    }

    const { data, error: supabaseError } = await query

    if (supabaseError) {
      console.error("Error fetching courses from Supabase:", supabaseError)
      return []
    }

    return data
  }
}

export async function getCourseSuggestions(universityId: number, grades: StudentGrades) {
  try {
    // Try to get suggestions from ICP canister using smart contract logic
    const courseActor = getCourseActor()
    const suggestions = await courseActor.getCourseSuggestions(universityId, grades)

    // If AI recommendations are enabled, enhance with AI insights
    try {
      const aiActor = getAiActor()
      const enhancedSuggestions = await aiActor.enhanceCourseSuggestions(suggestions, grades)
      return enhancedSuggestions
    } catch (aiError) {
      console.warn("AI enhancement unavailable:", aiError)
      return suggestions
    }
  } catch (error) {
    console.error("Error getting course suggestions from ICP:", error)

    // Fallback to local implementation
    console.log("Falling back to local implementation...")
    // Fetch courses for the selected university
    const { data: courses, error: coursesError } = await supabase
      .from("courses")
      .select("*")
      .eq("university_id", universityId)

    if (coursesError) {
      console.error("Error fetching courses:", coursesError)
      return []
    }

    // Convert student grades to a more usable format
    const studentSubjects = Object.entries(grades).map(([subject, grade]) => ({
      name: subject.toUpperCase(),
      grade: grade.toUpperCase(),
      points: convertGradeToPoints(grade),
    }))

    // Match courses with student profile
    const suggestions = courses
      .map((course) => {
        // Check subject requirements
        const requirements = [course.subject1, course.subject2, course.subject3, course.subject4].filter(Boolean)

        let matchCount = 0
        let totalPoints = 0
        const matchedSubjects: string[] = []

        // For each requirement, find the best matching subject
        for (const requirement of requirements) {
          let bestMatch = null
          let bestPoints = 0

          for (const subject of studentSubjects) {
            if (subjectMatchesRequirement(subject.name, requirement) && subject.points > bestPoints) {
              bestMatch = subject
              bestPoints = subject.points
            }
          }

          if (bestMatch) {
            matchCount++
            totalPoints += bestPoints
            matchedSubjects.push(bestMatch.name)
          }
        }

        // Calculate match percentage
        const matchPercentage = requirements.length > 0 ? (matchCount / requirements.length) * 100 : 0

        // Calculate average points for matched subjects
        const averagePoints = matchCount > 0 ? totalPoints / matchCount : 0

        // Final score combines match percentage and average points
        const matchScore = matchPercentage * 0.6 + averagePoints * 5

        return {
          id: course.id,
          name: course.name,
          cluster: course.cluster,
          matchScore,
          matchPercentage,
          averagePoints,
          matchedSubjects,
        }
      })
      .filter((course) => course.matchScore > 40) // Only courses with decent match
      .sort((a, b) => b.matchScore - a.matchScore)

    return suggestions
  }
}

export async function getCourseById(id: number) {
  try {
    // Try to get course from ICP canister
    const courseActor = getCourseActor()
    const course = await courseActor.getCourseById(id)
    return course
  } catch (error) {
    console.error("Error fetching course from ICP:", error)

    // Fallback to Supabase
    console.log("Falling back to Supabase...")
    const { data, error: supabaseError } = await supabase
      .from("courses")
      .select("*, universities(name)")
      .eq("id", id)
      .single()

    if (supabaseError) {
      console.error("Error fetching course from Supabase:", supabaseError)
      return null
    }

    return data
  }
}

