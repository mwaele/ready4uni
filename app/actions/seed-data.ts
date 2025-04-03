"use server"

import { createClient } from "@supabase/supabase-js"

// Create a single supabase client for server-side
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!)

export async function seedAdditionalData() {
  // Add more universities
  const { error: uniError } = await supabase.from("universities").upsert(
    [
      {
        name: "University of Nairobi",
        cutoff_2024: 28.976,
        cutoff_2023: 30.562,
        location: "Nairobi",
        type: "Public",
        ranking: 1,
        established: 1970,
        website: "https://www.uonbi.ac.ke",
        description:
          "The University of Nairobi is the largest university in Kenya. It has a distinguished reputation for training, research and development of high-level human resources.",
      },
      {
        name: "Kenyatta University",
        cutoff_2024: 27.312,
        cutoff_2023: 29.245,
        location: "Nairobi",
        type: "Public",
        ranking: 2,
        established: 1985,
        website: "https://www.ku.ac.ke",
        description:
          "Kenyatta University is the second largest public university in Kenya. It is committed to quality education through teaching, research, and community service.",
      },
      {
        name: "Strathmore University",
        cutoff_2024: 30.125,
        cutoff_2023: 31.45,
        location: "Nairobi",
        type: "Private",
        ranking: 3,
        established: 1961,
        website: "https://www.strathmore.edu",
        description:
          "Strathmore University is a leading private university in Kenya known for its excellence in academic standards, professionalism, and character development.",
      },
      {
        name: "Moi University",
        cutoff_2024: 25.876,
        cutoff_2023: 27.123,
        location: "Eldoret",
        type: "Public",
        ranking: 4,
        established: 1984,
        website: "https://www.mu.ac.ke",
        description:
          "Moi University is a public university located in Eldoret, Kenya. It offers a wide range of programs and is known for its strong focus on technology and innovation.",
      },
      {
        name: "Jomo Kenyatta University",
        cutoff_2024: 26.543,
        cutoff_2023: 28.765,
        location: "Juja",
        type: "Public",
        ranking: 5,
        established: 1994,
        website: "https://www.jkuat.ac.ke",
        description:
          "Jomo Kenyatta University of Agriculture and Technology (JKUAT) is a public university near Nairobi, Kenya focusing on agriculture, engineering, and technology.",
      },
    ],
    { onConflict: "name" },
  )

  if (uniError) {
    console.error("Error seeding universities:", uniError)
    return false
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

  // Add more courses
  const { error: courseError } = await supabase.from("courses").upsert(
    [
      {
        name: "Bachelor of Medicine and Surgery",
        university_id: universityMap["University of Nairobi"],
        cluster: "3A",
        subject1: "BIOLOGY",
        subject2: "CHEMISTRY",
        subject3: "MATHEMATICS",
        subject4: "PHYSICS",
        duration: "6 years",
        career_prospects: "Medical Doctor, Surgeon, Medical Researcher",
        description:
          "This program prepares students for careers in medicine, focusing on diagnosis, treatment, and prevention of disease.",
      },
      {
        name: "Bachelor of Law",
        university_id: universityMap["University of Nairobi"],
        cluster: "1A",
        subject1: "ENGLISH",
        subject2: "KISWAHILI",
        subject3: "HISTORY",
        subject4: "Any GROUP III",
        duration: "4 years",
        career_prospects: "Lawyer, Judge, Legal Consultant",
        description: "The law program provides comprehensive training in legal principles, procedures, and practices.",
      },
      {
        name: "Bachelor of Engineering (Electrical)",
        university_id: universityMap["Jomo Kenyatta University"],
        cluster: "2A",
        subject1: "MATHEMATICS",
        subject2: "PHYSICS",
        subject3: "CHEMISTRY",
        subject4: "Any GROUP II",
        duration: "5 years",
        career_prospects: "Electrical Engineer, Systems Engineer, Project Manager",
        description: "This program focuses on the design and application of electrical systems and technology.",
      },
      {
        name: "Bachelor of Business Administration",
        university_id: universityMap["Strathmore University"],
        cluster: "6A",
        subject1: "MATHEMATICS",
        subject2: "BUSINESS STUDIES",
        subject3: "ECONOMICS",
        subject4: "ENGLISH",
        duration: "4 years",
        career_prospects: "Business Manager, Entrepreneur, Consultant",
        description:
          "The BBA program provides a strong foundation in business principles, management, and entrepreneurship.",
      },
      {
        name: "Bachelor of Education (Arts)",
        university_id: universityMap["Kenyatta University"],
        cluster: "5A",
        subject1: "ENGLISH",
        subject2: "LITERATURE",
        subject3: "KISWAHILI",
        subject4: "Any GROUP III",
        duration: "4 years",
        career_prospects: "Teacher, Education Administrator, Curriculum Developer",
        description: "This program prepares students for careers in teaching and education management.",
      },
      {
        name: "Bachelor of Science (Computer Science)",
        university_id: universityMap["Moi University"],
        cluster: "9A",
        subject1: "MATHEMATICS",
        subject2: "PHYSICS",
        subject3: "CHEMISTRY",
        subject4: "Any GROUP II",
        duration: "4 years",
        career_prospects: "Software Developer, Systems Analyst, IT Consultant",
        description: "The Computer Science program focuses on programming, algorithms, and computer systems.",
      },
    ],
    { onConflict: ["name", "university_id"] },
  )

  if (courseError) {
    console.error("Error seeding courses:", courseError)
    return false
  }

  return true
}

