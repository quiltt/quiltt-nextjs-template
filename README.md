# Quiltt Next.js Template

This is a [Next.js](https://nextjs.org/) project template integrated with [Quiltt](https://www.quiltt.dev/), designed to quickly bootstrap your fintech application development.

## Features

- Next.js 15 with App Router and Turbopack
- TypeScript for type safety
- Quiltt React SDK integration
- GraphQL code generation for Quiltt API
- Authentication flow with API routes (Login and Signup)
- UI components from shadcn/ui
- Tailwind CSS v4 for styling
- Biome for code formatting and linting
- React Hook Form with Zod validation

## Getting Started

1. Clone this repository:

   ```bash
   git clone https://github.com/quiltt/quiltt-nextjs-template.git
   cd quiltt-nextjs-template
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up your environment variables:

   Create a `.env.local` file in the root directory and add your Quiltt API key:

   ```env
   QUILTT_API_SECRET_KEY=your_api_secret_key_here
   ```

4. Generate GraphQL types:

   ```bash
   pnpm run graphql:generate
   ```

5. Run the development server:

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/
│   ├── (app)/                 # App group with layout
│   │   ├── (private)/         # Protected routes
│   │   │   └── dashboard/     # Dashboard page
│   │   ├── (public)/          # Public routes
│   │   │   ├── login/         # Login page
│   │   │   └── signup/        # Signup page
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   └── api/                   # API routes
│       ├── login/             # Login API endpoint
│       └── signup/            # Signup API endpoint
├── components/
│   └── ui/                    # shadcn/ui components
├── generated/
│   └── graphql.ts             # Generated GraphQL types
├── hooks/
│   ├── accounts/              # Account-related hooks
│   ├── quiltt/                # Quiltt-specific hooks
│   └── useQuilttAuth.ts       # Authentication hook
└── lib/
    └── utils.ts               # Utility functions
```

## Available Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build the application for production
- `pnpm start` - Start the production server
- `pnpm lint` - Run Biome linter and formatter
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm graphql:generate` - Generate GraphQL types from schema

## Authentication

The template includes a complete authentication flow:

- **Public routes**: Login and signup pages accessible without authentication
- **Private routes**: Dashboard and other protected pages requiring authentication
- **API routes**: Server-side authentication endpoints
- **Custom hooks**: `useQuilttAuth` for managing authentication state

## Customization

You can start customizing the template by:

1. Modifying pages in the `src/app/(app)` directory
2. Adding new UI components in `src/components`
3. Creating custom hooks in `src/hooks`
4. Updating styles using Tailwind CSS classes
5. Configuring Tailwind in `tailwind.config.ts`

## Development Tools

- **Biome**: Fast formatter and linter (configured in `biome.json`)
- **TypeScript**: Full type safety throughout the application
- **GraphQL Code Generation**: Automatic type generation for Quiltt API
- **Turbopack**: Fast development builds with Next.js 15

## Learn More

To learn more about the technologies used in this template:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Quiltt Documentation](https://www.quiltt.dev/docs) - explore Quiltt's features and API
- [shadcn/ui](https://ui.shadcn.com/) - learn about the UI components used in this template
- [Tailwind CSS](https://tailwindcss.com/docs) - style your application efficiently
- [Biome](https://biomejs.dev/) - fast formatter and linter for JavaScript and TypeScript

## Deployment

### Vercel (Recommended)

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

1. Push your code to a Git repository
2. Import your project to Vercel
3. Add your environment variables in the Vercel dashboard
4. Deploy automatically on every push

### Other Platforms

This template can be deployed on any platform that supports Node.js applications, such as:

- Railway
- Render
- DigitalOcean App Platform
- AWS Amplify
- Netlify

Make sure to set your environment variables and run `pnpm build` during the build process.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.