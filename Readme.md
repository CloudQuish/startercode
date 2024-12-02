## **Applicant Details**

- **Name**: Milan Prajapati
- **Email**: mln.praz12@gmail.com
- **Phone Number**: 9745661480
- **Role Applied For**: Frontend Developer
- **Address**: Thimi, Bhaktapur
- **GitHub Profile**: https://github.com/MilanPraz
- **LinkedIn Profile**: https://www.linkedin.com/in/milan-praz-a565ba270/
- **Resume**: milanprajapati.com.np
- **Additional Links**: milanprajapati.com.np

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Explanation of Libraries/Tools Used and Why

### Libraries/Tools Used:

1. **Next.js**

   - Chosen for its server-side rendering capabilities, file-based routing, and efficient development experience for building modern web applications.
   - Optimizes performance with built-in tools like image optimization, API routes, and incremental static regeneration.

2. **React Flow**

   - Used to create an interactive diagram builder with features like customizable nodes and edges, drag-and-drop functionality, and real-time updates.
   - Simplifies the development of visual workflows and diagrams.

3. **Tailwind CSS**

   - Provides a utility-first CSS framework for rapid UI development.
   - Ensures consistent and responsive designs without the need for custom stylesheets.

4. **React Hot Toast**

   - Used for showing user-friendly notifications such as success or error messages.
   - Provides a lightweight and customizable toast notification system.

5. **Lucide Icons**

   - Offers a collection of modern and customizable icons, enhancing the UI design with intuitive visuals.

6. **Custom Hooks and Context API**

   - Utilized for managing state across the application, such as nodes and edges in the diagram builder.
   - Simplifies state management without relying on external libraries.

7. **ShadCN UI Components**
   - Used to build accessible and reusable UI components like `Sheet` for sidebar functionality.
   - Enhances design consistency and reduces development overhead.

---

## Challenges Faced and How They Were Overcome

1. **Challenge: Managing State Across Components**

   - **Problem:** Keeping track of nodes and edges, and ensuring the diagram builder updates efficiently.
   - **Solution:** Used Context API to manage state globally and custom hooks to encapsulate logic for updating history, ensuring a clean and modular approach.

2. **Challenge: Importing and Saving Files**

   - **Problem:** Loading diagrams from JSON files and synchronizing them with local storage.
   - **Solution:** Implemented file import functionality and updated local storage in real-time using `localStorage.setItem` to maintain history and user progress.

3. **Challenge: Customizing Third-Party Components**

   - **Problem:** Adjusting the width and behavior of components like `Sheet` for responsiveness.
   - **Solution:** Used Tailwind CSS and dynamic styling based on state to ensure flexibility and a seamless user experience.

4. **Challenge: Visualizing Complex Diagrams**
   - **Problem:** Rendering dynamic diagrams while maintaining performance.
   - **Solution:** Leveraged React Flow’s efficient rendering engine and optimized the data flow with memoization techniques.

---

With these tools and solutions, the project offers an interactive and scalable diagram-building experience while ensuring performance and maintainability.

## Time Tracking:

## **Time Log**

| **Date**   | **Time Spent (hrs)** | **Task Description**                                                                                    |
| ---------- | -------------------- | ------------------------------------------------------------------------------------------------------- |
| 2024-11-30 | 3                    | Created the Hero section from Figma design.                                                             |
| 2024-12-01 | 8                    | Completed the full cloning of a webpage from Figma design, including layout, structure, and responsive  |
| 2024-12-02 | 1                    | Started working on the second project: Diagram Builder.                                                 |
| 2024-12-02 | 3                    | Explored React Flow documentation and created sample nodes using dummy data.                            |
| 2024-12-02 | 4                    | Designed and styled the Diagram Builder UI; integrated React Flow for rendering nodes and edges.        |
| 2024-12-02 | 4                    | Debugged and resolved sidebar responsiveness and history tracking issues; gave a final touch to the UI. |
| 2024-12-02 | 2                    | Hosted the project on Vercel and debugged build errors.                                                 |
