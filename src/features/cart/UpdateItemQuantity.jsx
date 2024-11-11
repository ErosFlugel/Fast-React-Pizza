import { useDispatch } from "react-redux";
import Button from "../../ui/Button";
import { decreaseItemQuantity, increaseItemQuantity } from "./cartSlice";

function UpdateItemQuantity({ pizzaId, quantity }) {
  const dispatch = useDispatch();

  //Handle click event functions
  function handleIncreaseQuantity() {
    dispatch(increaseItemQuantity(pizzaId));
  }

  function handleDecreaseQuantity() {
    if (quantity <= 1) return;
    dispatch(decreaseItemQuantity(pizzaId));
  }

  return (
    <div className="flex items-center gap-2 md:gap-3">
      <Button
        type="round"
        onClick={handleDecreaseQuantity}
        disabled={quantity <= 1}
      >
        -
      </Button>
      <span className="text-sm font-medium">{quantity}</span>

      <Button type="round" onClick={handleIncreaseQuantity}>
        +
      </Button>
    </div>
  );
}

export default UpdateItemQuantity;
