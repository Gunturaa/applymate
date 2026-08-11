# ApplyMate - Job Application Tracker

ApplyMate is a modern, responsive web application designed to help job seekers organize, track, and optimize their job search process. Built with Next.js 15, Supabase, and AI capabilities, it acts as your personal job-hunting dashboard.

## 🚀 Key Features

*   **📊 Comprehensive Dashboard**: Get a birds-eye view of your job search progress, upcoming interviews, and recent applications.
*   **📋 Kanban Board**: Drag and drop your job applications across different stages (Wishlist, Applied, Assessment, Interview, Offer, Rejected) for intuitive tracking.
*   **🤖 AI Assistant (Powered by Gemini)**: 
    *   Generate custom cover letters.
    *   Receive tailored interview preparation questions based on the job role.
    *   Get resume optimization tips.
*   **📈 Analytics & Insights**: Visualize your interview rates, offer rates, and application trends over time using interactive charts.
*   **📅 Interview Calendar**: Never miss an interview with the built-in calendar view.
*   **🌐 Multi-Language Support (i18n)**: Fully supports both **English** and **Bahasa Indonesia** with seamless runtime switching.
*   **🌓 Dark/Light Mode**: First-class support for dark mode, respecting system preferences.

## 🛠️ Tech Stack

*   **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Server Actions)
*   **Database & Auth**: [Supabase](https://supabase.com/)
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
*   **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Drag & Drop**: `@hello-pangea/dnd`
*   **Charts**: `recharts`
*   **AI Integration**: Google Gemini SDK (`@google/genai`)

## 💻 Getting Started

### Prerequisites

*   Node.js (v18 or higher)
*   npm, yarn, or pnpm
*   A Supabase Project
*   A Google Gemini API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Gunturaa/applymate.git
   cd applymate
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` file in the root directory and add the following keys:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📱 Responsive Design
ApplyMate is fully responsive and optimized for mobile devices, featuring a sliding mobile menu and adaptable layouts for seamless usage on the go.

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
