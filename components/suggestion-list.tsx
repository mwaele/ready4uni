interface SuggestionListProps {
  suggestions: string[]
}

export function SuggestionList({ suggestions }: SuggestionListProps) {
  return (
    <ul>
      {suggestions.map((suggestion, index) => (
        <li key={index} className="py-2">
          {suggestion}
        </li>
      ))}
    </ul>
  )
}

