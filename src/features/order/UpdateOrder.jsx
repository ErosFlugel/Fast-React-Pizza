import { useFetcher } from "react-router-dom";
import Button from "../../ui/Button";
import { updateOrder } from "../../services/apiRestaurant";

function UpdateOrder() {
  const fetcher = useFetcher();
  const state = fetcher.state === "submitting";

  return (
    //The difference between this special form and a normal one is that this one will not create a new navigation as the classic one would do (it navigates away from the page) just submits the form and revalidates the entire page
    <fetcher.Form method="PATCH" className="text-right">
      {/* We could also have some data updating wrapped in more inputs for this form but in this case we are only interested in 1 feature */}
      <Button type="primary" disabled={state}>
        Make priority
      </Button>
    </fetcher.Form>
  );
}

export default UpdateOrder;

//Revalidation is when React-router knows that the data has changed as a result of the action in this page, then it re-fetches the data and re-render the page with the new data all of that thanks to the fetcher form element
export async function action({ request, params }) {
  const data = { priority: true };
  await updateOrder(params.orderId, data);
  return null;
}
