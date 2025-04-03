export const idlFactory = ({ IDL }) => {
  const University = IDL.Record({
    id: IDL.Nat,
    name: IDL.Text,
    cutoff_2024: IDL.Float64,
    cutoff_2023: IDL.Float64,
    location: IDL.Opt(IDL.Text),
    type_: IDL.Opt(IDL.Text),
    ranking: IDL.Opt(IDL.Nat),
    established: IDL.Opt(IDL.Nat),
    website: IDL.Opt(IDL.Text),
    description: IDL.Opt(IDL.Text),
  })

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

  return IDL.Service({
    addUniversity: IDL.Func(
      [
        IDL.Text,
        IDL.Float64,
        IDL.Float64,
        IDL.Opt(IDL.Text),
        IDL.Opt(IDL.Text),
        IDL.Opt(IDL.Nat),
        IDL.Opt(IDL.Nat),
        IDL.Opt(IDL.Text),
        IDL.Opt(IDL.Text),
      ],
      [IDL.Nat],
      [],
    ),
    getAllUniversities: IDL.Func([], [IDL.Vec(University)], ["query"]),
    getUniversityById: IDL.Func([IDL.Nat], [IDL.Opt(University)], ["query"]),
    getUniversitySuggestions: IDL.Func([IDL.Vec(StudentGrades)], [IDL.Vec(MatchResult)], []),
    initSampleData: IDL.Func([], [], []),
  })
}

