import { Navbar } from "./_components/Navbar";

const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="dark:bg-dark h-full">
      <Navbar />
      <main className="h-full pt-20">{children}</main>
    </div>
  );
};
export default LandingLayout;
