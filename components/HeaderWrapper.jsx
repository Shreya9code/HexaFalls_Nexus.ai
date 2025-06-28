// src/app/components/HeaderWrapper.jsx
import { checkUser } from "@/lib/checkUser";
import Header from "@/components/header";

export default async function HeaderWrapper() {
  const user = await checkUser();
  return <Header user={user} />;
}