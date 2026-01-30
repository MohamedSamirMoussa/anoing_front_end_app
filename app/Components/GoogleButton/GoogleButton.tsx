"use client";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import { signinWithGoogleThunk } from "../../libs/redux/features/authSlice";

export interface IGoogleUser {
  token: string;
  email: string;
  name: string;
  picture: string;
}

interface IDecodedToken {
  email: string;
  name: string;
  picture: string;
}

const GoogleButton = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      toast.error("No credentials found");
      return;
    }

    try {
      const decoded = jwtDecode<IDecodedToken>(credentialResponse.credential);
      const googleUser: IGoogleUser = {
        token: credentialResponse.credential,
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
      };

      const res = await dispatch(signinWithGoogleThunk(googleUser) as any);
      
      if (res.meta.requestStatus === "fulfilled") {
        toast.success(res.payload?.message || "Login Successful");
        router.push("/");
      } else {
        toast.error(res.payload?.errMessage || "Login Failed");
      }
    } catch (error) {
      toast.error("An error occurred during Google login");
    }
  };

  return (
    <div className="w-full relative group">

        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => toast.error("Login Failed")}
          useOneTap
          theme="filled_black" 
          shape="pill"
          width="100%"
          text="continue_with"
        />
    </div>
  );
};

export default GoogleButton;