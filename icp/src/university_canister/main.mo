import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Float "mo:base/Float";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Text "mo:base/Text";

actor UniversityCanister {
    // Define University type
    public type University = {
        id: Nat;
        name: Text;
        cutoff_2024: Float;
        cutoff_2023: Float;
        location: ?Text;
        type_: ?Text;
        ranking: ?Nat;
        established: ?Nat;
        website: ?Text;
        description: ?Text;
    };

    // Define StudentGrades type
    public type StudentGrades = {
        subject: Text;
        grade: Text;
    };

    // Define MatchResult type
    public type MatchResult = {
        id: Nat;
        name: Text;
        cutoff: ?Float;
        previousCutoff: ?Float;
        matchScore: Float;
        meetsCutoff: Bool;
    };

    // Store universities in a HashMap
    private var universities = HashMap.HashMap<Nat, University>(0, Nat.equal, Nat.hash);
    private var nextId : Nat = 1;

    // Add a university
    public func addUniversity(
        name: Text, 
        cutoff_2024: Float, 
        cutoff_2023: Float, 
        location: ?Text, 
        type_: ?Text, 
        ranking: ?Nat,
        established: ?Nat,
        website: ?Text,
        description: ?Text
    ) : async Nat {
        let id = nextId;
        let university : University = {
            id;
            name;
            cutoff_2024;
            cutoff_2023;
            location;
            type_;
            ranking;
            established;
            website;
            description;
        };
        universities.put(id, university);
        nextId += 1;
        return id;
    };

    // Get all universities
    public query func getAllUniversities() : async [University] {
        let buffer = Buffer.Buffer<University>(0);
        for ((_, university) in universities.entries()) {
            buffer.add(university);
        };
        return Buffer.toArray(buffer);
    };

    // Get university by ID
    public query func getUniversityById(id: Nat) : async ?University {
        return universities.get(id);
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

    // Calculate weighted mean of grades
    private func calculateWeightedMean(grades: [StudentGrades]) : Float {
        var totalPoints : Float = 0.0;
        var totalWeight : Float = 0.0;
        
        for (gradeEntry in grades.vals()) {
            let subject = gradeEntry.subject;
            let grade = gradeEntry.grade;
            
            // Define subject weights
            var weight : Float = 1.0;
            switch (subject) {
                case "ENGLISH" { weight := 2.0 };
                case "KISWAHILI" { weight := 2.0 };
                case "MATHEMATICS" { weight := 2.0 };
                case "BIOLOGY" { weight := 1.5 };
                case "CHEMISTRY" { weight := 1.5 };
                case "PHYSICS" { weight := 1.5 };
                case "HISTORY" { weight := 1.0 };
                case "GEOGRAPHY" { weight := 1.0 };
                case "CRE" { weight := 1.0 };
                case "BUSINESS STUDIES" { weight := 1.0 };
                case "AGRICULTURE" { weight := 1.0 };
                case _ { weight := 1.0 };
            };
            
            let points = convertGradeToPoints(grade);
            totalPoints += points * weight;
            totalWeight += weight;
        };
        
        if (totalWeight > 0.0) {
            return totalPoints / totalWeight;
        } else {
            return 0.0;
        }
    };

    // Check if a subject belongs to a specific group
    private func isGroupII(subject: Text) : Bool {
        switch (subject) {
            case "BIOLOGY" { true };
            case "CHEMISTRY" { true };
            case "PHYSICS" { true };
            case "MATHEMATICS" { true };
            case _ { false };
        }
    };

    private func isGroupIII(subject: Text) : Bool {
        switch (subject) {
            case "HISTORY" { true };
            case "GEOGRAPHY" { true };
            case "CRE" { true };
            case "IRE" { true };
            case "HRE" { true };
            case _ { false };
        }
    };

    // Calculate cluster points for specific subject combinations
    private func calculateClusterPoints(grades: [StudentGrades], cluster: Text) : Float {
        // Define cluster subject combinations
        let clusterSubjects = switch (cluster) {
            case "1A" { ["MATHEMATICS", "ENGLISH", "KISWAHILI"] };
            case "2A" { ["MATHEMATICS", "PHYSICS", "CHEMISTRY"] };
            case "3A" { ["BIOLOGY", "CHEMISTRY", "MATHEMATICS"] };
            case "4A" { ["HISTORY", "GEOGRAPHY", "CRE"] };
            case "5A" { ["ENGLISH", "LITERATURE", "KISWAHILI"] };
            case "6A" { ["MATHEMATICS", "BUSINESS STUDIES", "ECONOMICS"] };
            case "7A" { ["MATHEMATICS", "PHYSICS", "GEOGRAPHY"] };
            case "8A" { ["MATHEMATICS", "CHEMISTRY", "BIOLOGY"] };
            case "9A" { ["MATHEMATICS", "PHYSICS", "CHEMISTRY"] };
            case _ { [] };
        };
        
        if (clusterSubjects.size() == 0) {
            return 0.0;
        };
        
        var totalPoints : Float = 0.0;
        var subjectsFound : Float = 0.0;
        
        for (requiredSubject in clusterSubjects.vals()) {
            var found = false;
            for (studentGrade in grades.vals()) {
                if (Text.equal(studentGrade.subject, requiredSubject)) {
                    totalPoints += convertGradeToPoints(studentGrade.grade);
                    subjectsFound += 1.0;
                    found := true;
                    break;
                };
            };
        };
        
        // If not all subjects in the cluster are found, penalize the score
        let completionFactor = subjectsFound / Float.fromInt(clusterSubjects.size());
        return totalPoints * completionFactor;
    };

    // University matching algorithm
    public func getUniversitySuggestions(grades: [StudentGrades]) : async [MatchResult] {
        // Calculate the student's weighted mean grade
        let weightedMean = calculateWeightedMean(grades);
        
        // Prepare results buffer
        let resultsBuffer = Buffer.Buffer<MatchResult>(0);
        
        // Process each university
        for ((_, university) in universities.entries()) {
            // Calculate base match score using cutoff points
            let cutoffDifference = weightedMean - university.cutoff_2024;
            
            // Calculate final match score (higher is better)
            // Factors: cutoff difference (positive is good), trend from previous year
            let cutoffTrend = university.cutoff_2023 - university.cutoff_2024;
            let trendFactor = if (cutoffTrend > 0.0) {
                1.0 + cutoffTrend / 10.0
            } else {
                1.0 - Float.abs(cutoffTrend) / 20.0
            };
            
            var matchScore : Float = 0.0;
            if (cutoffDifference >= 0.0) {
                // Student meets or exceeds cutoff
                matchScore := 100.0 + cutoffDifference + cutoffTrend * 2.0;
            } else {
                // Student below cutoff
                matchScore := Float.max(0.0, 50.0 + cutoffDifference * 5.0);
            };
            
            // Apply trend factor
            matchScore *= trendFactor;
            
            // Only include universities with positive match scores
            if (matchScore > 0.0) {
                let result : MatchResult = {
                    id = university.id;
                    name = university.name;
                    cutoff = ?university.cutoff_2024;
                    previousCutoff = ?university.cutoff_2023;
                    matchScore = matchScore;
                    meetsCutoff = cutoffDifference >= 0.0;
                };
                resultsBuffer.add(result);
            };
        };
        
        // Sort results by match score (descending)
        let results = Buffer.toArray(resultsBuffer);
        let sortedResults = Array.sort(results, func (a: MatchResult, b: MatchResult) : { #less; #equal; #greater } {
            if (a.matchScore > b.matchScore) { #less }
            else if (a.matchScore < b.matchScore) { #greater }
            else { #equal }
        });
        
        // Return top 10 results
        if (sortedResults.size() <= 10) {
            return sortedResults;
        } else {
            return Array.subArray(sortedResults, 0, 10);
        }
    };

    // Initialize with sample data
    public func initSampleData() : async () {
        ignore await addUniversity(
            "University of Nairobi", 
            28.976, 
            30.562, 
            ?"Nairobi", 
            ?"Public", 
            ?1,
            ?1970,
            ?"https://www.uonbi.ac.ke",
            ?"The University of Nairobi is the largest university in Kenya. It has a distinguished reputation for training, research and development of high-level human resources."
        );
        
        ignore await addUniversity(
            "Kenyatta University", 
            27.312, 
            29.245, 
            ?"Nairobi", 
            ?"Public", 
            ?2,
            ?1985,
            ?"https://www.ku.ac.ke",
            ?"Kenyatta University is the second largest public university in Kenya. It is committed to quality education through teaching, research, and community service."
        );
        
        ignore await addUniversity(
            "Strathmore University", 
            30.125, 
            31.45, 
            ?"Nairobi", 
            ?"Private", 
            ?3,
            ?1961,
            ?"https://www.strathmore.edu",
            ?"Strathmore University is a leading private university in Kenya known for its excellence in academic standards, professionalism, and character development."
        );
        
        ignore await addUniversity(
            "Moi University", 
            25.876, 
            27.123, 
            ?"Eldoret", 
            ?"Public", 
            ?4,
            ?1984,
            ?"https://www.mu.ac.ke",
            ?"Moi University is a public university located in Eldoret, Kenya. It offers a wide range of programs and is known for its strong focus on technology and innovation."
        );
        
        ignore await addUniversity(
            "Jomo Kenyatta University", 
            26.543, 
            28.765, 
            ?"Juja", 
            ?"Public", 
            ?5,
            ?1994,
            ?"https://www.jkuat.ac.ke",
            ?"Jomo Kenyatta University of Agriculture and Technology (JKUAT) is a public university near Nairobi, Kenya focusing on agriculture, engineering, and technology."
        );
    };
}

