export const idlFactory = ({ IDL }) => {
  const StudentGrades = IDL.Record({
    subject: IDL.Text,
    grade: IDL.Text,
  })

  const MatchResult = IDL.Record({
    id: IDL.Nat,
    name: IDL.Text,
    cutoff: IDL.Opt(IDL.Float64),
    previousCutoff: IDL.Opt(IDL.Float64),
    matchScore: IDL.Float64,
    meetsCutoff: IDL.Bool,
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
    enhanceUniversitySuggestions: IDL.Func([IDL.Vec(MatchResult), IDL.Vec(StudentGrades)], [IDL.Vec(MatchResult)], []),
    enhanceCourseSuggestions: IDL.Func([IDL.Vec(CourseMatch), IDL.Vec(StudentGrades)], [IDL.Vec(CourseMatch)], []),
  })
}

