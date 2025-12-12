import React from "react";
import Navbar from "./navbar";

const MainLayout = ({ children }: BaseComponentProps) => {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
};

export default MainLayout;
