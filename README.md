# ThinkFlow ✨📚 - AI-Powered Document Research Generator

![alt text](src/app/opengraph-image.png)

Generate comprehensive research documents instantly with the power of AI. Whether you're a student, researcher, or professional, ThinkFlow simplifies the research process and saves you time.

## ✨ Features

- 🧠 **AI-Powered Research** - Generate comprehensive research documents using cutting-edge AI models
- 📝 **Customizable Outlines** - Create and edit document outlines to match your specific research needs
- 🎯 **Academic Precision** - Tailor content to different academic levels from high school to doctoral
- 📊 **Multiple Export Formats** - Export your research as DOCX or PDF with proper formatting
- 🌓 **Dark/Light Mode** - Comfortable viewing experience in any lighting condition
- 🔄 **Multi-Key Rotation** - Automatic API key rotation with intelligent fallback
- 🚀 **Built with Next.js 15** - Utilizing the latest web technologies for optimal performance

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router & Turbopack
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) for utility-first styling
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) for beautiful, accessible components
- **AI Integration**: [AI SDK](https://sdk.vercel.ai/docs) with Groq (LLaMA 3.3 70B) & ZenMux (GLM-4.7 Flash) fallback
- **Animations**: [Motion](https://motion.dev/) for smooth transitions
- **Document Generation**: DOCX and PDF export capabilities

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or newer)
- npm, yarn, or bun

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/KumarADITHYA123/Think-Flow.git
   cd Think-Flow
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```

3. Create a `.env` file in the root directory with your API keys:

   ```env
   GROQ_API_KEYS=your_groq_key_1,your_groq_key_2
   ZENMUX_API_KEY=your_zenmux_api_key
   ZENMUX_BASE_URL=https://zenmux.ai/api/v1
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📋 How It Works

1. **Enter Research Parameters** - Specify your topic, academic level, and document length
2. **Review & Customize Outline** - Edit the AI-generated outline to fit your needs
3. **Generate Content** - Let AI create detailed content for each section
4. **Preview & Export** - Review the final document and export in your preferred format

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to help improve ThinkFlow.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Contact

Created by **Kumar Adithya Bathula**

- 🔗 [GitHub](https://github.com/kumarADITHYA123/)
- 💼 [LinkedIn](https://www.linkedin.com/in/kumar-adithya-bathula-781938371/)

---

<div align="center">
  <p>⭐ Star this repository if you find it useful! ⭐</p>
  <p>Made with ❤️ using Next.js and AI</p>
</div>
