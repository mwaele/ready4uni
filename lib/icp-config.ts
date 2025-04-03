// ICP Configuration
export const ICP_CONFIG = {
  // Replace with your actual canister IDs when deployed
  UNIVERSITY_CANISTER_ID: process.env.NEXT_PUBLIC_UNIVERSITY_CANISTER_ID || "rrkah-fqaaa-aaaaa-aaaaq-cai",
  COURSE_CANISTER_ID: process.env.NEXT_PUBLIC_COURSE_CANISTER_ID || "ryjl3-tyaaa-aaaaa-aaaba-cai",
  AI_CANISTER_ID: process.env.NEXT_PUBLIC_AI_CANISTER_ID || "r7inp-6aaaa-aaaaa-aaabq-cai",
  HOST: process.env.NEXT_PUBLIC_ICP_HOST || "https://ic0.app",
}

// Interface definitions for ICP canister calls
export interface UniversityData {
  id: number
  name: string
  cutoff_2024: number
  cutoff_2023: number
  location?: string
  type?: string
  ranking?: number
}

export interface CourseData {
  id: number
  name: string
  university_id: number
  cluster: string
  subject1: string
  subject2: string
  subject3: string
  subject4: string
  duration?: string
  career_prospects?: string
}

export interface StudentGrades {
  [subject: string]: string
}

export interface MatchResult {
  id: number
  name: string
  matchScore: number
  meetsCutoff: boolean
  cutoff?: number
  previousCutoff?: number
}

