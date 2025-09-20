# Postman Collection - Complete Course API Bodies

## Environment Variables Setup
```json
{
  "baseUrl": "http://localhost:3000/api/v1",
  "authToken": "your_jwt_token_here",
  "courseId": "course_id_here",
}
```

---

## 1. CREATE COURSE ENDPOINTS

### 1.1 Basic Paid Course - Music Theory
**POST** `/api/v1/courses`
**Headers:** `Authorization: Bearer {{authToken}}`, `Content-Type: application/json`

```json
{
  "title": "Introduction to Music Theory",
  "description": "Learn the fundamentals of music theory including scales, chords, and harmony. This comprehensive course covers everything from basic note reading to advanced chord progressions.",
  "courseType": 1,
  "price": 49.99,
  "benefits": [
    "Understand musical scales and modes",
    "Learn chord progressions and harmony",
    "Master rhythm and timing concepts",
    "Apply theory to practical music composition",
    "Read and write sheet music confidently"
  ],
  "category": "Music Theory",
  "thumbnail": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500",
  "duration": "4 weeks",
  "level": "beginner",
  "tags": ["music", "theory", "beginner", "scales", "chords"],
  "courseContent": [
    {
      "title": "Introduction to Musical Notes",
      "description": "Understanding the basic building blocks of music - notes, pitches, and intervals",
      "videoUrl": "https://example.com/videos/intro-notes.mp4",
      "duration": "15 minutes",
      "order": 1,
      "isPreview": true
    },
    {
      "title": "Major and Minor Scales",
      "description": "Learn how to construct and identify major and minor scales",
      "videoUrl": "https://example.com/videos/scales.mp4",
      "duration": "20 minutes",
      "order": 2,
      "isPreview": false
    },
    {
      "title": "Chord Construction",
      "description": "Understanding how chords are built from scales",
      "videoUrl": "https://example.com/videos/chords.mp4",
      "duration": "25 minutes",
      "order": 3,
      "isPreview": false
    },
    {
      "title": "Chord Progressions",
      "description": "Common chord progressions and their applications",
      "videoUrl": "https://example.com/videos/progressions.mp4",
      "duration": "30 minutes",
      "order": 4,
      "isPreview": false
    }
  ],
  "prerequisites": [
    "Basic understanding of music",
    "Ability to read simple sheet music",
    "Access to a piano or keyboard (recommended)"
  ],
  "learningOutcomes": [
    "Identify different musical scales and their characteristics",
    "Understand chord construction and relationships",
    "Apply music theory to composition and arrangement",
    "Read and analyze chord charts and lead sheets",
    "Develop ear training skills for chord recognition"
  ]
}
```

### 1.2 Beginner Guitar Course
**POST** `/api/v1/courses`

```json
{
  "title": "Beginner Guitar Mastery",
  "description": "Complete guitar course for absolute beginners. Learn proper technique, basic chords, strumming patterns, and play your first songs.",
  "courseType": 1,
  "price": 29.99,
  "benefits": [
    "Learn proper guitar holding and posture",
    "Master basic open chords",
    "Develop strumming and picking techniques",
    "Play 10 popular songs",
    "Build finger strength and dexterity"
  ],
  "category": "Guitar",
  "thumbnail": "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=500",
  "duration": "6 weeks",
  "level": "beginner",
  "tags": ["guitar", "beginner", "chords", "strumming", "songs"],
  "courseContent": [
    {
      "title": "Guitar Basics and Setup",
      "description": "Introduction to guitar parts, tuning, and proper holding technique",
      "videoUrl": "https://example.com/videos/guitar-basics.mp4",
      "duration": "12 minutes",
      "order": 1,
      "isPreview": true
    },
    {
      "title": "First Chords - E, A, D",
      "description": "Learn your first three basic chords",
      "videoUrl": "https://example.com/videos/first-chords.mp4",
      "duration": "18 minutes",
      "order": 2,
      "isPreview": false
    },
    {
      "title": "Basic Strumming Patterns",
      "description": "Master the fundamental strumming techniques",
      "videoUrl": "https://example.com/videos/strumming.mp4",
      "duration": "15 minutes",
      "order": 3,
      "isPreview": false
    },
    {
      "title": "Your First Song - Happy Birthday",
      "description": "Apply what you've learned to play your first complete song",
      "videoUrl": "https://example.com/videos/first-song.mp4",
      "duration": "22 minutes",
      "order": 4,
      "isPreview": false
    }
  ],
  "prerequisites": [
    "Access to an acoustic or electric guitar",
    "Guitar tuner (app or physical tuner)",
    "No prior musical experience required"
  ],
  "learningOutcomes": [
    "Hold and tune a guitar properly",
    "Play 8 basic open chords",
    "Execute 5 different strumming patterns",
    "Play 3 complete songs from start to finish",
    "Transition smoothly between chords"
  ]
}
```

