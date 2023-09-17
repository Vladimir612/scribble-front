import { NextSeo } from "next-seo";
import LoginForm from "../components/utils/Forms/LoginForm";

export default function Register() {
  return (
    <>
      <NextSeo title="InkedEnigma | Login" />
      <LoginForm />
    </>
  );
}
