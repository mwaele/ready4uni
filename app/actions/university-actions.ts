"use server"

import { createClient } from "@supabase/supabase-js"

// Create a single supabase client for server-side
const supabaseUrl = process.env.SUPABASE_URL || "https://kslvukrgdsskkcwtpjyr.supabase.co"
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzbHZ1a3JnZHNza2tjd3RwanlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2MjAyOTQsImV4cCI6MjA1OTE5NjI5NH0.MEWvHBNy7ACsy-kLni2x3cYF6fy_-_GPUvwgtxAYsls"

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function getUniversities() {
  const { data, error } = await supabase.from("universities").select("*").order("name")

  if (error) {
    console.error("Error fetching universities:", error)
    return []
  }

  return data
}

// Enhanced grade conversion with weighted subjects
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

// Calculate weighted mean based on subject importance
function calculateWeightedMean(grades: { [subject: string]: string }): number {
  const weights: { [subject: string]: number } = {
    ENGLISH: 2,
    KISWAHILI: 2,
    MATHEMATICS: 2,
    BIOLOGY: 1.5,
    CHEMISTRY: 1.5,
    PHYSICS: 1.5,
    HISTORY: 1,
    GEOGRAPHY: 1,
    CRE: 1,
    "BUSINESS STUDIES": 1,
    AGRICULTURE: 1,
  }

  let totalPoints = 0
  let totalWeight = 0

  for (const [subject, grade] of Object.entries(grades)) {
    const subjectUpper = subject.toUpperCase()
    const weight = weights[subjectUpper] || 1
    const points = convertGradeToPoints(grade)

    totalPoints += points * weight
    totalWeight += weight
  }

  return totalWeight > 0 ? totalPoints / totalWeight : 0
}

// Calculate cluster points for specific subject combinations
function calculateClusterPoints(grades: { [subject: string]: string }, cluster: string): number {
  // Define cluster subject combinations
  const clusters: { [key: string]: string[] } = {
    "1A": ["MATHEMATICS", "ENGLISH", "KISWAHILI"],
    "2A": ["MATHEMATICS", "PHYSICS", "CHEMISTRY"],
    "3A": ["BIOLOGY", "CHEMISTRY", "MATHEMATICS"],
    "4A": ["HISTORY", "GEOGRAPHY", "CRE"],
    "5A": ["ENGLISH", "LITERATURE", "KISWAHILI"],
    "6A": ["MATHEMATICS", "BUSINESS STUDIES", "ECONOMICS"],
    "7A": ["MATHEMATICS", "PHYSICS", "GEOGRAPHY"],
    "8A": ["MATHEMATICS", "CHEMISTRY", "BIOLOGY"],
    "9A": ["MATHEMATICS", "PHYSICS", "CHEMISTRY"],
  }

  const clusterSubjects = clusters[cluster] || []

  if (clusterSubjects.length === 0) {
    return 0
  }

  let totalPoints = 0
  let subjectsFound = 0

  for (const subject of clusterSubjects) {
    for (const [studentSubject, grade] of Object.entries(grades)) {
      if (studentSubject.toUpperCase() === subject) {
        totalPoints += convertGradeToPoints(grade)
        subjectsFound++
        break
      }
    }
  }

  // If not all subjects in the cluster are found, penalize the score
  const completionFactor = subjectsFound / clusterSubjects.length
  return totalPoints * completionFactor
}

export async function getUniversitySuggestions(grades: { [subject: string]: string }) {
  // Fetch all universities with more details
  const { data: universities, error } = await supabase.from("universities").select("*")

  if (error) {
    console.error("Error fetching universities:", error)
    return []
  }

  // Calculate the student's weighted mean grade
  const weightedMean = calculateWeightedMean(grades)

  // Fetch all courses to check cluster matches
  const { data: courses, error: coursesError } = await supabase.from("courses").select("university_id, cluster")

  if (coursesError) {
    console.error("Error fetching courses:", coursesError)
  }

  // Group courses by university to find the best cluster match for each university
  const universityClusters: { [key: number]: string[] } = {}
  courses?.forEach((course) => {
    if (!universityClusters[course.university_id]) {
      universityClusters[course.university_id] = []
    }
    if (course.cluster && !universityClusters[course.university_id].includes(course.cluster)) {
      universityClusters[course.university_id].push(course.cluster)
    }
  })

  // Enhanced ICP algorithm with multiple factors
  const suggestions = universities
    .map((university) => {
      // Calculate base match score using cutoff points
      const cutoffDifference = weightedMean - (university.cutoff_2024 || 0)

      // Calculate best cluster match for this university
      let bestClusterScore = 0
      const clusters = universityClusters[university.id] || []

      for (const cluster of clusters) {
        const clusterScore = calculateClusterPoints(grades, cluster)
        if (clusterScore > bestClusterScore) {
          bestClusterScore = clusterScore
        }
      }

      // Calculate final match score (higher is better)
      // Factors: cutoff difference (positive is good), cluster match, trend from previous year
      const cutoffTrend = (university.cutoff_2023 || 0) - (university.cutoff_2024 || 0)
      const trendFactor = cutoffTrend > 0 ? 1 + cutoffTrend / 10 : 1 - Math.abs(cutoffTrend) / 20

      let matchScore = 0
      if (cutoffDifference >= 0) {
        // Student meets or exceeds cutoff
        matchScore = 100 + cutoffDifference + bestClusterScore / 2 + cutoffTrend * 2
      } else {
        // Student below cutoff
        matchScore = Math.max(0, 50 + cutoffDifference * 5 + bestClusterScore / 2)
      }

      // Apply trend factor
      matchScore *= trendFactor

      return {
        id: university.id,
        name: university.name,
        cutoff: university.cutoff_2024,
        previousCutoff: university.cutoff_2023,
        matchScore: matchScore,
        meetsCutoff: cutoffDifference >= 0,
      }
    })
    .filter((uni) => uni.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 10)

  return suggestions
}