### 1.3 Free Piano Course
**POST** `/api/v1/courses`

```json
{
  "title": "Free Piano Fundamentals",
  "description": "Learn piano basics completely free! Perfect introduction to piano playing with proper technique and basic songs.",
  "courseType": 2,
  "price": 0,
  "benefits": [
    "Learn proper piano posture and hand position",
    "Master basic note reading",
    "Play simple melodies",
    "Understand piano keys and layout",
    "Build confidence in piano playing"
  ],
  "category": "Piano",
  "thumbnail": "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=500",
  "duration": "2 weeks",
  "level": "beginner",
  "tags": ["piano", "free", "beginner", "notes", "melodies"],
  "courseContent": [
    {
      "title": "Piano Introduction and Setup",
      "description": "Understanding piano keys, proper seating, and hand position",
      "videoUrl": "https://example.com/videos/piano-intro.mp4",
      "duration": "10 minutes",
      "order": 1,
      "isPreview": true
    },
    {
      "title": "Reading Basic Notes",
      "description": "Learn to read treble clef notes on the piano",
      "videoUrl": "https://example.com/videos/note-reading.mp4",
      "duration": "15 minutes",
      "order": 2,
      "isPreview": false
    },
    {
      "title": "Your First Melody - Twinkle Twinkle",
      "description": "Play your first complete melody",
      "videoUrl": "https://example.com/videos/twinkle-twinkle.mp4",
      "duration": "12 minutes",
      "order": 3,
      "isPreview": false
    }
  ],
  "prerequisites": [
    "Access to a piano or keyboard",
    "No prior musical experience required"
  ],
  "learningOutcomes": [
    "Identify all piano keys and their names",
    "Read basic treble clef notation",
    "Play 3 simple melodies",
    "Develop proper finger technique",
    "Build foundation for advanced piano study"
  ]
}
```

### 1.4 Advanced Drum Course
**POST** `/api/v1/courses`

```json
{
  "title": "Advanced Drum Techniques",
  "description": "Master advanced drumming techniques including polyrhythms, ghost notes, and complex fills. Perfect for intermediate to advanced drummers.",
  "courseType": 1,
  "price": 89.99,
  "benefits": [
    "Master polyrhythmic patterns",
    "Develop ghost note techniques",
    "Learn complex drum fills",
    "Improve timing and precision",
    "Create dynamic drum arrangements"
  ],
  "category": "Drums",
  "thumbnail": "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=500",
  "duration": "8 weeks",
  "level": "advanced",
  "tags": ["drums", "advanced", "techniques", "polyrhythms", "fills"],
  "courseContent": [
    {
      "title": "Polyrhythmic Foundations",
      "description": "Understanding and playing polyrhythmic patterns",
      "videoUrl": "https://example.com/videos/polyrhythms.mp4",
      "duration": "35 minutes",
      "order": 1,
      "isPreview": true
    },
    {
      "title": "Ghost Note Mastery",
      "description": "Developing subtle ghost note techniques",
      "videoUrl": "https://example.com/videos/ghost-notes.mp4",
      "duration": "28 minutes",
      "order": 2,
      "isPreview": false
    },
    {
      "title": "Complex Fill Patterns",
      "description": "Creating and executing advanced drum fills",
      "videoUrl": "https://example.com/videos/complex-fills.mp4",
      "duration": "42 minutes",
      "order": 3,
      "isPreview": false
    }
  ],
  "prerequisites": [
    "Intermediate drumming skills",
    "Understanding of basic drum notation",
    "Access to a drum kit",
    "Metronome or drum machine"
  ],
  "learningOutcomes": [
    "Execute complex polyrhythmic patterns",
    "Master ghost note techniques",
    "Create dynamic drum fills",
    "Improve overall timing and precision",
    "Develop personal drumming style"
  ]
}
```

### 1.5 Vocal Training Course
**POST** `/api/v1/courses`

