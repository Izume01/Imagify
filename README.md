# Imagify 🎨

Imagify is a modern, AI-powered image generation web application. It allows users to bring their creative ideas to life by generating unique visuals from simple text prompts. Built with Next.js and styled with Tailwind CSS, it features a sleek, interactive, and responsive user interface.

![Alt text](image.jpg)

## ✨ Key Features

- **AI-Powered Image Generation**: Convert text descriptions into stunning images.
- **Customizable Output**: Select the number of images to generate (from 1 to 4).
- **Interactive UI**: A beautiful and engaging user interface with smooth animations and modern design elements.
- **Community Gallery**: Browse through a masonry-style grid of images created by the community.
- **Responsive Design**: A seamless experience across all devices, from desktops to mobile phones.
- **Loading Skeletons**: Provides a better user experience while images are being generated.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [React](https://react.dev/), [Lucide React](https://lucide.dev/) for icons, and custom animations.
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) for simple, fast global state.
- **ORM**: [Prisma](https://www.prisma.io/) for database access and management.
- **Database**: PostgreSQL (or your preferred SQL database compatible with Prisma).
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](httpss://nodejs.org/en) (v18 or newer)
- [pnpm](httpss://pnpm.io/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/imagify.git
    cd imagify
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of your project and add the necessary environment variables. You can use the `.env.example` as a template.
    ```env
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
    
    # Add other environment variables for your AI service, etc.
    # e.g., OPENAI_API_KEY="your-api-key"
    ```

4.  **Run database migrations:**
    This will set up your database schema based on the `prisma/schema.prisma` file.
    ```bash
    pnpm prisma migrate dev
    ```

5.  **Run the development server:**
    ```bash
    pnpm dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🤝 Contributing

Contributions are welcome! If you have suggestions for improving the project, please feel free to create an issue or submit a pull request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the `LICENSE` file for details.

