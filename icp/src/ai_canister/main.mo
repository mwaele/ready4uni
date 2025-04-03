import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Float "mo:base/Float";
import Nat "mo:base/Nat";
import Text "mo:base/Text";

actor AiCanister {
    // Define types that match the other canisters
    public type StudentGrades = {
        subject: Text;
        grade: Text;
    };

    public type MatchResult = {
        id: Nat;
        name: Text;
        cutoff: ?Float;
        previousCutoff: ?Float;
        matchScore: Float;
        meetsCutoff: Bool;
    };

    public type CourseMatch = {
        id: Nat;
        name: Text;
        cluster: Text;
        matchScore: Float;
        matchPercentage: Float;
        averagePoints: Float;
        matchedSubjects: [Text];
    };

    // Enhance university suggestions with AI insights
    public func enhanceUniversitySuggestions(suggestions: [MatchResult], grades: [StudentGrades]) : async [MatchResult] {
        // In a real implementation, this would use AI to enhance the suggestions
        // For now, we'll just add a small boost to certain universities based on subject strengths
        
        let enhancedSuggestions = Buffer.Buffer<MatchResult>(suggestions.size());
        
        for (suggestion in suggestions.vals()) {
            var enhancedScore = suggestion.matchScore;
            
            // Example AI enhancement: Boost science-focused universities for students strong in sciences
            let scienceStrength = calculateScienceStrength(grades);
            
            // Boost certain universities based on their strengths
            switch (suggestion.id) {
                // University of Nairobi - boost for science strength
                case (1) {
                    enhancedScore := enhancedScore * (1.0 + scienceStrength * 0.1);
                };
                // Kenyatta University - boost for humanities
                case (2) {
                    let humanitiesStrength = calculateHumanitiesStrength(grades);
                    enhancedScore := enhancedScore * (1.0 + humanitiesStrength * 0.1);
                };
                // Strathmore University - boost for business subjects
                case (3) {
                    let businessStrength = calculateBusinessStrength(grades);
                    enhancedScore := enhancedScore * (1.0 + businessStrength * 0.1);
                };
                // Other universities - no special boost
                case (_) {};
            };
            
            // Create enhanced suggestion
            let enhancedSuggestion : MatchResult = {
                id = suggestion.id;
                name = suggestion.name;
                cutoff = suggestion.cutoff;
                previousCutoff = suggestion.previousCutoff;
                matchScore = enhancedScore;
                meetsCutoff = suggestion.meetsCutoff;
            };
            
            enhancedSuggestions.add(enhancedSuggestion);
        };
        
        // Sort by enhanced score
        let results = Buffer.toArray(enhancedSuggestions);
        let sortedResults = Array.sort(results, func (a: MatchResult, b: MatchResult) : { #less; #equal; #greater } {
            if (a.matchScore > b.matchScore) { #less }
            else if (a.matchScore < b.matchScore) { #greater }
            else { #equal }
        });
        
        return sortedResults;
    };

    // Enhance course suggestions with AI insights
    public func enhanceCourseSuggestions(suggestions: [CourseMatch], grades: [StudentGrades]) : async [CourseMatch] {
        // In a real implementation, this would use AI to enhance the suggestions
        // For now, we'll just add a small boost to certain courses based on subject strengths
        
        let enhancedSuggestions = Buffer.Buffer<CourseMatch>(suggestions.size());
        
        for (suggestion in suggestions.vals()) {
            var enhancedScore = suggestion.matchScore;
            
            // Example AI enhancement: Boost courses that align with student's strongest subjects
            switch (suggestion.cluster) {
                // Science clusters
                case ("2A") case ("3A") case ("8A") case ("9A") {
                    let scienceStrength = calculateScienceStrength(grades);
                    enhancedScore := enhancedScore * (1.0 + scienceStrength * 0.1);
                };
                // Humanities clusters
                case ("4A") case ("5A") {
                    let humanitiesStrength = calculateHumanitiesStrength(grades);
                    enhancedScore := enhancedScore * (1.0 + humanitiesStrength * 0.1);
                };
                // Business clusters
                case ("6A") {
                    let businessStrength = calculateBusinessStrength(grades);
                    enhancedScore := enhancedScore * (1.0 + businessStrength * 0.1);
                };
                // Other clusters - no special boost
                case (_) {};
            };
            
            // Create enhanced suggestion
            let enhancedSuggestion : CourseMatch = {
                id = suggestion.id;
                name = suggestion.name;
                cluster = suggestion.cluster;
                matchScore = enhancedScore;
                matchPercentage = suggestion.matchPercentage;
                averagePoints = suggestion.averagePoints;
                matchedSubjects = suggestion.matchedSubjects;
            };
            
            enhancedSuggestions.add(enhancedSuggestion);
        };
        
        // Sort by enhanced score
        let results = Buffer.toArray(enhancedSuggestions);
        let sortedResults = Array.sort(results, func (a: CourseMatch, b: CourseMatch) : { #less; #equal; #greater } {
            if (a.matchScore > b.matchScore) { #less }
            else if (a.matchScore < b.matchScore) { #greater }
            else { #equal }
        });
        
        return sortedResults;
    };

    // Helper functions to calculate subject strengths
    private func calculateScienceStrength(grades: [StudentGrades]) : Float {
        let scienceSubjects = ["BIOLOGY", "CHEMISTRY", "PHYSICS", "MATHEMATICS"];
        return calculateSubjectGroupStrength(grades, scienceSubjects);
    };

    private func calculateHumanitiesStrength(grades: [StudentGrades]) : Float {
        let humanitiesSubjects = ["ENGLISH", "KISWAHILI", "HISTORY", "GEOGRAPHY", "CRE", "LITERATURE"];
        return calculateSubjectGroupStrength(grades, humanitiesSubjects);
    };

    private func calculateBusinessStrength(grades: [StudentGrades]) : Float {
        let businessSubjects = ["BUSINESS STUDIES", "ECONOMICS", "MATHEMATICS", "ENGLISH"];
        return calculateSubjectGroupStrength(grades, businessSubjects);
    };

    private func calculateSubjectGroupStrength(grades: [StudentGrades], subjects: [Text]) : Float {
        var totalPoints : Float = 0.0;
        var count : Float = 0.0;
        
        for (grade in grades.vals()) {
            for (subject in subjects.vals()) {
                if (Text.equal(grade.subject, subject)) {
                    totalPoints += convertGradeToPoints(grade.grade);
                    count += 1.0;
                    break;
                };
            };
        };
        
        if (count > 0.0) {
            return totalPoints / (count * 12.0); // Normalize to 0-1 range (12 is max points)
        } else {
            return 0.0;
        }
    };

    // Helper function to convert grade to points
    private func convertGradeToPoints(grade: Text) : Float {
        switch (grade) {
            case "A" { 12.0 };
            case "A-" { 11.0 };
            case "B+" { 10.0 };
            case "B" { 9.0 };
            case "B-" { 8.0 };
            case "C+" { 7.0 };
            case "C" { 6.0 };
            case "C-" { 5.0 };
            case "D+" { 4.0 };
            case "D" { 3.0 };
            case "D-" { 2.0 };
            case "E" { 1.0 };
            case _ { 0.0 };
        }
    };
}

