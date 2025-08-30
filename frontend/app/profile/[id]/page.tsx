"use client";

import { getUserData, logout } from "../../actions";
import { useContext, useEffect, useState } from "react";
import AppDataContext from "../../context/appData";
import Profile from "../../components/Profile";
import Warning from "../../components/Warning";
import { AppDataContextType } from "../../types/context";
import { UserData } from "../../types/user";
import Vote from "../../components/Vote";

interface PageProps {
  params: {
    id: string; // Assuming 'id' is the user ID to be voted on
  };
}

export default function Page({
  params: { id  } , 
} : PageProps) {
  const { appData, setAppData } = useContext(
    AppDataContext
  ) as AppDataContextType;
  const [data, setData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(true);


  useEffect(() => {
    setError(null);

    getUserData(id, appData.token)
      .then((res) => {
        console.log(res);
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "An error occurred while fetching user data.");
      });
  }, [appData, id]);

  if (isLoading || !data) return <p>Loading...</p>;

  return (
    <main className="flex flex-1 justify-center items-center bg-gray-100">
      {error && <Warning>{error}</Warning>}
      <Profile data={data} />
      <Vote votingUserId={appData.currentUser} votedUserId={String(id)}></Vote>
    </main>
  );
}