export async function getUniversityById(id: number) {
  const { data, error } = await supabase.from("universities").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching university:", error)
    return null
  }

  return data
}

export async function seedAdditionalData() {
  // First, check if universities already exist to avoid duplicates
  const { data: existingUniversities } = await supabase.from("universities").select("name")

  const existingNames = new Set(existingUniversities?.map((uni) => uni.name) || [])

  // Filter out universities that already exist
  const newUniversities = [
    {
      name: "University of Nairobi",
      cutoff_2024: 28.976,
      cutoff_2023: 30.562,
    },
    {
      name: "Kenyatta University",
      cutoff_2024: 27.312,
      cutoff_2023: 29.245,
    },
    {
      name: "Strathmore University",
      cutoff_2024: 30.125,
      cutoff_2023: 31.45,
    },
    {
      name: "Moi University",
      cutoff_2024: 25.876,
      cutoff_2023: 27.123,
    },
    {
      name: "Jomo Kenyatta University",
      cutoff_2024: 26.543,
      cutoff_2023: 28.765,
    },
  ].filter((uni) => !existingNames.has(uni.name))

  // Only insert if there are new universities to add
  if (newUniversities.length > 0) {
    const { error: uniError } = await supabase.from("universities").insert(newUniversities)

    if (uniError) {
      console.error("Error seeding universities:", uniError)
      return false
    }
  }

  // Get university IDs for reference
  const { data: universities } = await supabase.from("universities").select("id, name")

  if (!universities) {
    console.error("Error fetching universities")
    return false
  }

  // Create a map of university names to IDs
  const universityMap: { [key: string]: number } = {}
  universities.forEach((uni) => {
    universityMap[uni.name] = uni.id
  })

  // Check for existing courses to avoid duplicates
  const { data: existingCourses } = await supabase.from("courses").select("name, university_id")

  const existingCourseKeys = new Set(existingCourses?.map((course) => `${course.name}-${course.university_id}`) || [])

  // Filter out courses that already exist
  const newCourses = [
    {
      name: "Bachelor of Medicine and Surgery",
      university_id: universityMap["University of Nairobi"],
      cluster: "3A",
      subject1: "BIOLOGY",
      subject2: "CHEMISTRY",
      subject3: "MATHEMATICS",
      subject4: "PHYSICS",
    },
    {
      name: "Bachelor of Law",
      university_id: universityMap["University of Nairobi"],
      cluster: "1A",
      subject1: "ENGLISH",
      subject2: "KISWAHILI",
      subject3: "HISTORY",
      subject4: "Any GROUP III",
    },
    {
      name: "Bachelor of Engineering (Electrical)",
      university_id: universityMap["Jomo Kenyatta University"],
      cluster: "2A",
      subject1: "MATHEMATICS",
      subject2: "PHYSICS",
      subject3: "CHEMISTRY",
      subject4: "Any GROUP II",
    },
    {
      name: "Bachelor of Business Administration",
      university_id: universityMap["Strathmore University"],
      cluster: "6A",
      subject1: "MATHEMATICS",
      subject2: "BUSINESS STUDIES",
      subject3: "ECONOMICS",
      subject4: "ENGLISH",
    },
    {
      name: "Bachelor of Education (Arts)",
      university_id: universityMap["Kenyatta University"],
      cluster: "5A",
      subject1: "ENGLISH",
      subject2: "LITERATURE",
      subject3: "KISWAHILI",
      subject4: "Any GROUP III",
    },
    {
      name: "Bachelor of Science (Computer Science)",
      university_id: universityMap["Moi University"],
      cluster: "9A",
      subject1: "MATHEMATICS",
      subject2: "PHYSICS",
      subject3: "CHEMISTRY",
      subject4: "Any GROUP II",
    },
  ].filter((course) => {
    const key = `${course.name}-${course.university_id}`
    return !existingCourseKeys.has(key) && course.university_id !== undefined
  })

  // Only insert if there are new courses to add
  if (newCourses.length > 0) {
    const { error: courseError } = await supabase.from("courses").insert(newCourses)

    if (courseError) {
      console.error("Error seeding courses:", courseError)
      return false
    }
  }

  return true
}

