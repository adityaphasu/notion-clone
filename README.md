# Zotion

This project is a simplified clone of the popular productivity application, Notion. It's designed to replicate some of the core features of Notion, providing a platform where users can create, edit, and organize their notes in a flexible and intuitive interface.

It uses Convex as the backend, which is a real-time database that allows for instant data updates. The application also uses Edgestore, a distributed key-value store, to manage the images and files uploaded by the users.The user authentication is handled by Clerk, a secure and scalable user authentication API.

## Live

Zotion - [https://zotion-app.vercel.app/](https://zotion-app.vercel.app/)

## Features

**Productivity and Organization**s

- 📝 Notion-style editor for seamless note-taking
- 📂 Infinite children documents for hierarchical organization
- ➡️🔀⬅️ Expandable and fully collapsible sidebar for easy navigation
- 🎨 Customizable icons for each document, updating in real-time
- 🗑️ Trash can with soft delete and file recovery options

**User Experience**

- 🌓 Light and Dark mode to suit preferences
- 📱 Full mobile responsiveness for productivity on the go
- 🛬 Landing page for a welcoming user entry point
- 🖼️ Cover image for each document to add a personal touch

**Data Management**

- 🔄 Real-time database for instant data updates
- 📤📥 File upload, deletion, and replacement options

**Security and Sharing**

- 🔐 Authentication to secure notes
- 🌍 Option to publish your note to the web for sharing

## Technologies

![NextJS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![Shadcn-ui](https://img.shields.io/badge/shadcn/ui-000000.svg?style=for-the-badge&logo=shadcn/ui&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6.svg?style=for-the-badge&logo=TypeScript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC.svg?style=for-the-badge&logo=Tailwind-CSS&logoColor=white)
![Clerk](https://img.shields.io/badge/Clerk-6C47FF.svg?style=for-the-badge&logo=Clerk&logoColor=white)
![Convex](https://img.shields.io/badge/Convex-ee342f.svg?style=for-the-badge&logo=Convex&logoColor=white)
![Edgestore](https://img.shields.io/badge/Edgestore-a57fff.svg?style=for-the-badge&logo=Edgestore&logoColor=white)
![Blocknote](https://img.shields.io/badge/Blocknote-ff8c00.svg?style=for-the-badge&logo=Blocknote&logoColor=white)

## Installation

1. Clone the repository
2. Install the dependencies

```
npm install
```

3. Set up the environment variables

```
# Deployment used by `npx convex dev`
CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

EDGE_STORE_ACCESS_KEY=
EDGE_STORE_SECRET_KEY=
```

4. Run Convex

```
npx convex dev
```

5. Run the development server

```
npm run dev
```

## Acknowledgements

[CodewithAntonio](https://www.youtube.com/@codewithantonio)
