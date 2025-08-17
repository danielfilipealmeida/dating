"use client";

import { getUserData } from "../actions";
import { useContext, useEffect, useState } from "react";
import AppDataContext from "../context/appData";
import Profile from "../components/Profile";
import Warning from "../components/Warning";
import { AppDataContextType } from "../types/context";
import { UserData } from "../types/user";
import PageFooter from "../components/PageFooter";
import PageHeader from "../components/PageHeader";
import Content from "../components/Content";
import Link from "next/link";

/**
 * This is the profile page of the dating site application.
 * It retrieves the user's profile data and displays it.
 * The user can also log out from this page.
 * @returns A page that displays the user's profile and allows them to log out.
 */
export default function Page() {
  const { appData, setAppData } = useContext(
    AppDataContext
  ) as AppDataContextType;
  const [data, setData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setError(null);

    getUserData(appData.currentUser, appData.token)
      .then((res) => {
        console.log(res);
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "An error occurred while fetching user data.");
      });
  }, [appData]);

  if (isLoading || !data) return <p>Loading...</p>;

  return (
    <>
    <PageHeader title="Profile" />
      <Content>
        {error && <Warning>{error}</Warning>}
        <Profile data={data} />

        <Link href="/edit" className="text-orange-500 hover:text-orange-800 hover:underline ">Edit Profile</Link>
      </Content>
      <PageFooter />
    </>
  );
}
