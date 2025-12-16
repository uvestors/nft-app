import MainNavbar from "@/layout/navbar/main";

const CommonLayout = ({ children }: BaseComponentProps) => {
  return (
    <div>
      <MainNavbar />
      {children}
    </div>
  );
};

export default CommonLayout;
