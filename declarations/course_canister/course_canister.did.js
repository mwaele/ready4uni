export const idlFactory = ({ IDL }) => {
  const Course = IDL.Record({
    id: IDL.Nat,
    name: IDL.Text,
    university_id: IDL.Nat,
    cluster: IDL.Text,
    subject1: IDL.Text,
    subject2: IDL.Text,
    subject3: IDL.Text,
    subject4: IDL.Opt(IDL.Text),
    duration: IDL.Opt(IDL.Text),
    career_prospects: IDL.Opt(IDL.Text),
    description: IDL.Opt(IDL.Text),
  })

  const StudentGrades = IDL.Record({
    subject: IDL.Text,
    grade: IDL.Text,
  })

  const CourseMatch = IDL.Record({
    id: IDL.Nat,
    name: IDL.Text,
    cluster: IDL.Text,
    matchScore: IDL.Float64,
    matchPercentage: IDL.Float64,
    averagePoints: IDL.Float64,
    matchedSubjects: IDL.Vec(IDL.Text),
  })

  return IDL.Service({
    addCourse: IDL.Func(
      [
        IDL.Text,
        IDL.Nat,
        IDL.Text,
        IDL.Text,
        IDL.Text,
        IDL.Text,
        IDL.Opt(IDL.Text),
        IDL.Opt(IDL.Text),
        IDL.Opt(IDL.Text),
        IDL.Opt(IDL.Text),
      ],
      [IDL.Nat],
      [],
    ),
    getAllCourses: IDL.Func([], [IDL.Vec(Course)], ["query"]),
    getCourseById: IDL.Func([IDL.Nat], [IDL.Opt(Course)], ["query"]),
    getCoursesByUniversity: IDL.Func([IDL.Nat], [IDL.Vec(Course)], ["query"]),
    getCourseSuggestions: IDL.Func([IDL.Nat, IDL.Vec(StudentGrades)], [IDL.Vec(CourseMatch)], []),
    initSampleData: IDL.Func([], [], []),
  })
}

