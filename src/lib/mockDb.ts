// In-memory tables for session storage (resets on server restart)
const mockUsers: any[] = [];
const mockBookmarks: { [userId: string]: string[] } = {};

const LOCATIONS = [
  { state: "Maharashtra", city: "Mumbai" },
  { state: "Karnataka", city: "Bangalore" },
  { state: "Delhi", city: "New Delhi" },
  { state: "Tamil Nadu", city: "Chennai" },
  { state: "West Bengal", city: "Kolkata" },
  { state: "Telangana", city: "Hyderabad" },
  { state: "Uttar Pradesh", city: "Kanpur" },
  { state: "Rajasthan", city: "Pilani" },
  { state: "Gujarat", city: "Ahmedabad" },
  { state: "Kerala", city: "Kochi" }
];

const RECRUITERS = [
  "Google", "Microsoft", "Amazon", "Apple", "Meta", "Netflix", "Goldman Sachs", 
  "Morgan Stanley", "J.P. Morgan", "McKinsey & Co", "Boston Consulting Group",
  "TCS", "Infosys", "Wipro", "Cognizant", "Accenture", "Deloitte", "EY", "KPMG", 
  "PwC", "HDFC Bank", "ICICI Bank", "Reliance Industries", "Tata Motors", "L&T"
];

const REVIEW_TEMPLATES = [
  { rating: 5.0, comment: "Absolutely phenomenal campus life, world-class faculty, and outstanding placement opportunities. The peer group is extremely competitive and motivating." },
  { rating: 4.5, comment: "The infrastructure is state-of-the-art and labs are well-equipped. Placements are great, though the academic pressure can get a bit overwhelming sometimes." },
  { rating: 4.0, comment: "Excellent course structure and great hostel facilities. Mess food is decent compared to other colleges. Top-tier companies visit every year." },
  { rating: 3.5, comment: "Very good college, but the administration is quite strict. Fees are slightly on the higher side, but the return on investment is solid if you work hard." },
  { rating: 3.0, comment: "Decent placements and teachers are supportive. However, campus infrastructure is average and needs maintenance. Extracurricular activities are good." }
];

const COURSE_TEMPLATES = {
  Engineering: [
    { name: "B.Tech Computer Science & Engineering", duration: 4, feeBase: 200000, seats: 120 },
    { name: "B.Tech Electronics & Communication Engineering", duration: 4, feeBase: 180000, seats: 90 },
    { name: "B.Tech Mechanical Engineering", duration: 4, feeBase: 150000, seats: 60 },
    { name: "B.Tech Electrical & Electronics Engineering", duration: 4, feeBase: 160000, seats: 60 },
    { name: "B.Tech Civil Engineering", duration: 4, feeBase: 140000, seats: 30 }
  ],
  Management: [
    { name: "MBA Finance", duration: 2, feeBase: 600000, seats: 60 },
    { name: "MBA Marketing", duration: 2, feeBase: 550000, seats: 120 },
    { name: "MBA Human Resource Management", duration: 2, feeBase: 500000, seats: 60 },
    { name: "MBA Operations & Supply Chain", duration: 2, feeBase: 520000, seats: 60 }
  ],
  Science: [
    { name: "B.Sc Physics (Hons)", duration: 3, feeBase: 30000, seats: 40 },
    { name: "B.Sc Chemistry (Hons)", duration: 3, feeBase: 25000, seats: 40 },
    { name: "B.Sc Mathematics (Hons)", duration: 3, feeBase: 28000, seats: 50 }
  ],
  Arts: [
    { name: "B.A. Economics (Hons)", duration: 3, feeBase: 35000, seats: 60 },
    { name: "B.A. English Literature", duration: 3, feeBase: 20000, seats: 50 },
    { name: "B.A. Political Science", duration: 3, feeBase: 20000, seats: 50 }
  ]
};

