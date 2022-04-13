import { useRoutes } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import NestedGrid from "./components/NestedGrid";
import { RestaurantDetails } from "./pages/restaurant/RestaurantDetails";

export default function Router() {

  let element = useRoutes([
    {
      element: <MainLayout />,
      children: [
        { path: "/", element: <NestedGrid /> },
        { path: "restaurant/:id", element: <RestaurantDetails /> }
      ]
    }
  ]);

  return element;
}