```json
{
  "title": "Professional Vocal Training",
  "description": "Complete vocal training program covering breathing techniques, vocal range expansion, and performance skills.",
  "courseType": 1,
  "price": 69.99,
  "benefits": [
    "Expand vocal range and power",
    "Master breathing techniques",
    "Develop stage presence",
    "Learn vocal health and care",
    "Build confidence in performance"
  ],
  "category": "Vocals",
  "thumbnail": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500",
  "duration": "10 weeks",
  "level": "intermediate",
  "tags": ["vocals", "singing", "breathing", "performance", "technique"],
  "courseContent": [
    {
      "title": "Breathing Fundamentals",
      "description": "Proper breathing techniques for vocalists",
      "videoUrl": "https://example.com/videos/breathing.mp4",
      "duration": "20 minutes",
      "order": 1,
      "isPreview": true
    },
    {
      "title": "Vocal Range Expansion",
      "description": "Exercises to safely expand your vocal range",
      "videoUrl": "https://example.com/videos/range-expansion.mp4",
      "duration": "25 minutes",
      "order": 2,
      "isPreview": false
    },
    {
      "title": "Performance Techniques",
      "description": "Stage presence and performance skills",
      "videoUrl": "https://example.com/videos/performance.mp4",
      "duration": "30 minutes",
      "order": 3,
      "isPreview": false
    }
  ],
  "prerequisites": [
    "Basic singing experience",
    "Access to a quiet practice space",
    "Recording device for practice"
  ],
  "learningOutcomes": [
    "Master proper breathing techniques",
    "Expand vocal range by at least 2 notes",
    "Develop strong stage presence",
    "Learn vocal health maintenance",
    "Build confidence in live performance"
  ]
}
```

### 1.6 Songwriting Course
**POST** `/api/v1/courses`

```json
{
  "title": "Creative Songwriting Workshop",
  "description": "Learn the art of songwriting from melody creation to lyric writing. Develop your unique voice as a songwriter.",
  "courseType": 1,
  "price": 59.99,
  "benefits": [
    "Learn song structure and form",
    "Develop lyric writing skills",
    "Create memorable melodies",
    "Understand chord progressions for songs",
    "Build a portfolio of original songs"
  ],
  "category": "Songwriting",
  "thumbnail": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500",
  "duration": "6 weeks",
  "level": "intermediate",
  "tags": ["songwriting", "lyrics", "melody", "composition", "creative"],
  "courseContent": [
    {
      "title": "Song Structure Basics",
      "description": "Understanding verse, chorus, bridge, and song form",
      "videoUrl": "https://example.com/videos/song-structure.mp4",
      "duration": "22 minutes",
      "order": 1,
      "isPreview": true
    },
    {
      "title": "Lyric Writing Techniques",
      "description": "Crafting meaningful and memorable lyrics",
      "videoUrl": "https://example.com/videos/lyrics.mp4",
      "duration": "28 minutes",
      "order": 2,
      "isPreview": false
    },
    {
      "title": "Melody Creation",
      "description": "Creating catchy and memorable melodies",
      "videoUrl": "https://example.com/videos/melody.mp4",
      "duration": "25 minutes",
      "order": 3,
      "isPreview": false
    },
    {
      "title": "Chord Progressions for Songs",
      "description": "Using chord progressions to support your songs",
      "videoUrl": "https://example.com/videos/chord-progressions.mp4",
      "duration": "30 minutes",
      "order": 4,
      "isPreview": false
    }
  ],
  "prerequisites": [
    "Basic understanding of music",
    "Access to an instrument (guitar, piano, etc.)",
    "Recording device for demos"
  ],
  "learningOutcomes": [
    "Write complete songs with proper structure",
    "Create compelling lyrics and melodies",
    "Use chord progressions effectively",
    "Develop personal songwriting style",
    "Build a portfolio of original compositions"
  ]
}
```

### 1.7 Music Production Course
**POST** `/api/v1/courses`

