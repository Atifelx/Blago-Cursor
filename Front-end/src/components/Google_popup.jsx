import { HiInformationCircle } from "react-icons/hi";
import { Alert } from "flowbite-react";
import { useState } from "react";
import { useDispatch } from 'react-redux';
import { GuserExist } from '../app/user/userSlice'; // Make sure to import the action

export default function Pop_Component() {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div>
      <Alert
        color="failure"
        icon={HiInformationCircle}
        onDismiss={() => {
          dispatch(GuserExist(false));
          setVisible(false); // Hide the alert
        }}
      >
        <span>alert!</span> You already have an account with us signup via Google , please sign in here !
      </Alert>
    </div>
  );
}