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

const allTasks = [
    {
        id: 1,
        name: "Complete Formalities on Darwin Box",
        category: "HR",
        xp: 30,
        resources: [
            "Visit Darwin Box portal with your employee credentials",
            "Fill in employee information completely",
            "Complete background verification process",
            "Ensure all documents are uploaded"
        ],
        links: [],
    },
    {
        id: 2,
        name: "Access - Slack",
        category: "IT",
        xp: 25,
        resources: [
            "Join Scaler Slack workspace using invite link",
            "Set up your profile with photo and bio",
            "Install Slack desktop app on your machine",
            "Install Slack mobile app on your phone",
            "Explore key channels (#general, #announcements)"
        ],
        links: [],
    },
    {
        id: 3,
        name: "Access - Google Drive",
        category: "IT",
        xp: 25,
        resources: [
            "Accept Google Drive access invitation from HRBP",
            "Verify you can access shared folders",
            "Check for onboarding materials folder",
            "Set up any necessary Drive shortcuts"
        ],
        links: [],
    },
    {
        id: 4,
        name: "Basics of Communication",
        category: "Program",
        xp: 40,
        resources: [
            "Review communication guidelines document",
            "Understand async vs sync communication at Scaler",
            "Learn response time expectations",
            "Practice clear and concise writing"
        ],
        links: [
            { text: "Communication 101 Document", url: "https://docs.google.com/document/d/1vUB6ybKtIO2-KKpy820zscu9uYovwRzQbRc52dz9MNA/edit" }
        ],
    },
    {
        id: 5,
        name: "Contact HRBP & initiate ID card steps",
        category: "HR",
        xp: 35,
        resources: [
            "Reach out to Anushka Jain (HRBP)",
            "Provide high-quality ID photo",
            "Complete ID card form with correct details",
            "Verify delivery address for card"
        ],
        links: [],
    },
    {
        id: 6,
        name: "Scaler Neovarsity",
        category: "Program",
        xp: 30,
        resources: [
            "Explore Scaler Neovarsity platform",
            "Understand curriculum offerings",
            "Browse available course materials",
            "Familiarize with course structure"
        ],
        links: [
            { text: "Scaler Neovarsity", url: "https://www.scaler.com/neovarsity/" }
        ],
    },
    {
        id: 7,
        name: "Familiarization of Google Sheets",
        category: "Program",
        xp: 20,
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
    },
    {
        id: 8,
        name: "Kapture Introduction",
        category: "Sales",
        xp: 25,
        resources: [
            "Attend onboarding session with Shubham Swarnkar",
            "Learn how to use Kapture call recording system",
            "Understand quality metrics and recording process",
            "Practice with demo calls",
            "Set up your Kapture profile"
        ],
        links: [],
    },
    {
        id: 9,
        name: "Shadow 30 RM Calls",
        category: "RM",
        xp: 50,
        resources: [
            "Schedule shadowing calls with experienced RMs",
            "Observe customer interaction techniques",
            "Take notes on best practices and patterns",
            "Learn objection handling techniques",
            "Understand sales process and pipeline"
        ],
        links: [],
    },
    {
        id: 10,
        name: "Problem Solving 101",
        category: "Program",
        xp: 45,
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
    },
    {
        id: 11,
        name: "Data Analysis: User Segmentation",
        category: "Program",
        xp: 40,
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
    },
    {
        id: 12,
        name: "Metabase & Power BI",
        category: "Program",
        xp: 40,
        resources: [
            "Learn dashboard creation in Metabase",
            "Understand data visualization best practices",
            "Connect data sources to dashboards",
            "Create key performance indicator (KPI) visualizations",
            "Learn Power BI fundamentals and integration"
        ],
        links: [],
    },
    {
        id: 13,
        name: "Go through learner dashboard",
        category: "Program",
        xp: 25,
        resources: [
            "Explore learner dashboard interface",
            "Understand key metrics and their meaning",
            "Learn to interpret learner progress data",
            "Understand engagement indicators",
            "Learn dashboard customization options"
        ],
        links: [],
    },
    {
        id: 14,
        name: "Program Flow review",
        category: "Program",
        xp: 20,
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
    },
    {
        id: 15,
        name: "Problem Statement Worksheet",
        category: "Program",
        xp: 35,
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
    },
    {
        id: 16,
        name: "Presentation: Project Kick Off",
        category: "Program",
        xp: 30,
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
    },
    {
        id: 17,
        name: "Understanding CMT and HireTest",
        category: "Program",
        xp: 15,
        resources: [
            "Learn about CMT (Course Management Tool)",
            "Understand HireTest platform functionalities",
            "Understand creation of assignment and questions",
            "Familiarize with scoring and feedback process",
        ],
        links: [
            { text: "CMT Working Guide", url: "https://drive.google.com/drive/folders/1kxTQQD3n1JlXfDZKlRXnxg1lLD3PjU2_?usp=sharing" }
        ],
    }
];

