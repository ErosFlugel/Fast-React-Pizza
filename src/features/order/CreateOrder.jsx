import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import { createOrder } from "../../services/apiRestaurant";
import Button from "../../ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, getCart, getTotalCartPrice } from "../cart/cartSlice";
import EmptyCart from "../cart/EmptyCart";

import store from "../../store.js";
import { formatCurrency } from "../../utilities/helpers";
import { useState } from "react";
import { fetchAddress } from "../user/userSlice.js";

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str,
  );

// const fakeCart = [
//   {
//     pizzaId: 12,
//     name: "Mediterranean",
//     quantity: 2,
//     unitPrice: 16,
//     totalPrice: 32,
//   },
//   {
//     pizzaId: 6,
//     name: "Vegetale",
//     quantity: 1,
//     unitPrice: 13,
//     totalPrice: 13,
//   },
//   {
//     pizzaId: 11,
//     name: "Spinach and Mushroom",
//     quantity: 1,
//     unitPrice: 15,
//     totalPrice: 15,
//   },
// ];

function CreateOrder() {
  //Local State
  const [withPriority, setWithPriority] = useState(false);

  //Redux State
  const {
    username,
    status: addressStatus,
    position,
    address,
    error: errorAddress,
  } = useSelector((state) => state.user);
  const cart = useSelector(getCart);
  const totalCartPrice = useSelector(getTotalCartPrice);

  //Derived state
  const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0;
  const totalPrice = totalCartPrice + priorityPrice;
  const isLoadingAddress = addressStatus === "loading";

  // checking the navigation state provided by react-router-dom
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  //We can handle the returned value of the actions attached to the component in the route with useActionData() hook from react-router-dom
  const formErrors = useActionData();

  const dispatch = useDispatch();

  if (!cart.length) return <EmptyCart />;

  return (
    <div className="px-4 py-6">
      <h2 className="mb-8 text-xl font-semibold">{`Ready to order? Let's go!`}</h2>

      {/* While loaders are used to read data, actions are used to modify it, that is how it all begins for actions in react-router-dom, with a Form component provided by the library itself */}
      {/* Only works PATCH, POST and DELETE */}
      <Form
        method="POST"
        // We could also specify where (in our app) would this route should be submitting to, but there is no need to do that now because react-router-dom will just match the closest route to the actual component within the tree
        // action='/order/new'
      >
        {/* A flex item should never use the width property for some reason that is why we use it on the other inputs but in this one we use the grow property (the others are within the flex element and are not the direct element itself) */}
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">First Name</label>
          <input
            type="text"
            name="customer"
            required
            className="input grow"
            // This is not a controlled element, this one just has the default value setted, so there is no need to use a onChange handler
            defaultValue={username}
          />
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Phone number</label>
          <div className="grow">
            <input type="tel" name="phone" required className="input w-full" />
            {formErrors?.phone && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
                {formErrors.phone}
              </p>
            )}
          </div>
        </div>

        <div className="relative mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Address</label>
          <div className="grow">
            <input
              type="text"
              name="address"
              defaultValue={address}
              required
              disabled={isLoadingAddress}
              className="input w-full"
            />
            {addressStatus === "error" && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
                {errorAddress}
              </p>
            )}
          </div>
          {!position.latitude && !position.longitude && (
            <span className="absolute right-[3px] top-[35px] sm:top-[3px] md:right-[4px] md:top-[5px]">
              <Button
                disabled={isLoadingAddress}
                type="small"
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(fetchAddress());
                }}
              >
                Get position
              </Button>
            </span>
          )}
        </div>

        <div className="z-50 mb-12 flex items-center gap-5">
          <input
            type="checkbox"
            name="priority"
            id="priority"
            className="h-6 w-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2"
            value={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority" className="font-medium">
            Want to yo give your order priority?
          </label>
        </div>

        <div>
          {/* We create a hidden input to be able to send the cart object that we want to submit as a value and then use it in the action function so we can process the data before submiting  but is better handling it with thunks*/}
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <Button type="primary" disabled={isSubmitting || isLoadingAddress}>
            {isSubmitting
              ? "Placing order..."
              : `Order now from ${formatCurrency(totalPrice)}`}
          </Button>
        </div>
      </Form>
    </div>
  );
}

//Once the Form component is submitted, the action function will be called with the request data among others
export async function action({ request }) {
  // .formData() provided by the browser
  const formData = await request.formData();
  //this line of code is to convert the actual submited request data from the Form into an actual managable object
  const data = Object.fromEntries(formData);

  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === "true",
  };

  const errors = {};

  if (!isValidPhone(order.phone))
    errors.phone =
      "Please give us a valid contact phone number. It is a required information to proceed";

  if (Object.keys(errors).length > 0) return errors;

  const newOrder = await createOrder(order);

  //Change this (crazy not ever do it again) hack with thunks
  //It clears the cart once the order is completed
  store.dispatch(clearCart());

  //redicert function is provided by react-router-dom and is used to redirect to another url so we can do it without useNavigate (remember that we can not use hooks in a normal function, it can only happen within a react component)
  return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;
