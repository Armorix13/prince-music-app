# Two Similar Course Examples for Adding

## Course 1: Beginner Guitar Course

**POST** `/api/v1/courses`
**Headers:** `Authorization: Bearer {{authToken}}`, `Content-Type: application/json`

```json
{
  "title": "Beginner Guitar Fundamentals",
  "description": "Learn guitar from absolute scratch! This comprehensive course covers everything you need to know to start playing guitar. Perfect for complete beginners with no prior musical experience.",
  "courseType": 1,
  "price": 39.99,
  "benefits": [
    "Learn proper guitar holding and posture",
    "Master basic open chords (C, G, D, E, A)",
    "Develop strumming and picking techniques",
    "Play 5 popular songs from start to finish",
    "Build finger strength and dexterity",
    "Understand guitar maintenance and care"
  ],
  "category": "Guitar",
  "thumbnail": "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=500",
  "duration": "6 weeks",
  "level": "beginner",
  "tags": ["guitar", "beginner", "chords", "strumming", "songs", "acoustic"],
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
      "title": "First Chords - C, G, D",
      "description": "Learn your first three essential chords",
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
    },
    {
      "title": "More Chords - E, A, F",
      "description": "Expand your chord vocabulary with essential chords",
      "videoUrl": "https://example.com/videos/more-chords.mp4",
      "duration": "20 minutes",
      "order": 5,
      "isPreview": false
    },
    {
      "title": "Song Practice - Wonderwall",
      "description": "Learn to play the classic song Wonderwall",
      "videoUrl": "https://example.com/videos/wonderwall.mp4",
      "duration": "25 minutes",
      "order": 6,
      "isPreview": false
    }
  ],
  "prerequisites": [
    "Access to an acoustic or electric guitar",
    "Guitar tuner (app or physical tuner)",
    "No prior musical experience required",
    "Dedicated practice time (30 minutes daily recommended)"
  ],
  "learningOutcomes": [
    "Hold and tune a guitar properly",
    "Play 8 basic open chords smoothly",
    "Execute 5 different strumming patterns",
    "Play 3 complete songs from start to finish",
    "Transition smoothly between chords",
    "Understand basic guitar maintenance"
  ]
}
```

---

## Course 2: Intermediate Guitar Techniques

**POST** `/api/v1/courses`
**Headers:** `Authorization: Bearer {{authToken}}`, `Content-Type: application/json`

```json
{
  "title": "Intermediate Guitar Mastery",
  "description": "Take your guitar playing to the next level! This course builds on basic skills to develop advanced techniques, fingerpicking, barre chords, and musical theory. Perfect for guitarists ready to expand their skills.",
  "courseType": 1,
  "price": 59.99,
  "benefits": [
    "Master barre chords and power chords",
    "Develop fingerpicking techniques",
    "Learn advanced strumming patterns",
    "Understand music theory for guitarists",
    "Play complex songs and solos",
    "Build speed and accuracy"
  ],
  "category": "Guitar",
  "thumbnail": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500",
  "duration": "8 weeks",
  "level": "intermediate",
  "tags": ["guitar", "intermediate", "barre-chords", "fingerpicking", "music-theory", "solos"],
  "courseContent": [
    {
      "title": "Barre Chords Fundamentals",
      "description": "Master the technique of playing barre chords",
      "videoUrl": "https://example.com/videos/barre-chords.mp4",
      "duration": "25 minutes",
      "order": 1,
      "isPreview": true
    },
    {
      "title": "Fingerpicking Patterns",
      "description": "Learn essential fingerpicking techniques and patterns",
      "videoUrl": "https://example.com/videos/fingerpicking.mp4",
      "duration": "30 minutes",
      "order": 2,
      "isPreview": false
    },
    {
      "title": "Advanced Strumming",
      "description": "Complex strumming patterns and rhythmic techniques",
      "videoUrl": "https://example.com/videos/advanced-strumming.mp4",
      "duration": "28 minutes",
      "order": 3,
      "isPreview": false
    },
    {
      "title": "Music Theory for Guitarists",
      "description": "Understanding scales, modes, and chord construction",
      "videoUrl": "https://example.com/videos/music-theory.mp4",
      "duration": "35 minutes",
      "order": 4,
      "isPreview": false
    },
    {
      "title": "Solo Techniques",
      "description": "Learn to play guitar solos and improvisation",
      "videoUrl": "https://example.com/videos/solo-techniques.mp4",
      "duration": "32 minutes",
      "order": 5,
      "isPreview": false
    },
    {
      "title": "Song Study - Hotel California",
      "description": "Learn the classic song with advanced techniques",
      "videoUrl": "https://example.com/videos/hotel-california.mp4",
      "duration": "40 minutes",
      "order": 6,
      "isPreview": false
    }
  ],
  "prerequisites": [
    "Basic guitar playing skills (6+ months experience)",
    "Ability to play open chords smoothly",
    "Basic understanding of guitar tuning",
    "Access to an acoustic or electric guitar",
    "Metronome for practice"
  ],
  "learningOutcomes": [
    "Play barre chords confidently across the neck",
    "Execute complex fingerpicking patterns",
    "Master advanced strumming techniques",
    "Understand basic music theory concepts",
    "Play guitar solos and improvisations",
    "Perform complex songs with advanced techniques"
  ]
}
```

---

## Key Similarities Between Both Courses:

### **Common Elements:**
- **Same Category**: Both are "Guitar" courses
- **Same Course Type**: Both are paid courses (courseType: 1)
- **Progressive Difficulty**: Beginner → Intermediate
- **Similar Structure**: Both have 6 course content modules
- **Guitar Focus**: Both focus on guitar techniques and songs
- **Practical Application**: Both include song learning modules

### **Differences:**
- **Price**: Beginner ($39.99) vs Intermediate ($59.99)
- **Duration**: 6 weeks vs 8 weeks
- **Level**: beginner vs intermediate
- **Content Focus**: Basic chords vs Advanced techniques
- **Prerequisites**: No experience vs 6+ months experience

### **Perfect for Testing:**
These two courses are ideal for testing your API because they:
- ✅ **Similar enough** to test category filtering
- ✅ **Different enough** to test level filtering
- ✅ **Same course type** to test paid course filtering
- ✅ **Complete data** with all required fields
- ✅ **Realistic content** that makes sense for a music platform

### **Test Scenarios:**
```bash
# Test category filtering
GET /api/v1/courses?category=Guitar

# Test level filtering  
GET /api/v1/courses?level=beginner
GET /api/v1/courses?level=intermediate

# Test price range
GET /api/v1/courses?minPrice=30&maxPrice=50

# Test search
GET /api/v1/courses?search=guitar
GET /api/v1/courses?search=beginner
```

These examples provide comprehensive course data that will help you test all the filtering and search functionality of your unified course API! 🎵