const COLLEGE_NAMES = [
  { name: "Indian Institute of Technology (IIT) Bombay", type: "Engineering", ownership: "Public" },
  { name: "Indian Institute of Technology (IIT) Delhi", type: "Engineering", ownership: "Public" },
  { name: "Indian Institute of Technology (IIT) Madras", type: "Engineering", ownership: "Public" },
  { name: "Indian Institute of Technology (IIT) Kanpur", type: "Engineering", ownership: "Public" },
  { name: "Indian Institute of Technology (IIT) Kharagpur", type: "Engineering", ownership: "Public" },
  { name: "Indian Institute of Technology (IIT) Roorkee", type: "Engineering", ownership: "Public" },
  { name: "Indian Institute of Technology (IIT) Guwahati", type: "Engineering", ownership: "Public" },
  { name: "Indian Institute of Technology (IIT) Hyderabad", type: "Engineering", ownership: "Public" },
  { name: "Birla Institute of Technology and Science (BITS) Pilani", type: "Engineering", ownership: "Private" },
  { name: "National Institute of Technology (NIT) Trichy", type: "Engineering", ownership: "Public" },
  { name: "National Institute of Technology (NIT) Surathkal", type: "Engineering", ownership: "Public" },
  { name: "National Institute of Technology (NIT) Warangal", type: "Engineering", ownership: "Public" },
  { name: "Delhi Technological University (DTU)", type: "Engineering", ownership: "Public" },
  { name: "Vellore Institute of Technology (VIT) Vellore", type: "Engineering", ownership: "Private" },
  { name: "Manipal Institute of Technology (MIT) Manipal", type: "Engineering", ownership: "Private" },
  { name: "RV College of Engineering (RVCE) Bangalore", type: "Engineering", ownership: "Private" },
  { name: "College of Engineering Guindy (CEG) Chennai", type: "Engineering", ownership: "Public" },
  { name: "Jadavpur University Faculty of Engineering", type: "Engineering", ownership: "Public" },
  { name: "PSG College of Technology Coimbatore", type: "Engineering", ownership: "Private" },
  { name: "BMS College of Engineering (BMSCE) Bangalore", type: "Engineering", ownership: "Private" },
  { name: "Indian Institute of Management (IIM) Ahmedabad", type: "Management", ownership: "Public" },
  { name: "Indian Institute of Management (IIM) Bangalore", type: "Management", ownership: "Public" },
  { name: "Indian Institute of Management (IIM) Calcutta", type: "Management", ownership: "Public" },
  { name: "Indian Institute of Management (IIM) Lucknow", type: "Management", ownership: "Public" },
  { name: "Indian Institute of Management (IIM) Kozhikode", type: "Management", ownership: "Public" },
  { name: "Indian Institute of Management (IIM) Indore", type: "Management", ownership: "Public" },
  { name: "Faculty of Management Studies (FMS) Delhi", type: "Management", ownership: "Public" },
  { name: "XLRI - Xavier School of Management Jamshedpur", type: "Management", ownership: "Private" },
  { name: "SPJIMR Mumbai", type: "Management", ownership: "Private" },
  { name: "Management Development Institute (MDI) Gurgaon", type: "Management", ownership: "Private" },
  { name: "NMIMS School of Business Management Mumbai", type: "Management", ownership: "Private" },
  { name: "Symbiosis Institute of Business Management (SIBM) Pune", type: "Management", ownership: "Private" },
  { name: "Indian Institute of Foreign Trade (IIFT) Delhi", type: "Management", ownership: "Public" },
  { name: "IMT Ghaziabad", type: "Management", ownership: "Private" },
  { name: "Department of Management Studies (DMS) IIT Delhi", type: "Management", ownership: "Public" },
  { name: "Jamnalal Bajaj Institute of Management Studies (JBIMS) Mumbai", type: "Management", ownership: "Public" },
  { name: "XIMB Bhubaneswar", type: "Management", ownership: "Private" },
  { name: "Great Lakes Institute of Management Chennai", type: "Management", ownership: "Private" },
  { name: "TAPMI Manipal", type: "Management", ownership: "Private" },
  { name: "Goa Institute of Management (GIM)", type: "Management", ownership: "Private" },
  { name: "St. Stephen's College New Delhi", type: "Arts", ownership: "Private" },
  { name: "Lady Shri Ram College for Women Delhi", type: "Arts", ownership: "Public" },
  { name: "Hindu College Delhi", type: "Science", ownership: "Public" },
  { name: "Miranda House Delhi", type: "Science", ownership: "Public" },
  { name: "Loyola College Chennai", type: "Arts", ownership: "Private" },
  { name: "Madras Christian College (MCC) Chennai", type: "Science", ownership: "Private" },
  { name: "Christ University Bangalore", type: "Arts", ownership: "Private" },
  { name: "Presidency College Kolkata", type: "Science", ownership: "Public" },
  { name: "St. Xavier's College Kolkata", type: "Arts", ownership: "Private" },
  { name: "St. Xavier's College Mumbai", type: "Science", ownership: "Private" },
  { name: "Fergusson College Pune", type: "Science", ownership: "Private" },
  { name: "Ramjas College Delhi", type: "Arts", ownership: "Public" },
  { name: "Hansraj College Delhi", type: "Science", ownership: "Public" },
  { name: "Sri Venkateswara College Delhi", type: "Science", ownership: "Public" },
  { name: "Symbiosis College of Arts and Commerce Pune", type: "Arts", ownership: "Private" },
  { name: "Joseph's College Bangalore", type: "Arts", ownership: "Private" },
  { name: "Mount Carmel College Bangalore", type: "Science", ownership: "Private" },
  { name: "Presidency College Chennai", type: "Arts", ownership: "Public" },
  { name: "Stella Maris College Chennai", type: "Arts", ownership: "Private" },
  { name: "K J Somaiya College of Arts and Commerce Mumbai", type: "Arts", ownership: "Private" },
  { name: "Mithibai College Mumbai", type: "Arts", ownership: "Private" },
  { name: "HR College of Commerce and Economics Mumbai", type: "Arts", ownership: "Private" },
  { name: "SRCC (Shri Ram College of Commerce) Delhi", type: "Arts", ownership: "Public" },
  { name: "LSR Delhi", type: "Arts", ownership: "Public" },
  { name: "Gargi College Delhi", type: "Science", ownership: "Public" },
  { name: "Atma Ram Sanatan Dharma College Delhi", type: "Science", ownership: "Public" },
  { name: "Kirori Mal College Delhi", type: "Arts", ownership: "Public" },
  { name: "Deen Dayal Upadhyaya College Delhi", type: "Science", ownership: "Public" },
  { name: "Elphinstone College Mumbai", type: "Arts", ownership: "Public" },
  { name: "Scottish Church College Kolkata", type: "Science", ownership: "Private" },
  { name: "SRM Institute of Science and Technology Chennai", type: "Engineering", ownership: "Private" },
  { name: "Amity University Noida", type: "Engineering", ownership: "Private" },
  { name: "Lovely Professional University (LPU) Jalandhar", type: "Engineering", ownership: "Private" },
  { name: "Chandigarh University", type: "Engineering", ownership: "Private" },
  { name: "Thapar Institute of Engineering and Technology Patiala", type: "Engineering", ownership: "Private" },
  { name: "PES University Bangalore", type: "Engineering", ownership: "Private" },
  { name: "COEP Technological University Pune", type: "Engineering", ownership: "Public" },
  { name: "VJTI Mumbai", type: "Engineering", ownership: "Public" },
  { name: "HBTU Kanpur", type: "Engineering", ownership: "Public" },
  { name: "MNNIT Allahabad", type: "Engineering", ownership: "Public" },
  { name: "MANIT Bhopal", type: "Engineering", ownership: "Public" },
  { name: "VNIT Nagpur", type: "Engineering", ownership: "Public" },
  { name: "Malaviya National Institute of Technology (MNIT) Jaipur", type: "Engineering", ownership: "Public" },
  { name: "NIT Calicut", type: "Engineering", ownership: "Public" },
  { name: "NIT Rourkela", type: "Engineering", ownership: "Public" },
  { name: "NIT Kurukshetra", type: "Engineering", ownership: "Public" },
  { name: "NIT Silchar", type: "Engineering", ownership: "Public" },
  { name: "IIIT Hyderabad", type: "Engineering", ownership: "Private" },
  { name: "IIIT Bangalore", type: "Engineering", ownership: "Private" },
  { name: "IIIT Delhi", type: "Engineering", ownership: "Public" },
  { name: "IIIT Allahabad", type: "Engineering", ownership: "Public" },
  { name: "Netaji Subhas University of Technology (NSUT) Delhi", type: "Engineering", ownership: "Public" },
  { name: "Nirma University Ahmedabad", type: "Engineering", ownership: "Private" },
  { name: "DA-IICT Gandhinagar", type: "Engineering", ownership: "Private" },
  { name: "Sathyabama Institute of Science and Technology Chennai", type: "Engineering", ownership: "Private" },
  { name: "Kalinga Institute of Industrial Technology (KIIT) Bhubaneswar", type: "Engineering", ownership: "Private" },
  { name: "Sikkim Manipal Institute of Technology", type: "Engineering", ownership: "Private" },
  { name: "Alliance University Bangalore", type: "Management", ownership: "Private" },
  { name: "BML Munjal University Gurgaon", type: "Engineering", ownership: "Private" },
  { name: "Shiv Nadar University Greater Noida", type: "Science", ownership: "Private" },
  { name: "Ashoka University Sonepat", type: "Arts", ownership: "Private" },
  { name: "FLAME University Pune", type: "Arts", ownership: "Private" },
  { name: "Azim Premji University Bangalore", type: "Arts", ownership: "Private" },
  { name: "Symbiosis Law School Pune", type: "Arts", ownership: "Private" },
  { name: "National Law School of India University (NLSIU) Bangalore", type: "Arts", ownership: "Public" }
];

