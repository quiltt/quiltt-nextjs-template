# Quiltt Next.js Template

This is a [Next.js](https://nextjs.org/) project template integrated with [Quiltt](https://www.quiltt.dev/), designed to quickly bootstrap your fintech application development.

## Features

- Next.js 14 with App Router
- TypeScript for type safety
- Quiltt React SDK integration
- GraphQL code generation for Quiltt API
- Authentication flow (Login and Signup)
- UI components from shadcn/ui
- Tailwind CSS for styling

## Getting Started

1. Clone this repository:

  ```bash
  git clone https://github.com/your-repo/quiltt-nextjs-template.git
  cd quiltt-nextjs-template

2. Install dependencies:

  ```bash
  pnpm install
  ```

3. Set up your environment variables:

  Create a .env.local file in the root directory and add your Quiltt API key:
  CopyQUILTT_API_SECRET_KEY=your_api_secret_key_here

4. Generate GraphQL types:

  ```bash
  pnpm run graphql:generate
  ```

5. Run the development server:

  ```bash
  pnpm dev
  ```

  Open [`http://localhost:3000`](http://localhost:3000) with your browser to see the result.

## Project Structure

- /src/app: Next.js app router pages
- /src/components: Reusable React components
- /src/generated: Generated GraphQL types
- /src/hooks: Custom React hooks
- /src/lib: Utility functions and shared logic

## Customization

You can start customizing the template by modifying the components in the src/app directory. The project uses Tailwind CSS for styling, which can be configured in the tailwind.config.js file.

## Learn More

To learn more about the technologies used in this template:

[Next.js Documentation](https://nextjs.org/) - learn about Next.js features and API.
[Quiltt Documentation](https://www.quiltt.dev/) - explore Quiltt's features and API.
[shadcn/ui](https://ui.shadcn.com/) - learn about the UI components used in this template.
[Tailwind CSS](https://tailwindcss.com/) ta- style your application efficiently.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the Vercel Platform from the creators of Next.js.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