```json
{
  "title": "Digital Music Production",
  "description": "Learn modern music production techniques using digital audio workstations. From recording to mixing and mastering.",
  "courseType": 1,
  "price": 99.99,
  "benefits": [
    "Master digital audio workstations",
    "Learn recording and mixing techniques",
    "Understand mastering fundamentals",
    "Create professional-quality tracks",
    "Build a home studio setup"
  ],
  "category": "Production",
  "thumbnail": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500",
  "duration": "12 weeks",
  "level": "intermediate",
  "tags": ["production", "daw", "mixing", "mastering", "recording"],
  "courseContent": [
    {
      "title": "DAW Introduction",
      "description": "Getting started with digital audio workstations",
      "videoUrl": "https://example.com/videos/daw-intro.mp4",
      "duration": "25 minutes",
      "order": 1,
      "isPreview": true
    },
    {
      "title": "Recording Techniques",
      "description": "Professional recording methods and equipment",
      "videoUrl": "https://example.com/videos/recording.mp4",
      "duration": "35 minutes",
      "order": 2,
      "isPreview": false
    },
    {
      "title": "Mixing Fundamentals",
      "description": "Essential mixing techniques and tools",
      "videoUrl": "https://example.com/videos/mixing.mp4",
      "duration": "40 minutes",
      "order": 3,
      "isPreview": false
    },
    {
      "title": "Mastering Basics",
      "description": "Introduction to mastering techniques",
      "videoUrl": "https://example.com/videos/mastering.mp4",
      "duration": "30 minutes",
      "order": 4,
      "isPreview": false
    }
  ],
  "prerequisites": [
    "Basic computer skills",
    "Access to a computer with DAW software",
    "Audio interface (recommended)",
    "Studio monitors or headphones"
  ],
  "learningOutcomes": [
    "Navigate and use DAW software effectively",
    "Record high-quality audio tracks",
    "Mix tracks with professional techniques",
    "Apply basic mastering principles",
    "Set up a functional home studio"
  ]
}
```

---

## 2. UPDATE COURSE ENDPOINTS

### 2.1 Update Course Title and Price
**PUT** `/api/v1/courses/{{courseId}}`
**Headers:** `Authorization: Bearer {{authToken}}`, `Content-Type: application/json`

```json
{
  "title": "Advanced Music Theory Mastery",
  "price": 79.99,
  "description": "Updated comprehensive course covering advanced music theory concepts including jazz harmony, modal theory, and contemporary composition techniques."
}
```

### 2.2 Update Course Content
**PUT** `/api/v1/courses/{{courseId}}`

```json
{
  "courseContent": [
    {
      "title": "Advanced Chord Extensions",
      "description": "Understanding 7th, 9th, 11th, and 13th chords",
      "videoUrl": "https://example.com/videos/chord-extensions.mp4",
      "duration": "30 minutes",
      "order": 1,
      "isPreview": true
    },
    {
      "title": "Jazz Harmony Fundamentals",
      "description": "Introduction to jazz chord progressions and substitutions",
      "videoUrl": "https://example.com/videos/jazz-harmony.mp4",
      "duration": "35 minutes",
      "order": 2,
      "isPreview": false
    },
    {
      "title": "Modal Theory and Applications",
      "description": "Understanding modes and their practical applications",
      "videoUrl": "https://example.com/videos/modal-theory.mp4",
      "duration": "40 minutes",
      "order": 3,
      "isPreview": false
    }
  ],
  "level": "advanced",
  "benefits": [
    "Master advanced harmonic concepts",
    "Understand jazz theory and improvisation",
    "Learn modal theory and applications",
    "Compose contemporary music",
    "Analyze complex musical structures"
  ]
}
```

### 2.3 Update Course Level and Duration
**PUT** `/api/v1/courses/{{courseId}}`

```json
{
  "level": "advanced",
  "duration": "8 weeks",
  "prerequisites": [
    "Intermediate music theory knowledge",
    "Understanding of basic chord progressions",
    "Access to a piano or keyboard",
    "Music notation software (recommended)"
  ],
  "learningOutcomes": [
    "Construct and analyze complex chord progressions",
    "Apply jazz harmony concepts to composition",
    "Use modal theory in improvisation",
    "Compose contemporary music with advanced techniques",
    "Analyze and understand complex musical works"
  ]
}
```

### 2.4 Update Course Benefits and Tags
**PUT** `/api/v1/courses/{{courseId}}`

```json
{
  "benefits": [
    "Master advanced harmonic concepts",
    "Understand jazz theory and improvisation",
    "Learn modal theory and applications",
    "Compose contemporary music",
    "Analyze complex musical structures",
    "Develop advanced ear training skills"
  ],
  "tags": ["music", "theory", "advanced", "jazz", "modal", "composition"],
  "category": "Advanced Music Theory"
}
```

---

## 3. GET COURSE ENDPOINTS (No Body Required)

