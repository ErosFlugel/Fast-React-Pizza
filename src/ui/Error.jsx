import { useRouteError } from "react-router-dom";
import LinkButton from "./LinkButton";

function Error() {
  // this is another hook provided by react-router that takes within the error itself that was pumped up
  const errorOrResponse = useRouteError();

  //When trying to acces a page that doesn't exists then the error catched by react-router is different than when it is an error comming from the actual API fetching so we take either option is available to take the message property
  const error = errorOrResponse.error || errorOrResponse;

  return (
    <div>
      <h1>Something went wrong 😢</h1>
      <p>{error.message}</p>
      <LinkButton to={-1}>&larr; Go back</LinkButton>
    </div>
  );
}

export default Error;
