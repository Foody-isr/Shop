import { useRoutes } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import NestedGrid from "./components/NestedGrid";
import { RestaurantDetails } from "./pages/restaurant/RestaurantDetails";
import { SignIn } from "./pages/auth/SignIn";
import { Profile } from "./pages/user/Profile";
import { Overview } from "./pages/user/Overview";
import { PaymentMethods } from "./pages/user/PaymentMethods";

export default function Router() {

  let element = useRoutes([
    {
      element: <MainLayout />,
      children: [
        { path: "/", element: <NestedGrid /> },
        { path: "restaurant/:id", element: <RestaurantDetails /> }
      ]
    },
    {
      path: "/auth",
      element: <MainLayout />,
      children: [
        { path: "signin", element: <SignIn /> }
      ]
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
              element: <Overview />
            },
            {
              path: "payment_methods",
              element: <PaymentMethods />
            }
          ]
       }
      ]
    }
  ]);

  return element;
}
