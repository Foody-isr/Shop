import { useRoutes } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import NestedGrid from "./components/NestedGrid";
import { RestaurantDetails } from "./pages/restaurant/RestaurantDetails";
import { SignIn } from "./pages/auth/SignIn";
import { Profile } from "./pages/user/Profile";
import { Overview } from "./pages/user/Overview";
import { PaymentMethods } from "./pages/user/PaymentMethods";
import { Addresses } from "./pages/user/Addresses";
import { SignUp } from "./pages/auth/SignUp";

export default function Router() {
  console.log("ROUTER ");

  let element = useRoutes([
    {
      element: <MainLayout />,
      children: [
        { path: "/", element: <NestedGrid /> },
        { path: "/:id", element: <RestaurantDetails /> },
      ],
    },
    {
      path: "/auth",
      element: <MainLayout />,
      children: [
        { path: "signin", element: <SignIn /> },
        { path: "signup", element: <SignUp /> },
      ],
    },
    {
      path: "/user",
      element: <MainLayout />,
      children: [
        {
          path: "profile",
          element: <Profile />,
          children: [
            {
              path: "overview",
              element: <Overview />,
            },
            {
              path: "payment_methods",
              element: <PaymentMethods />,
            },
            {
              path: "my_addresses",
              element: <Addresses />,
            },
          ],
        },
      ],
    },
  ]);

  return element;
}
