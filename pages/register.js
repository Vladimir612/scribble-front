import { NextSeo } from "next-seo";
import RegisterForm from "../components/utils/Forms/RegisterForm";

export default function Register() {
  return (
    <>
      <NextSeo title="HireClass | Register" />
      <RegisterForm />
    </>
  );
}
