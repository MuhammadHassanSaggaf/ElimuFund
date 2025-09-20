export const dummyStudents = [
  {
    id: 1,
    full_name: "Alice Wanjiku",
    academic_level: "Form 2",
    school_name: "Starehe Girls Centre",
    fee_amount: 45000,
    amount_raised: 32000,
    story:
      "Alice is a bright student from Mathare slums who dreams of becoming a doctor. Despite financial challenges, she consistently ranks top 3 in her class. Her mother works as a house help to support Alice and her two younger siblings. Alice needs support to continue her secondary education and achieve her dream of joining medical school.",
    profile_image: "/api/placeholder/300/300",
    grade_reports: ["Term 1: Position 2/40", "Term 2: Position 1/40"],
    verified: true,
  },
  {
    id: 2,
    full_name: "John Kimani",
    academic_level: "Form 4",
    school_name: "Mang'u High School",
    fee_amount: 38000,
    amount_raised: 15000,
    story:
      "John is a talented student passionate about engineering. He comes from a single-parent household in Kibera. His determination and academic excellence have earned him a place in one of Kenya's top schools, but financial constraints threaten his education.",
    profile_image: "/api/placeholder/300/300",
    grade_reports: ["Term 1: Position 5/45", "Term 2: Position 3/45"],
    verified: true,
  },
  {
    id: 3,
    full_name: "Grace Achieng",
    academic_level: "Form 1",
    school_name: "Alliance Girls High School",
    fee_amount: 42000,
    amount_raised: 8000,
    story:
      "Grace is a brilliant young girl who scored 410 marks in KCPE despite studying under a kerosene lamp. She dreams of becoming a lawyer to help her community. Grace's father is a casual laborer and her mother sells vegetables at the local market.",
    profile_image: "/api/placeholder/300/300",
    grade_reports: ["Term 1: Position 7/42"],
    verified: true,
  },
];

export const verificationQueue = [
  {
    id: 1,
    name: "Mary Njeri",
    school: "Kagumo High School",
    status: "pending",
  },
  { id: 2, name: "Peter Ochieng", school: "Maseno School", status: "pending" },
];

export const disbursementQueue = [
  {
    id: 1,
    student: "Alice Wanjiku",
    amount: 15000,
    school: "Starehe Girls Centre",
    status: "ready",
  },
  {
    id: 2,
    student: "John Kimani",
    amount: 8000,
    school: "Mang'u High School",
    status: "processing",
  },
];
