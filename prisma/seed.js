const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Configuration lists for seeding
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

// Generates 105 realistic college names categorized by type
const COLLEGE_NAMES = [
  // 1-20: Premium engineering (IITs/NITs/BITS)
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

  // 21-40: Premium management (IIMs & Top Private MBA)
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

  // 41-70: Science, Commerce, Arts (Mixed Top Colleges)
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

  // 71-105: More engineering, science and private/regional colleges
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

async function main() {
  console.log("Starting Database Seeding...");

  // 1. Clean the database
  console.log("Cleaning database...");
  await prisma.savedCollege.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.placement.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.college.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Seed Mock Users
  console.log("Creating mock users...");
  const passwordHash = await bcrypt.hash("Password123!", 10);
  const users = [
    { email: "student1@gmail.com", name: "Aarav Sharma", passwordHash },
    { email: "student2@gmail.com", name: "Ananya Patel", passwordHash },
    { email: "student3@gmail.com", name: "Rahul Nair", passwordHash },
    { email: "student4@gmail.com", name: "Priya Rao", passwordHash },
    { email: "student5@gmail.com", name: "Ishaan Gupta", passwordHash }
  ];

  const dbUsers = [];
  for (const user of users) {
    const dbUser = await prisma.user.create({ data: user });
    dbUsers.push(dbUser);
  }

  // 3. Seed Colleges
  console.log(`Seeding ${COLLEGE_NAMES.length} colleges...`);
  
  let index = 0;
  for (const item of COLLEGE_NAMES) {
    // Determine location deterministically based on index to ensure even distribution
    const location = LOCATIONS[index % LOCATIONS.length];
    
    // Set up unique slug
    const cleanName = item.name.replace(/[^a-zA-Z0-9 ]/g, "").toLowerCase();
    const slug = cleanName.split(" ").filter(Boolean).join("-") + `-${index + 1}`;

    // Establish realistic pricing/quality multiplier based on name content
    let qualityMultiplier = 1.0;
    if (item.name.includes("IIT") || item.name.includes("IIM") || item.name.includes("BITS") || item.name.includes("XLRI") || item.name.includes("IISc")) {
      qualityMultiplier = 1.8;
    } else if (item.name.includes("NIT") || item.name.includes("DTU") || item.name.includes("FMS") || item.name.includes("SPJIMR") || item.name.includes("IIIT")) {
      qualityMultiplier = 1.4;
    } else if (item.ownership === "Private") {
      qualityMultiplier = 1.1; // Private colleges can have high fees but average packages
    } else {
      qualityMultiplier = 0.9;
    }

    // Determine values
    const averageRating = parseFloat((3.5 + Math.random() * 1.4).toFixed(1));
    const campusSize = parseFloat((15 + Math.random() * 450).toFixed(1));
    const hostelAvailable = Math.random() > 0.15; // 85% of campuses have hostels

    // Placement metrics estimation (LPA)
    const avgPackage = parseFloat(((item.ownership === "Public" ? 6 : 4) * qualityMultiplier + Math.random() * 3).toFixed(1));
    const highestPackage = parseFloat((avgPackage * (2.5 + Math.random() * 3.5)).toFixed(1));
    const placementPercent = parseFloat((70 + Math.random() * 28).toFixed(1));

    // Custom description
    const description = `Established as a premier destination for higher education, ${item.name} offers state-of-the-art infrastructure, a highly experienced faculty board, and a vibrant community. The institution is known for its rigorous academic curriculum and extensive research opportunities, fostering professional growth. Student life is enriched by numerous technical, cultural, and sports clubs. Placements are consistently robust, with top MNCs and domestic conglomerates recruiting on campus annually.`;

    // Assign correct images based on college name/type
    let image = "";
    if (item.name.includes("IIT") || item.name.includes("Technology") || item.name.includes("Engineering")) {
      image = "/images/iit_campus.png";
    } else if (item.name.includes("IIM") || item.name.includes("Management") || item.name.includes("Business")) {
      image = "/images/iim_campus.png";
    } else if (item.ownership === "Private") {
      image = "/images/private_uni.png";
    } else {
      image = "/images/heritage_college.png";
    }

    const gallery = [
      "/images/iit_campus.png",
      "/images/iim_campus.png",
      "/images/private_uni.png",
      "/images/heritage_college.png"
    ].filter(img => img !== image).slice(0, 3);

    // Create the College
    const college = await prisma.college.create({
      data: {
        name: item.name,
        slug,
        description,
        city: location.city,
        state: location.state,
        ownershipType: item.ownership,
        rating: averageRating,
        feesMin: 0, // Will update below
        feesMax: 0, // Will update below
        placementPercent,
        avgPackage,
        highestPackage,
        campusSize,
        hostelAvailable,
        image,
        gallery
      }
    });

    // 4. Create Courses for this College
    // Decide which courses to assign based on the type of college
    let coursesToCreate = [];
    if (item.type === "Engineering") {
      coursesToCreate = COURSE_TEMPLATES.Engineering;
    } else if (item.type === "Management") {
      coursesToCreate = COURSE_TEMPLATES.Management;
    } else {
      // General universities get Science, Arts, or both
      coursesToCreate = [
        ...COURSE_TEMPLATES.Science,
        ...COURSE_TEMPLATES.Arts
      ];
    }

    let minFee = Infinity;
    let maxFee = 0;

    for (const courseTpl of coursesToCreate) {
      // Apply pricing multiplier
      let multiplier = qualityMultiplier;
      if (item.ownership === "Public") {
        // Public colleges are cheaper
        multiplier = qualityMultiplier * 0.4;
      } else {
        // Private colleges are more expensive
        multiplier = qualityMultiplier * 1.5;
      }
      
      const annualFee = Math.round((courseTpl.feeBase * multiplier) / 1000) * 1000;
      
      if (annualFee < minFee) minFee = annualFee;
      if (annualFee > maxFee) maxFee = annualFee;

      await prisma.course.create({
        data: {
          collegeId: college.id,
          name: courseTpl.name,
          duration: courseTpl.duration,
          feesAnnual: annualFee,
          type: item.type,
          seats: courseTpl.seats
        }
      });
    }

    // 5. Create Placements records (3 years)
    for (const year of [2023, 2024, 2025]) {
      const yearMultiplier = year === 2023 ? 0.9 : year === 2024 ? 0.95 : 1.0;
      
      // Shuffle recruiters
      const shuffledRecruiters = [...RECRUITERS].sort(() => 0.5 - Math.random());
      const selectedRecruiters = shuffledRecruiters.slice(0, 5 + Math.floor(Math.random() * 5));

      await prisma.placement.create({
        data: {
          collegeId: college.id,
          year,
          avgPackage: parseFloat((avgPackage * yearMultiplier).toFixed(1)),
          highestPackage: parseFloat((highestPackage * yearMultiplier).toFixed(1)),
          placementRate: parseFloat(Math.min(99, placementPercent * yearMultiplier).toFixed(1)),
          topRecruiters: selectedRecruiters
        }
      });
    }

    // 6. Create Reviews (3-4 reviews per college)
    let totalReviewRating = 0;
    let reviewsCount = 0;
    const reviewShuffled = [...REVIEW_TEMPLATES].sort(() => 0.5 - Math.random());
    const selectedReviews = reviewShuffled.slice(0, 3 + Math.floor(Math.random() * 2));

    for (let rIdx = 0; rIdx < selectedReviews.length; rIdx++) {
      const reviewTpl = selectedReviews[rIdx];
      const mockUser = dbUsers[rIdx % dbUsers.length];
      
      // Introduce slight variability to review rating
      const actualRating = Math.max(1.0, Math.min(5.0, reviewTpl.rating + (Math.random() * 0.6 - 0.3)));
      const finalRating = parseFloat(actualRating.toFixed(1));

      totalReviewRating += finalRating;
      reviewsCount++;

      await prisma.review.create({
        data: {
          collegeId: college.id,
          userId: mockUser.id,
          rating: finalRating,
          comment: reviewTpl.comment,
          isVerified: Math.random() > 0.3 // 70% verified reviews
        }
      });
    }

    // 7. Update College overall computed metrics
    const finalRating = parseFloat((totalReviewRating / reviewsCount).toFixed(1));
    await prisma.college.update({
      where: { id: college.id },
      data: {
        feesMin: minFee === Infinity ? 0 : minFee,
        feesMax: maxFee === 0 ? 0 : maxFee,
        rating: finalRating
      }
    });

    index++;
  }

  console.log(`Seeding complete. Seeded ${index} colleges.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
