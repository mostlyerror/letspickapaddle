import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const quizQuestions = [
  {
    questionKey: 'skill_level',
    questionText: 'What is your current skill level?',
    questionType: 'single',
    displayOrder: 1,
    options: JSON.stringify([
      { value: 'beginner', label: 'Beginner', description: 'Just starting out, learning the basics' },
      { value: 'intermediate', label: 'Intermediate', description: '1-2 years experience, comfortable with rallies' },
      { value: 'advanced', label: 'Advanced', description: '2+ years, competitive play' },
      { value: 'pro', label: 'Pro/Tournament', description: 'Tournament level player' },
    ]),
    weightMappings: JSON.stringify({
      beginner: { control: 1.5, sweetSpot: 'large', weight: 'light' },
      intermediate: { control: 1.2, power: 1.2 },
      advanced: { power: 1.3, spin: 1.3 },
      pro: { power: 1.5, spin: 1.5, control: 1.4 },
    }),
  },
  {
    questionKey: 'play_style',
    questionText: 'How would you describe your play style?',
    questionType: 'single',
    displayOrder: 2,
    options: JSON.stringify([
      { value: 'power', label: 'Power Player', description: 'Aggressive drives and smashes' },
      { value: 'control', label: 'Control Player', description: 'Placement and finesse shots' },
      { value: 'all_around', label: 'All-Around', description: 'Balanced approach' },
      { value: 'defensive', label: 'Defensive', description: 'Counter-punching and consistent' },
    ]),
    weightMappings: JSON.stringify({
      power: { power: 2.0, shape: 'elongated' },
      control: { control: 2.0, sweetSpot: 'large' },
      all_around: { power: 1.3, control: 1.3, spin: 1.3 },
      defensive: { control: 1.8, sweetSpot: 'large' },
    }),
  },
  {
    questionKey: 'shot_preference',
    questionText: 'Which shots do you rely on most?',
    questionType: 'multi',
    displayOrder: 3,
    options: JSON.stringify([
      { value: 'dinks', label: 'Dinks & Soft Game' },
      { value: 'drives', label: 'Drives & Groundstrokes' },
      { value: 'serves', label: 'Powerful Serves' },
      { value: 'volleys', label: 'Net Volleys' },
      { value: 'spins', label: 'Spin Shots' },
    ]),
    weightMappings: JSON.stringify({
      dinks: { control: 1.5 },
      drives: { power: 1.5 },
      serves: { power: 1.3, shape: 'elongated' },
      volleys: { control: 1.3, sweetSpot: 'large' },
      spins: { spin: 2.0, faceMaterial: 'carbon fiber' },
    }),
  },
  {
    questionKey: 'budget',
    questionText: 'What is your budget range?',
    questionType: 'single',
    displayOrder: 4,
    options: JSON.stringify([
      { value: 'budget', label: 'Under $100', description: 'Value options' },
      { value: 'mid_range', label: '$100-$150', description: 'Quality performance' },
      { value: 'premium', label: '$150-$200', description: 'High-end features' },
      { value: 'elite', label: '$200+', description: 'Professional grade' },
    ]),
    weightMappings: JSON.stringify({
      budget: { priceMax: 10000 },
      mid_range: { priceMin: 10000, priceMax: 15000 },
      premium: { priceMin: 15000, priceMax: 20000 },
      elite: { priceMin: 20000 },
    }),
  },
  {
    questionKey: 'physical_condition',
    questionText: 'Do you have any physical considerations?',
    questionType: 'multi',
    displayOrder: 5,
    options: JSON.stringify([
      { value: 'arm_issues', label: 'Arm/Elbow Issues' },
      { value: 'wrist_issues', label: 'Wrist Problems' },
      { value: 'shoulder_issues', label: 'Shoulder Pain' },
      { value: 'none', label: 'No Issues' },
    ]),
    weightMappings: JSON.stringify({
      arm_issues: { weight: 'light', coreMaterial: 'polymer' },
      wrist_issues: { weight: 'light', grip: 'smaller' },
      shoulder_issues: { weight: 'light', balance: 'head-light' },
      none: {},
    }),
  },
  {
    questionKey: 'grip_size',
    questionText: 'What grip circumference feels comfortable?',
    questionType: 'single',
    displayOrder: 6,
    options: JSON.stringify([
      { value: 'small', label: 'Small (4.0")', description: 'Smaller hands' },
      { value: 'medium', label: 'Medium (4.125" - 4.25")', description: 'Most common' },
      { value: 'large', label: 'Large (4.375" - 4.5")', description: 'Larger hands' },
      { value: 'unsure', label: 'Not Sure', description: "We'll recommend medium" },
    ]),
    weightMappings: JSON.stringify({
      small: { gripCircumference: 4.0 },
      medium: { gripCircumference: 4.25 },
      large: { gripCircumference: 4.5 },
      unsure: { gripCircumference: 4.25 },
    }),
  },
  {
    questionKey: 'weight_preference',
    questionText: 'How heavy do you prefer your paddle?',
    questionType: 'single',
    displayOrder: 7,
    options: JSON.stringify([
      { value: 'lightweight', label: 'Lightweight (7.3-7.8 oz)', description: 'Quick reactions' },
      { value: 'midweight', label: 'Midweight (7.9-8.2 oz)', description: 'Balanced' },
      { value: 'heavyweight', label: 'Heavyweight (8.3+ oz)', description: 'More power' },
      { value: 'no_preference', label: 'No Preference' },
    ]),
    weightMappings: JSON.stringify({
      lightweight: { weightMax: 7.8 },
      midweight: { weightMin: 7.9, weightMax: 8.2 },
      heavyweight: { weightMin: 8.3 },
      no_preference: {},
    }),
  },
  {
    questionKey: 'paddle_shape',
    questionText: 'Do you prefer a specific paddle shape?',
    questionType: 'single',
    displayOrder: 8,
    options: JSON.stringify([
      { value: 'standard', label: 'Standard', description: 'Balanced sweet spot and reach' },
      { value: 'elongated', label: 'Elongated', description: 'Extra reach and power' },
      { value: 'wide_body', label: 'Wide Body', description: 'Larger sweet spot' },
      { value: 'no_preference', label: 'No Preference' },
    ]),
    weightMappings: JSON.stringify({
      standard: { shape: 'standard' },
      elongated: { shape: 'elongated', power: 1.2 },
      wide_body: { shape: 'wide-body', sweetSpot: 'large' },
      no_preference: {},
    }),
  },
];

async function main() {
  console.log('Starting quiz seed...');

  // Clear existing questions
  await prisma.quizQuestion.deleteMany({});
  console.log('Cleared existing quiz questions');

  // Create quiz questions
  for (const question of quizQuestions) {
    await prisma.quizQuestion.create({
      data: question,
    });
    console.log(`Created question: ${question.questionText}`);
  }

  console.log(`Quiz seed completed! Created ${quizQuestions.length} questions.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