async function seed() {
    if (!process.env.MONGO_URI) {
        console.error("MONGO_URI is missing");
        process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");

    // Mapping custom categories user provided to standard domains if needed, 
    // or just assume categories match Domain enum: HR, Program, IT, Sales, RM
    // User data mixed categories like "Access", "Scaler Overview". 
    // I will map them as follows:
    // HR -> HR
    // Access -> IT
    // Scaler Overview -> Program (or HR, but Program seems fitting for general onboarding)
    // Execution -> Program (User explicitly said "put this data inside the program tasks")
    // Toolkit -> Program
    // Learner Understanding -> Program
    // Gold Standard -> Program
    // Sales -> Sales
    // RM -> RM

    // WAIT: The user said "put this data inside the PROGRAM tasks". 
    // That likely refers to the 'Program' PoD domain onboarding.
    // But the data itself has 'category' keys.
    // I will map 'HR' to 'HR' domain, 'IT'/'Access' to 'IT' domain, 'Sales' to 'Sales' domain, 'RM' to 'RM' domain.
    // And everything else to 'Program' domain as requested or default.

    // Actually, looking at the list, most are specifically for Program Interns (Analytis, Problem Solving etc).
    // Let's seed them primarily as Program tasks unless clearly other domains.
    // Or better, I will respect the 'category' field mapping to domains where it matches, ensuring they show up in dashboards.

    const tasksToInsert = allTasks.map(t => {
        let domain = 'Program'; // Default
        const cat = t.category;

        if (cat === 'HR') domain = 'HR';
        if (cat === 'Access') domain = 'IT';
        if (cat === 'Sales') domain = 'Sales';
        if (cat === 'RM' || t.name.includes("RM Calls")) domain = 'RM';
        if (t.name.includes("Kapture")) domain = 'Sales'; // Kapture is sales tool

        // Override: Force "Scaler Overview", "Toolkit", "Execution", "Learner Understanding", "Gold Standard" to Program
        // if they are generic enough. 
        // Actually, "Access - Slack" is IT. "Access - Drive" is IT.
        // The user prompted "put this data inside the program tasks".
        // This might mean "For the Program PoD".
        // IF I put them all in 'Program', other interns won't see HR/IT tasks.
        // But HR/IT tasks are common.
        // Let's create copies for all domains for common tasks? No, too complex.

        // STRATEGY: 
        // 1. HR tasks -> HR domain
        // 2. IT tasks -> IT domain
        // 3. Sales tasks -> Sales domain
        // 4. Everything else -> Program domain

        return {
            name: t.name,
            domain: domain,
            xpReward: t.xp,
            tips: t.resources.join('\n'), // bullet points as tips
            link: t.links.length > 0 ? t.links[0].url : '',
            images: [],
            video: ''
        };
    });

    try {
        await Task.deleteMany({ name: { $in: tasksToInsert.map(t => t.name) } }); // prevent duplicates
        await Task.insertMany(tasksToInsert);
        console.log(`Seeded ${tasksToInsert.length} tasks successfully.`);
    } catch (e) {
        console.error(e);
    } finally {
        mongoose.disconnect();
    }
}

seed();