// Verified Unsplash education/campus photo IDs
const CAMPUS_IMAGES = [
  "https://images.unsplash.com/photo-1562774053-c275517b1a6c",
  "https://images.unsplash.com/photo-1541339907-198-e08756dedf3f",
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1",
  "https://images.unsplash.com/photo-1592280771190-3e2e4d571952",
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b",
  "https://images.unsplash.com/photo-1498243691581-b145c3f54a5c",
  "https://images.unsplash.com/photo-1525921429558-09311777129f",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4",
  "https://images.unsplash.com/photo-1524178232363-1fb2b075b655",
  "https://images.unsplash.com/photo-1579427421635-a0015b804b2e"
];

const GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1541339907-198-e08756dedf3f",
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1",
  "https://images.unsplash.com/photo-1592280771190-3e2e4d571952",
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b",
  "https://images.unsplash.com/photo-1498243691581-b145c3f54a5c",
  "https://images.unsplash.com/photo-1525921429558-09311777129f",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4"
];

// Programmatic compilation of 105 mock colleges matching the seed output
export const mockColleges: any[] = COLLEGE_NAMES.map((item, index) => {
  const location = LOCATIONS[index % LOCATIONS.length];
  const cleanName = item.name.replace(/[^a-zA-Z0-9 ]/g, "").toLowerCase();
  const slug = cleanName.split(" ").filter(Boolean).join("-") + `-${index + 1}`;
  const id = `mock-college-id-${index + 1}`;

  let qualityMultiplier = 1.0;
  if (item.name.includes("IIT") || item.name.includes("IIM") || item.name.includes("BITS") || item.name.includes("XLRI") || item.name.includes("IISc")) {
    qualityMultiplier = 1.8;
  } else if (item.name.includes("NIT") || item.name.includes("DTU") || item.name.includes("FMS") || item.name.includes("SPJIMR") || item.name.includes("IIIT")) {
    qualityMultiplier = 1.4;
  } else if (item.ownership === "Private") {
    qualityMultiplier = 1.1;
  } else {
    qualityMultiplier = 0.9;
  }

  const averageRating = parseFloat((3.5 + (index % 15) * 0.1).toFixed(1));
  const campusSize = parseFloat((15 + (index % 10) * 45).toFixed(1));
  const hostelAvailable = (index % 8) !== 0;

  const avgPackage = parseFloat(((item.ownership === "Public" ? 6 : 4) * qualityMultiplier + (index % 5) * 0.6).toFixed(1));
  const highestPackage = parseFloat((avgPackage * (2.5 + (index % 4) * 0.8)).toFixed(1));
  const placementPercent = parseFloat((70 + (index % 10) * 2.8).toFixed(1));

  const description = `Established as a premier destination for higher education, ${item.name} offers state-of-the-art infrastructure, a highly experienced faculty board, and a vibrant community. The institution is known for its rigorous academic curriculum and extensive research opportunities, fostering professional growth. Student life is enriched by numerous technical, cultural, and sports clubs. Placements are consistently robust, with top MNCs and domestic conglomerates recruiting on campus annually.`;

  // Assign correct images based on college name/type
  let image = "";
  if (item.name.includes("IIT") || item.name.includes("Technology") || item.name.includes("Engineering")) {
    image = "/ai_signal/images/iit_campus.png";
  } else if (item.name.includes("IIM") || item.name.includes("Management") || item.name.includes("Business")) {
    image = "/ai_signal/images/iim_campus.png";
  } else if (item.ownership === "Private") {
    image = "/ai_signal/images/private_uni.png";
  } else {
    image = "/ai_signal/images/heritage_college.png";
  }

  const gallery = [
    "/ai_signal/images/iit_campus.png",
    "/ai_signal/images/iim_campus.png",
    "/ai_signal/images/private_uni.png",
    "/ai_signal/images/heritage_college.png"
  ].filter(img => img !== image).slice(0, 3);

  let courseTemplates = [];
  if (item.type === "Engineering") {
    courseTemplates = COURSE_TEMPLATES.Engineering;
  } else if (item.type === "Management") {
    courseTemplates = COURSE_TEMPLATES.Management;
  } else {
    courseTemplates = [...COURSE_TEMPLATES.Science, ...COURSE_TEMPLATES.Arts];
  }

  let minFee = Infinity;
  let maxFee = 0;

  const courses = courseTemplates.map((courseTpl, cIdx) => {
    let multiplier = qualityMultiplier;
    if (item.ownership === "Public") {
      multiplier = qualityMultiplier * 0.4;
    } else {
      multiplier = qualityMultiplier * 1.5;
    }
    
    const annualFee = Math.round((courseTpl.feeBase * multiplier) / 1000) * 1000;
    if (annualFee < minFee) minFee = annualFee;
    if (annualFee > maxFee) maxFee = annualFee;

    return {
      id: `${id}-course-${cIdx + 1}`,
      name: courseTpl.name,
      duration: courseTpl.duration,
      feesAnnual: annualFee,
      type: item.type,
      seats: courseTpl.seats
    };
  });

  const placements = [2023, 2024, 2025].map((year) => {
    const yearMultiplier = year === 2023 ? 0.9 : year === 2024 ? 0.95 : 1.0;
    
    const recOffset = (index + year) % RECRUITERS.length;
    const recruitersSlice = [
      RECRUITERS[recOffset % RECRUITERS.length],
      RECRUITERS[(recOffset + 2) % RECRUITERS.length],
      RECRUITERS[(recOffset + 4) % RECRUITERS.length],
      RECRUITERS[(recOffset + 6) % RECRUITERS.length],
      RECRUITERS[(recOffset + 8) % RECRUITERS.length],
    ];

    return {
      id: `${id}-placement-${year}`,
      year,
      avgPackage: parseFloat((avgPackage * yearMultiplier).toFixed(1)),
      highestPackage: parseFloat((highestPackage * yearMultiplier).toFixed(1)),
      placementRate: parseFloat(Math.min(99, placementPercent * yearMultiplier).toFixed(1)),
      topRecruiters: recruitersSlice
    };
  });

  const reviews = [
    { name: "Aarav Sharma", rRating: 4.8 },
    { name: "Ananya Patel", rRating: 4.2 },
    { name: "Rahul Nair", rRating: 4.0 }
  ].map((mockUser, rIdx) => {
    const tplIdx = (index + rIdx) % REVIEW_TEMPLATES.length;
    const reviewTpl = REVIEW_TEMPLATES[tplIdx];
    return {
      id: `${id}-review-${rIdx + 1}`,
      rating: parseFloat(Math.max(1.0, Math.min(5.0, mockUser.rRating + (index % 3) * 0.1)).toFixed(1)),
      comment: reviewTpl.comment,
      isVerified: (index + rIdx) % 2 === 0,
      createdAt: new Date(Date.now() - rIdx * 24 * 60 * 60 * 1000).toISOString(),
      user: { name: mockUser.name }
    };
  });

  const computedRating = parseFloat(
    (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
  );

  return {
    id,
    name: item.name,
    slug,
    description,
    city: location.city,
    state: location.state,
    ownershipType: item.ownership,
    rating: computedRating,
    feesMin: minFee,
    feesMax: maxFee,
    placementPercent,
    avgPackage,
    highestPackage,
    campusSize,
    hostelAvailable,
    image,
    gallery,
    courses,
    placements,
    reviews
  };
});

// Helper for filtering, sorting and paging in-memory
export function getMockColleges(params: any) {
  const q = params.q?.toLowerCase() || '';
  const state = params.state || '';
  const city = params.city || '';
  const feesMax = params.feesMax ? parseInt(params.feesMax, 10) : null;
  const rating = params.rating ? parseFloat(params.rating) : null;
  const courseType = params.courseType || '';
  const ownershipType = params.ownershipType || '';
  const sortBy = params.sortBy || 'rating';
  const page = parseInt(params.page || '1', 10);
  const limit = parseInt(params.limit || '10', 10);

  let filtered = [...mockColleges];

  // 1. Text search (matches college name, city, state, course names, and stream types!)
  if (q) {
    filtered = filtered.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        c.state.toLowerCase().includes(q) ||
        c.courses.some(
          (course: any) =>
            course.name.toLowerCase().includes(q) ||
            course.type.toLowerCase().includes(q)
        )
    );
  }

  // 2. Filters
  if (state) {
    filtered = filtered.filter((c) => c.state.toLowerCase() === state.toLowerCase());
  }
  if (city) {
    filtered = filtered.filter((c) => c.city.toLowerCase() === city.toLowerCase());
  }
  if (ownershipType) {
    filtered = filtered.filter((c) => c.ownershipType.toLowerCase() === ownershipType.toLowerCase());
  }
  if (rating !== null) {
    filtered = filtered.filter((c) => c.rating >= rating);
  }
  if (feesMax !== null) {
    filtered = filtered.filter((c) => c.feesMin <= feesMax);
  }
  if (courseType) {
    filtered = filtered.filter((c) => 
      c.courses.some((course: any) => course.type.toLowerCase() === courseType.toLowerCase())
    );
  }

  // 3. Sorting
  if (sortBy === 'feesAsc') {
    filtered.sort((a, b) => a.feesMin - b.feesMin);
  } else if (sortBy === 'feesDesc') {
    filtered.sort((a, b) => b.feesMax - a.feesMax);
  } else if (sortBy === 'placements') {
    filtered.sort((a, b) => b.avgPackage - a.avgPackage);
  } else {
    // rating default
    filtered.sort((a, b) => b.rating - a.rating);
  }

  // Paginate
  const total = filtered.length;
  const skip = (page - 1) * limit;
  const paginatedColleges = filtered.slice(skip, skip + limit);

  // Extract unique locations list
  const states = Array.from(new Set(mockColleges.map((c) => c.state))).sort();
  const cities = Array.from(new Set(mockColleges.map((c) => c.city))).sort();

  return {
    colleges: paginatedColleges,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
    metadata: {
      states,
      cities,
    },
  };
}

