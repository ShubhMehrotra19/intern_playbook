const mongoose = require('mongoose');

// Schema Definition (Simplified for valid script)
const TaskSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        domain: {
            type: String,
            enum: ['HR', 'Program', 'IT', 'Sales', 'RM'],
            required: true,
        },
        link: { type: String },
        tips: { type: String },
        images: [{ type: String }],
        video: { type: String },
        xpReward: { type: Number, default: 100 },
    },
    { timestamps: true }
);

const Task = mongoose.models.Task || mongoose.model('Task', TaskSchema);

// Data provided by user for "Program" domain
const allTasks = [
    {
        id: 1,
        name: "Complete Formalities on Darwin Box",
        category: "HR",
        xp: 30,
        order: 1,
        resources: [
            "Visit Darwin Box portal with your employee credentials",
            "Fill in employee information completely",
            "Complete background verification process",
            "Ensure all documents are uploaded"
        ],
        links: [],
        contact: null
    },
    {
        id: 2,
        name: "Access - Slack",
        category: "Access",
        xp: 25,
        order: 2,
        resources: [
            "Join Scaler Slack workspace using invite link",
            "Set up your profile with photo and bio",
            "Install Slack desktop app on your machine",
            "Install Slack mobile app on your phone",
            "Explore key channels (#general, #announcements)"
        ],
        links: [],
        contact: null
    },
    {
        id: 3,
        name: "Access - Google Drive",
        category: "Access",
        xp: 25,
        order: 3,
        resources: [
            "Accept Google Drive access invitation from HRBP",
            "Verify you can access shared folders",
            "Check for onboarding materials folder",
            "Set up any necessary Drive shortcuts"
        ],
        links: [],
        contact: "Check email for invitation link"
    },
    {
        id: 4,
        name: "Basics of Communication",
        category: "Scaler Overview",
        xp: 40,
        order: 4,
        resources: [
            "Review communication guidelines document",
            "Understand async vs sync communication at Scaler",
            "Learn response time expectations",
            "Practice clear and concise writing"
        ],
        links: [
            { text: "Communication 101 Document", url: "https://docs.google.com/document/d/1vUB6ybKtIO2-KKpy820zscu9uYovwRzQbRc52dz9MNA/edit" }
        ],
        contact: null
    },
    {
        id: 5,
        name: "Contact HRBP & initiate ID card steps",
        category: "HR",
        xp: 35,
        order: 5,
        resources: [
            "Reach out to Anushka Jain (HRBP)",
            "Provide high-quality ID photo",
            "Complete ID card form with correct details",
            "Verify delivery address for card"
        ],
        links: [],
        contact: "Anushka Jain - anushka.jain@scaler.com"
    },
    {
        id: 6,
        name: "Scaler Neovarsity",
        category: "Scaler Overview",
        xp: 30,
        order: 6,
        resources: [
            "Explore Scaler Neovarsity platform",
            "Understand curriculum offerings",
            "Browse available course materials",
            "Familiarize with course structure"
        ],
        links: [
            { text: "Scaler Neovarsity", url: "https://www.scaler.com/neovarsity/" }
        ],
        contact: null
    },
    {
        id: 7,
        name: "Familiarization of Google Sheets",
        category: "Toolkit",
        xp: 20,
        order: 7,
        resources: [
            "Learn basic spreadsheet functions and formulas",
            "Practice with sample data provided",
            "Understand pivot tables and data filtering",
            "Learn VLOOKUP and conditional formatting",
            "Practice data visualization in sheets"
        ],
        links: [
            { text: "Google Sheets Tutorial for Beginners - YouTube", url: "https://www.youtube.com/watch?v=TENAbUa-R-w" }
        ],
        contact: null
    },
    {
        id: 8,
        name: "Kapture Introduction",
        category: "Toolkit",
        xp: 25,
        order: 8,
        resources: [
            "Attend onboarding session with Shubham Swarnkar",
            "Learn how to use Kapture call recording system",
            "Understand quality metrics and recording process",
            "Practice with demo calls",
            "Set up your Kapture profile"
        ],
        links: [],
        contact: "Shubham Swarnkar - shubham.swarnkar@scaler.com"
    },
    {
        id: 9,
        name: "Shadow 30 RM Calls",
        category: "Execution",
        xp: 50,
        order: 9,
        resources: [
            "Schedule shadowing calls with experienced RMs",
            "Observe customer interaction techniques",
            "Take notes on best practices and patterns",
            "Learn objection handling techniques",
            "Understand sales process and pipeline"
        ],
        links: [],
        contact: "Coordinate through Zentrix system"
    },
    {
        id: 10,
        name: "Problem Solving 101",
        category: "Execution",
        xp: 45,
        order: 10,
        resources: [
            "Review advanced problem-solving frameworks",
            "Understand first-principles thinking",
            "Practice with real case studies",
            "Develop structured solution approach",
            "Learn to break down complex problems"
        ],
        links: [
            { text: "Advance Problem Solving Document", url: "https://docs.google.com/spreadsheets/d/1tBrXxr9Y0tF9LNx9WlK84Ju0cSw3hPS6mN8T0CPQ55k/edit" }
        ],
        contact: null
    },
    {
        id: 11,
        name: "Data Analysis: User Segmentation",
        category: "Execution",
        xp: 40,
        order: 11,
        resources: [
            "Analyze user behavior data provided",
            "Create meaningful user segments",
            "Use Metabase for data querying",
            "Document insights and findings",
            "Present analysis to team"
        ],
        links: [
            { text: "Analysis: User Segmentation Spreadsheet", url: "https://docs.google.com/spreadsheets/d/1A3ZwhlM6jLQABN3bnMhRF3Knkij6vpfDQl8wooG8gIY/edit" }
        ],
        contact: null
    },
    {
        id: 12,
        name: "Metabase & Power BI",
        category: "Execution",
        xp: 40,
        order: 12,
        resources: [
            "Learn dashboard creation in Metabase",
            "Understand data visualization best practices",
            "Connect data sources to dashboards",
            "Create key performance indicator (KPI) visualizations",
            "Learn Power BI fundamentals and integration"
        ],
        links: [],
        contact: "Training session with Akash Deep - akash.deep01@scaler.com"
    },
    {
        id: 13,
        name: "Go through learner dashboard",
        category: "Learner Understanding",
        xp: 25,
        order: 13,
        resources: [
            "Explore learner dashboard interface",
            "Understand key metrics and their meaning",
            "Learn to interpret learner progress data",
            "Understand engagement indicators",
            "Learn dashboard customization options"
        ],
        links: [],
        contact: "Schedule walkthrough with Vagesh Garg - vagesh.garg@scaler.com"
    },
    {
        id: 14,
        name: "Program Flow review",
        category: "Learner Understanding",
        xp: 20,
        order: 14,
        resources: [
            "Study the complete program flow diagram",
            "Understand all touchpoints in the program",
            "Learn milestone structure and requirements",
            "Understand success criteria",
            "Map your role in the program"
        ],
        links: [
            { text: "Program Flow Diagram - Whimsical", url: "https://whimsical.com/program-flow-TKfSUhLoyfbgTW7oDfJr3P" }
        ],
        contact: null
    },
    {
        id: 15,
        name: "Problem Statement Worksheet",
        category: "Gold Standard",
        xp: 35,
        order: 15,
        resources: [
            "Complete the problem statement worksheet",
            "Define the user problem clearly",
            "Outline your solution approach",
            "Identify success metrics",
            "Submit for feedback"
        ],
        links: [
            { text: "Problem Statement Worksheet", url: "https://docs.google.com/spreadsheets/d/1iO-zhkYvIMSqjzXLP-XF5AJ5Ox2pc1T1EVb6Ktg2ARg/edit" }
        ],
        contact: null
    },
    {
        id: 16,
        name: "Presentation: Project Kick Off",
        category: "Gold Standard",
        xp: 30,
        order: 16,
        resources: [
            "Prepare project kick-off presentation",
            "Align on project deliverables and timeline",
            "Present to team and stakeholders",
            "Incorporate feedback",
            "Finalize project scope and objectives"
        ],
        links: [
            { text: "Project Kick Off Presentation Template", url: "https://docs.google.com/presentation/d/1nTK3KjpnKS1aQ_WgjI2NHNjRg53hGD3K/edit" }
        ],
        contact: null
    },
    {
        id: 17,
        name: "Understanding CMT and HireTest",
        category: "Gold Standard",
        xp: 15,
        order: 17,
        resources: [
            "Learn about CMT (Course Management Tool)",
            "Understand HireTest platform functionalities",
            "Understand creation of assignment and questions",
            "Familiarize with scoring and feedback process",
        ],
        links: [
            { text: "CMT Working Guide", url: "https://drive.google.com/drive/folders/1kxTQQD3n1JlXfDZKlRXnxg1lLD3PjU2_?usp=sharing" }
        ],
        contact: null
    }
];

async function seed() {
    if (!process.env.MONGO_URI) {
        console.error("MONGO_URI is missing");
        process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");

    // All these tasks are assigned to the 'Program' domain to ensure they are visible to Program interns.
    // The previous category field is ignored for domain assignment but kept in tips if needed (omitted here for cleanliness).

    const tasksToInsert = allTasks.map(t => {
        let tips = t.resources.join('\n');
        if (t.contact) {
            tips += `\n\nContact: ${t.contact}`;
        }

        return {
            name: t.name,
            domain: 'Program',
            xpReward: t.xp,
            tips: tips,
            link: t.links.length > 0 ? t.links[0].url : '',
            images: [],
            video: ''
        };
    });

    try {
        // Delete existing Program assigned tasks to avoid clutter/duplicates when reseeding
        await Task.deleteMany({ domain: 'Program' });
        await Task.insertMany(tasksToInsert);
        console.log(`Seeded ${tasksToInsert.length} tasks for Program domain successfully.`);
    } catch (e) {
        console.error(e);
    } finally {
        mongoose.disconnect();
    }
}

seed();