### 3.1 Get All Courses - Basic
**GET** `/api/v1/courses`
**Query Parameters:**
- `page=1`
- `limit=10`
- `sortBy=createdAt`
- `sortOrder=desc`

### 3.2 Unified API Examples

#### Search Courses (Regex Search)
**GET** `/api/v1/courses`
**Query Parameters:**
- `search=guitar` (simple search)
- `search=^begin` (courses starting with "begin")
- `search=.*theory.*` (courses containing "theory")
- `search=advanced|professional` (courses with "advanced" OR "professional")
- `page=1`
- `limit=10`

#### Advanced Regex Search Examples
**GET** `/api/v1/courses`

**Simple Search:**
- `search=guitar` - Find courses with "guitar" anywhere

**Starts With:**
- `search=^begin` - Find courses starting with "begin"
- `search=^advanced` - Find courses starting with "advanced"

**Ends With:**
- `search=course$` - Find courses ending with "course"
- `search=basics$` - Find courses ending with "basics"

**Contains Pattern:**
- `search=.*theory.*` - Find courses containing "theory"
- `search=.*music.*` - Find courses containing "music"

**Multiple Options:**
- `search=advanced|professional|expert` - Find courses with "advanced" OR "professional" OR "expert"
- `search=guitar|piano|drums` - Find courses with "guitar" OR "piano" OR "drums"

**Case Insensitive (default):**
- `search=GUITAR` - Same as "guitar" (case-insensitive)
- `search=Music` - Same as "music" (case-insensitive)

**Complex Patterns:**
- `search=^begin.*course$` - Find courses starting with "begin" and ending with "course"
- `search=.*(theory|harmony).*` - Find courses containing "theory" OR "harmony"

#### Filter Paid Courses
**GET** `/api/v1/courses`
**Query Parameters:**
- `courseType=1`
- `page=1`
- `limit=10`

#### Filter Free Courses
**GET** `/api/v1/courses`
**Query Parameters:**
- `courseType=2`
- `page=1`
- `limit=10`

#### Filter by Category
**GET** `/api/v1/courses`
**Query Parameters:**
- `category=Guitar`
- `page=1`
- `limit=10`

#### Filter by Level
**GET** `/api/v1/courses`
**Query Parameters:**
- `level=beginner`
- `page=1`
- `limit=10`

#### Price Range Filter
**GET** `/api/v1/courses`
**Query Parameters:**
- `minPrice=20`
- `maxPrice=100`
- `page=1`
- `limit=10`

#### Filter by Tags
**GET** `/api/v1/courses`
**Query Parameters:**
- `tags=music,theory,beginner`
- `page=1`
- `limit=10`

#### Sort by Price
**GET** `/api/v1/courses`
**Query Parameters:**
- `sortBy=price`
- `sortOrder=asc`
- `page=1`
- `limit=10`

#### Sort by Rating
**GET** `/api/v1/courses`
**Query Parameters:**
- `sortBy=rating`
- `sortOrder=desc`
- `page=1`
- `limit=10`

#### Sort by Enrollment
**GET** `/api/v1/courses`
**Query Parameters:**
- `sortBy=enrollmentCount`
- `sortOrder=desc`
- `page=1`
- `limit=10`

#### Multiple Filters Combined
**GET** `/api/v1/courses`
**Query Parameters:**
- `search=guitar`
- `courseType=1`
- `level=beginner`
- `minPrice=20`
- `maxPrice=100`
- `sortBy=price`
- `sortOrder=asc`
- `page=1`
- `limit=10`

### 3.9 Get Course by ID
**GET** `/api/v1/courses/{{courseId}}`

### 3.10 Get Course Categories
**GET** `/api/v1/courses/categories`

---

## 4. DELETE COURSE ENDPOINT

### 4.1 Delete Course
**DELETE** `/api/v1/courses/{{courseId}}`
**Headers:** `Authorization: Bearer {{authToken}}`
**Body:** None required

---

## 5. COMPLEX SCENARIOS

### 5.1 Course with Maximum Content
**POST** `/api/v1/courses`

