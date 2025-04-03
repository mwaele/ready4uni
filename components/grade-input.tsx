"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

interface GradeInputProps {
  subject: string
  onChange: (subject: string, grade: string) => void
}

export function GradeInput({ subject, onChange }: GradeInputProps) {
  const [grade, setGrade] = useState("")

  const handleGradeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newGrade = e.target.value
    setGrade(newGrade)
    onChange(subject, newGrade)
  }

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor={subject}>{subject}</Label>
      <Input type="text" id={subject} placeholder="Enter grade" value={grade} onChange={handleGradeChange} />
    </div>
  )
}

