import { Outlet } from "react-router";

export const AuthLayout = () => {
  return (
    <div className="flex w-full bg-background sm:bg-dashboardbg justify-center items-center min-h-screen flex-col">
      <Outlet />
    </div>
  );
};