```json
{
  "title": "Complete Music Production Masterclass",
  "description": "The ultimate music production course covering everything from songwriting to mastering. Perfect for aspiring producers and musicians who want to create professional-quality music.",
  "courseType": 1,
  "price": 199.99,
  "benefits": [
    "Master professional music production techniques",
    "Learn advanced mixing and mastering",
    "Understand music business and marketing",
    "Build a complete home studio",
    "Create and release professional tracks",
    "Develop your unique production style",
    "Network with industry professionals",
    "Build a sustainable music career"
  ],
  "category": "Production",
  "thumbnail": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500",
  "duration": "16 weeks",
  "level": "advanced",
  "tags": ["production", "masterclass", "mixing", "mastering", "business", "career", "studio", "professional"],
  "courseContent": [
    {
      "title": "Studio Setup and Equipment",
      "description": "Complete guide to setting up a professional home studio",
      "videoUrl": "https://example.com/videos/studio-setup.mp4",
      "duration": "45 minutes",
      "order": 1,
      "isPreview": true
    },
    {
      "title": "Songwriting and Arrangement",
      "description": "Creating compelling songs and arrangements",
      "videoUrl": "https://example.com/videos/songwriting.mp4",
      "duration": "50 minutes",
      "order": 2,
      "isPreview": false
    },
    {
      "title": "Recording Techniques",
      "description": "Professional recording methods for all instruments",
      "videoUrl": "https://example.com/videos/recording.mp4",
      "duration": "55 minutes",
      "order": 3,
      "isPreview": false
    },
    {
      "title": "Advanced Mixing",
      "description": "Professional mixing techniques and workflows",
      "videoUrl": "https://example.com/videos/mixing.mp4",
      "duration": "60 minutes",
      "order": 4,
      "isPreview": false
    },
    {
      "title": "Mastering Fundamentals",
      "description": "Complete mastering process and techniques",
      "videoUrl": "https://example.com/videos/mastering.mp4",
      "duration": "40 minutes",
      "order": 5,
      "isPreview": false
    },
    {
      "title": "Music Business and Marketing",
      "description": "Understanding the music industry and promoting your work",
      "videoUrl": "https://example.com/videos/business.mp4",
      "duration": "35 minutes",
      "order": 6,
      "isPreview": false
    }
  ],
  "prerequisites": [
    "Basic understanding of music theory",
    "Access to a computer with DAW software",
    "Audio interface and studio monitors",
    "Microphone for recording",
    "MIDI controller (recommended)",
    "Dedicated practice time (10+ hours per week)"
  ],
  "learningOutcomes": [
    "Set up and operate a professional home studio",
    "Write and arrange compelling original music",
    "Record high-quality tracks for all instruments",
    "Mix tracks to professional standards",
    "Master tracks for commercial release",
    "Understand music business fundamentals",
    "Market and promote your music effectively",
    "Build a sustainable career in music production"
  ]
}
```

### 5.2 Minimal Course (Only Required Fields)
**POST** `/api/v1/courses`

```json
{
  "title": "Basic Music Notes",
  "description": "Learn the basic music notes and their names.",
  "courseType": 2,
  "category": "Music Theory",
  "thumbnail": "https://example.com/thumbnail.jpg",
  "instructor": "{{instructorId}}"
}
```

### 5.3 Course Update - Partial Fields
**PUT** `/api/v1/courses/{{courseId}}`

```json
{
  "title": "Updated Course Title",
  "price": 39.99,
  "level": "intermediate"
}
```

---

## 6. ERROR SCENARIOS

### 6.1 Invalid Course Type
**POST** `/api/v1/courses`

```json
{
  "title": "Test Course",
  "description": "Test description",
  "courseType": 3,
  "category": "Test",
  "thumbnail": "https://example.com/thumbnail.jpg",
  "instructor": "{{instructorId}}"
}
```
**Expected Error:** Course type must be 1 (paid) or 2 (free)

### 6.2 Missing Required Fields
**POST** `/api/v1/courses`

```json
{
  "title": "Incomplete Course",
  "courseType": 1,
  "price": 29.99
}
```
**Expected Error:** Missing required fields (description, category, thumbnail, instructor)

### 6.3 Paid Course Without Price
**POST** `/api/v1/courses`

```json
{
  "title": "Paid Course Without Price",
  "description": "This should fail",
  "courseType": 1,
  "category": "Test",
  "thumbnail": "https://example.com/thumbnail.jpg",
  "instructor": "{{instructorId}}"
}
```
**Expected Error:** Price is required for paid courses

### 6.4 Invalid Instructor ID
**POST** `/api/v1/courses`

```json
{
  "title": "Course with Invalid Instructor",
  "description": "This should fail",
  "courseType": 2,
  "category": "Test",
  "thumbnail": "https://example.com/thumbnail.jpg",
  "instructor": "invalid_instructor_id"
}
```
**Expected Error:** Instructor not found

