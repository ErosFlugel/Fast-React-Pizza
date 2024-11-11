import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAddress } from "../../services/apiGeocoding";

function getPosition() {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

//Native redux/toolkit of using thunks

//The fetchAddress is our action creator function

//createAsyncThunk receives the action name and an async function that returns the payload for the reducer at the end
export const fetchAddress = createAsyncThunk(
  "user/fetchAddress",
  async function () {
    // 1) We get the user's geolocation position
    const positionObj = await getPosition();
    const position = {
      latitude: positionObj.coords.latitude,
      longitude: positionObj.coords.longitude,
    };

    // 2) Then we use a reverse geocoding API to get a description of the user's address, so we can display it the order form, so that the user can correct it if wrong (output-example: '3rd street alabama nort Aristides Calvani' instead of just the latitud and longitud numbers)
    const addressObj = await getAddress(position);
    const address = `${addressObj?.locality}, ${addressObj?.city} ${addressObj?.postcode}, ${addressObj?.countryName}`;

    // 3) Then we return an object with the data that we are interested in

    //Payload of the FULFULLED state
    return { position, address };
  },
);

const initialState = {
  username: "",
  status: "idle",
  position: {},
  address: "",
  error: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateName(state, action) {
      state.username = action.payload;
    },
  },
  //Here we handle 3 possible states of the pormise from the thunks, pending, fulfilled and rejected all 3 of them in a chain from the builder prop
  extraReducers: (builder) =>
    builder
      .addCase(fetchAddress.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchAddress.fulfilled, (state, action) => {
        state.position = action.payload.position;
        state.address = action.payload.address;
        state.status = "idle";
      })
      .addCase(fetchAddress.rejected, (state, action) => {
        state.status = "error";
        //If there is an error then a message will be pased to the error object instead of a payload object
        state.error =
          action.error.message ||
          "A custom message like this -> There was a problem getting your address. Make sure to fill this field";
      }),
});

export const { updateName } = userSlice.actions;

export default userSlice.reducer;

export const getUserName = (state) => state.user.username;
