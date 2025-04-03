import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Float "mo:base/Float";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Text "mo:base/Text";

actor CourseCanister {
    // Define Course type
    public type Course = {
        id: Nat;
        name: Text;
        university_id: Nat;
        cluster: Text;
        subject1: Text;
        subject2: Text;
        subject3: Text;
        subject4: ?Text;
        duration: ?Text;
        career_prospects: ?Text;
        description: ?Text;
    };

    // Define StudentGrades type
    public type StudentGrades = {
        subject: Text;
        grade: Text;
    };

    // Define CourseMatch type
    public type CourseMatch = {
        id: Nat;
        name: Text;
        cluster: Text;
        matchScore: Float;
        matchPercentage: Float;
        averagePoints: Float;
        matchedSubjects: [Text];
    };

    // Store courses in a HashMap
    private var courses = HashMap.HashMap<Nat, Course>(0, Nat.equal, Nat.hash);
    private var nextId : Nat = 1;

    // Add a course
    public func addCourse(
        name: Text,
        university_id: Nat,
        cluster: Text,
        subject1: Text,
        subject2: Text,
        subject3: Text,
        subject4: ?Text,
        duration: ?Text,
        career_prospects: ?Text,
        description: ?Text
    ) : async Nat {
        let id = nextId;
        let course : Course = {
            id;
            name;
            university_id;
            cluster;
            subject1;
            subject2;
            subject3;
            subject4;
            duration;
            career_prospects;
            description;
        };
        courses.put(id, course);
        nextId += 1;
        return id;
    };

    // Get all courses
    public query func getAllCourses() : async [Course] {
        let buffer = Buffer.Buffer<Course>(0);
        for ((_, course) in courses.entries()) {
            buffer.add(course);
        };
        return Buffer.toArray(buffer);
    };

    // Get courses by university
    public query func getCoursesByUniversity(universityId: Nat) : async [Course] {
        let buffer = Buffer.Buffer<Course>(0);
        for ((_, course) in courses.entries()) {
            if (course.university_id == universityId) {
                buffer.add(course);
            };
        };
        return Buffer.toArray(buffer);
    };

    // Get course by ID
    public query func getCourseById(id: Nat) : async ?Course {
        return courses.get(id);
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

    // Check if a subject matches a requirement
    private func subjectMatchesRequirement(subject: Text, requirement: Text) : Bool {
        if (Text.equal(subject, requirement)) {
            return true;
        };
        
        // Check for "ANY" conditions
        if (Text.contains(requirement, #text "ANY")) {
            if (Text.contains(requirement, #text "GROUP II") and isGroupII(subject)) {
                return true;
            };
            if (Text.contains(requirement, #text "GROUP III") and isGroupIII(subject)) {
                return true;
            };
            if (Text.contains(requirement, #text "GROUP IV") and isGroupIV(subject)) {
                return true;
            };
            if (Text.contains(requirement, #text "GROUP V") and isGroupV(subject)) {
                return true;
            };
        };
        
        // Check for alternative subjects (e.g., "ENG/KIS")
        if (Text.contains(requirement, #text "/")) {
            let alternatives = Text.split(requirement, #text "/");
            for (alt in alternatives) {
                if (Text.equal(subject, alt)) {
                    return true;
                };
            };
        };
        
        return false;
    };

    // Subject group classifications
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

    private func isGroupIV(subject: Text) : Bool {
        switch (subject) {
            case "HOME SCIENCE" { true };
            case "ART AND DESIGN" { true };
            case "AGRICULTURE" { true };
            case "WOODWORK" { true };
            case "METALWORK" { true };
            case "BUILDING CONSTRUCTION" { true };
            case "POWER MECHANICS" { true };
            case "ELECTRICITY" { true };
            case "DRAWING AND DESIGN" { true };
            case "AVIATION TECHNOLOGY" { true };
            case _ { false };
        }
    };

    private func isGroupV(subject: Text) : Bool {
        switch (subject) {
            case "FRENCH" { true };
            case "GERMAN" { true };
            case "ARABIC" { true };
            case "MUSIC" { true };
            case "BUSINESS STUDIES" { true };
            case "ECONOMICS" { true };
            case _ { false };
        }
    };

    // Course matching algorithm
    public func getCourseSuggestions(universityId: Nat, grades: [StudentGrades]) : async [CourseMatch] {
        // Get courses for the selected university
        let universityCourses = Buffer.Buffer<Course>(0);
        for ((_, course) in courses.entries()) {
            if (course.university_id == universityId) {
                universityCourses.add(course);
            };
        };
        
        // Match courses with student profile
        let matchesBuffer = Buffer.Buffer<CourseMatch>(0);
        
        for (course in Buffer.toArray(universityCourses).vals()) {
            // Check subject requirements
            let requirements = Buffer.Buffer<Text>(0);
            requirements.add(course.subject1);
            requirements.add(course.subject2);
            requirements.add(course.subject3);
            
            switch (course.subject4) {
                case (?subject4) { requirements.add(subject4) };
                case (null) { /* No fourth subject */ };
            };
            
            var matchCount : Float = 0.0;
            var totalPoints : Float = 0.0;
            let matchedSubjectsBuffer = Buffer.Buffer<Text>(0);
            
            // For each requirement, find the best matching subject
            for (requirement in Buffer.toArray(requirements).vals()) {
                var bestMatch : ?StudentGrades = null;
                var bestPoints : Float = 0.0;
                
                for (studentGrade in grades.vals()) {
                    if (subjectMatchesRequirement(studentGrade.subject, requirement)) {
                        let points = convertGradeToPoints(studentGrade.grade);
                        if (points > bestPoints) {
                            bestMatch := ?studentGrade;
                            bestPoints := points;
                        };
                    };
                };
                
                switch (bestMatch) {
                    case (?match) {
                        matchCount += 1.0;
                        totalPoints += bestPoints;
                        matchedSubjectsBuffer.add(match.subject);
                    };
                    case (null) { /* No match found */ };
                };
            };
            
            // Calculate match percentage
            let requirementsCount = Float.fromInt(Buffer.toArray(requirements).size());
            let matchPercentage = if (requirementsCount > 0.0) {
                (matchCount / requirementsCount) * 100.0
            } else {
                0.0
            };
            
            // Calculate average points for matched subjects
            let averagePoints = if (matchCount > 0.0) {
                totalPoints / matchCount
            } else {
                0.0
            };
            
            // Final score combines match percentage and average points
            let matchScore = matchPercentage * 0.6 + averagePoints * 5.0;
            
            // Only include courses with decent match
            if (matchScore > 40.0) {
                let match : CourseMatch = {
                    id = course.id;
                    name = course.name;
                    cluster = course.cluster;
                    matchScore = matchScore;
                    matchPercentage = matchPercentage;
                    averagePoints = averagePoints;
                    matchedSubjects = Buffer.toArray(matchedSubjectsBuffer);
                };
                matchesBuffer.add(match);
            };
        };
        
        // Sort results by match score (descending)
        let matches = Buffer.toArray(matchesBuffer);
        let sortedMatches = Array.sort(matches, func (a: CourseMatch, b: CourseMatch) : { #less; #equal; #greater } {
            if (a.matchScore > b.matchScore) { #less }
            else if (a.matchScore < b.matchScore) { #greater }
            else { #equal }
        });
        
        return sortedMatches;
    };

    // Initialize with sample data
    public func initSampleData() : async () {
        // University of Nairobi courses
        ignore await addCourse(
            "Bachelor of Medicine and Surgery",
            1, // University of Nairobi
            "3A",
            "BIOLOGY",
            "CHEMISTRY",
            "MATHEMATICS",
            ?"PHYSICS",
            ?"6 years",
            ?"Medical Doctor, Surgeon, Medical Researcher",
            ?"This program prepares students for careers in medicine, focusing on diagnosis, treatment, and prevention of disease."
        );
        
        ignore await addCourse(
            "Bachelor of Law",
            1, // University of Nairobi
            "1A",
            "ENGLISH",
            "KISWAHILI",
            "HISTORY",
            ?"Any GROUP III",
            ?"4 years",
            ?"Lawyer, Judge, Legal Consultant",
            ?"The law program provides comprehensive training in legal principles, procedures, and practices."
        );
        
        // Jomo Kenyatta University courses
        ignore await addCourse(
            "Bachelor of Engineering (Electrical)",
            5, // Jomo Kenyatta University
            "2A",
            "MATHEMATICS",
            "PHYSICS",
            "CHEMISTRY",
            ?"Any GROUP II",
            ?"5 years",
            ?"Electrical Engineer, Systems Engineer, Project Manager",
            ?"This program focuses on the design and application of electrical systems and technology."
        );
        
        // Strathmore University courses
        ignore await addCourse(
            "Bachelor of Business Administration",
            3, // Strathmore University
            "6A",
            "MATHEMATICS",
            "BUSINESS STUDIES",
            "ECONOMICS",
            ?"ENGLISH",
            ?"4 years",
            ?"Business Manager, Entrepreneur, Consultant",
            ?"The BBA program provides a strong foundation in business principles, management, and entrepreneurship."
        );
        
        // Kenyatta University courses
        ignore await addCourse(
            "Bachelor of Education (Arts)",
            2, // Kenyatta University
            "5A",
            "ENGLISH",
            "LITERATURE",
            "KISWAHILI",
            ?"Any GROUP III",
            ?"4 years",
            ?"Teacher, Education Administrator, Curriculum Developer",
            ?"This program prepares students for careers in teaching and education management."
        );
        
        // Moi University courses
        ignore await addCourse(
            "Bachelor of Science (Computer Science)",
            4, // Moi University
            "9A",
            "MATHEMATICS",
            "PHYSICS",
            "CHEMISTRY",
            ?"Any GROUP II",
            ?"4 years",
            ?"Software Developer, Systems Analyst, IT Consultant",
            ?"The Computer Science program focuses on programming, algorithms, and computer systems."
        );
    };
}