---

## 7. QUERY PARAMETER EXAMPLES

### 7.1 Complex Search and Filter
**GET** `/api/v1/courses`
**Query Parameters:**
- `search=guitar`
- `courseType=1`
- `category=Guitar`
- `level=beginner`
- `sortBy=enrollmentCount`
- `sortOrder=desc`
- `page=1`
- `limit=20`

### 7.2 Price Range Search
**GET** `/api/v1/courses`
**Query Parameters:**
- `courseType=1`
- `sortBy=price`
- `sortOrder=asc`
- `page=1`
- `limit=10`

### 7.3 Popular Courses
**GET** `/api/v1/courses`
**Query Parameters:**
- `sortBy=enrollmentCount`
- `sortOrder=desc`
- `page=1`
- `limit=5`

### 7.4 Recent Courses
**GET** `/api/v1/courses`
**Query Parameters:**
- `sortBy=createdAt`
- `sortOrder=desc`
- `page=1`
- `limit=10`

---

## 8. HEADERS FOR ALL REQUESTS

### 8.1 Create/Update/Delete Course
```
Content-Type: application/json
Authorization: Bearer {{authToken}}
```

### 8.2 Get Course (No Authentication Required)
```
Content-Type: application/json
```

---

## 9. RESPONSE EXAMPLES

### 9.1 Successful Course Creation
```json
{
  "success": true,
  "message": "Course created successfully",
  "data": {
    "course": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "title": "Introduction to Music Theory",
      "description": "Learn the fundamentals of music theory...",
      "courseType": 1,
      "courseTypeName": "paid",
      "price": 49.99,
      "benefits": ["Understand musical scales..."],
      "category": "Music Theory",
      "thumbnail": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500",
      "duration": "4 weeks",
      "level": "beginner",
      "tags": ["music", "theory", "beginner"],
      "enrollmentCount": 0,
      "rating": {
        "average": 0,
        "count": 0
      },
      "createdAt": "2024-01-01T10:00:00Z",
      "updatedAt": "2024-01-01T10:00:00Z"
    }
  }
}
```

### 9.2 Course List Response (Updated Structure)
```json
{
  "success": true,
  "message": "Courses retrieved successfully",
  "data": {
    "allCourses": {
      "courses": [
        {
          "id": "64f8a1b2c3d4e5f6a7b8c9d0",
          "title": "Introduction to Music Theory",
          "courseType": 1,
          "courseTypeName": "paid",
          "price": 49.99,
          "category": "Music Theory",
          "thumbnail": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500",
          "enrollmentCount": 150,
          "rating": {
            "average": 4.5,
            "count": 25
          }
        }
      ],
      "pagination": {
        "currentPage": 1,
        "totalPages": 5,
        "totalCourses": 50,
        "hasNextPage": true,
        "hasPrevPage": false
      }
    },
    "paidCourses": [
      {
        "id": "paid_course_1",
        "title": "Advanced Music Theory",
        "courseType": 1,
        "courseTypeName": "paid",
        "price": 49.99,
        "category": "Music Theory",
        "thumbnail": "https://example.com/theory.jpg",
        "enrollmentCount": 75,
        "rating": {
          "average": 4.2,
          "count": 12
        }
      }
    ],
    "freeCourses": [
      {
        "id": "free_course_1",
        "title": "Free Piano Basics",
        "courseType": 2,
        "courseTypeName": "free",
        "price": 0,
        "category": "Piano",
        "thumbnail": "https://example.com/piano.jpg",
        "enrollmentCount": 200,
        "rating": {
          "average": 4.0,
          "count": 35
        }
      }
    ]
  }
}
```

**Important Notes:**
- `allCourses`: Applies ALL filters including search, pagination, category, level, price range, etc.
- `paidCourses`: Returns ALL paid courses (NO search, NO pagination) but respects other filters like category, level
- `freeCourses`: Returns ALL free courses (NO search, NO pagination) but respects other filters like category, level

**Example:** If you search for "guitar":
- `allCourses`: Will show only guitar courses with pagination
- `paidCourses`: Will show ALL paid courses (not just guitar)
- `freeCourses`: Will show ALL free courses (not just guitar)

This comprehensive collection covers all possible scenarios for the Course Management API, including create, read, update, delete operations with various filters, sorting options, and error cases.