export function getMockCollegeByIdOrSlug(idOrSlug: string) {
  const college = mockColleges.find((c) => c.id === idOrSlug || c.slug === idOrSlug);
  if (!college) return null;

  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  college.reviews.forEach((review: any) => {
    const rounded = Math.round(review.rating) as 1 | 2 | 3 | 4 | 5;
    if (rounded >= 1 && rounded <= 5) distribution[rounded]++;
  });

  const totalReviews = college.reviews.length;
  const ratingDistribution = Object.entries(distribution).map(([stars, count]) => ({
    stars: parseInt(stars, 10),
    count,
    percentage: totalReviews > 0 ? parseFloat(((count / totalReviews) * 100).toFixed(1)) : 0,
  })).reverse();

  return {
    college,
    ratingSummary: {
      averageRating: college.rating,
      totalReviews,
      distribution: ratingDistribution,
    },
  };
}

export function mockSignup(name: string, email: string, passwordHash: string) {
  const existing = mockUsers.find((u) => u.email === email);
  if (existing) return null;

  const user = {
    id: `mock-user-${mockUsers.length + 1}`,
    name,
    email,
    passwordHash,
    createdAt: new Date().toISOString(),
  };
  mockUsers.push(user);
  return user;
}

export function mockLogin(email: string) {
  return mockUsers.find((u) => u.email === email) || null;
}

export function getMockSavedColleges(userId: string) {
  const ids = mockBookmarks[userId] || [];
  const colleges = mockColleges.filter((c) => ids.includes(c.id));
  return colleges;
}

export function mockSaveCollege(userId: string, collegeId: string) {
  if (!mockBookmarks[userId]) {
    mockBookmarks[userId] = [];
  }
  if (!mockBookmarks[userId].includes(collegeId)) {
    mockBookmarks[userId].push(collegeId);
  }
  return true;
}

export function mockRemoveSavedCollege(userId: string, collegeId: string) {
  if (mockBookmarks[userId]) {
    mockBookmarks[userId] = mockBookmarks[userId].filter((id) => id !== collegeId);
  }
  return true;
}
