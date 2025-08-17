"use client";

import { useContext, useEffect, useState } from "react";
import AppDataContext from "../context/appData";
import Warning from "../components/Warning";
import { H2 } from "../components/Headers";
import { SelectField, TextAreaField, TextField } from "../components/Fields";
import { getUserData, updateUserData } from "../actions";
import SubmitButton from "../components/SubmitButton";
import Message from "../components/Message";
import Section from "../components/Section";
import { AppDataContextType, AppData } from "../types/context";
import Content from "../components/Content";
import PageHeader from "../components/PageHeader";
import PageFooter from "../components/PageFooter";

interface AppState {
  name?: string;
  bio?: string;
  preferences?: {
    sex: string;
    distance: string;
  };
}

export default function Edit() {
  const [error, setError] = useState<string | null>(null);
  const { appData, setAppData } = useContext(
    AppDataContext
  ) as AppDataContextType;
  const [data, setData] = useState<AppState>({});
  const [isLoading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setError(null);

    getUserData(appData.currentUser, appData.token).then((res) => {
      setData(res);
      setLoading(false);
    });
  }, [appData]);

  const handleForm = async (formData: FormData) => {
    setSubmitting(true);
    setError(null);
    try {
      formData.set("id", String(appData.currentUser));
      updateUserData(formData)
        .then((result) => {
          if (result.error) {
            throw new Error(result.error);
          }
          setData(result);
          setMessage("User data updated!");
        })
        .catch((reason) => {
          setError(reason.message);
        });
    } catch (err: any) {
      setError(err.message);
    }

    setSubmitting(false);
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <>
      <PageHeader />
      <Content>
        <H2>Edit profile</H2>
        {message && <Message>{message}</Message>}

        <form action={handleForm} className="w-full">
          {error && <Warning>{error}</Warning>}

          <Section title="User Information" name="user-info">
            <TextField
              type="text"
              name="name"
              title="Name"
              value={data?.name}
              required
            />
            <TextAreaField name="bio" title="Bio" value={data?.bio} required />
          </Section>

          <Section title="Search Preferences name" name="search-preferences">
            <SelectField
              title="Sex"
              name="preferences.sex"
              value={data?.preferences?.sex}
              multiple={true}
              options={{
                MALE: "Male",
                FEMALE: "Female",
              }}
            />
            <TextField
              name="preferences.distance"
              title={"Distance"}
              required={false}
              type={"range"}
              min="0"
              max="250"
              value={data?.preferences?.distance}
            />
          </Section>

          <br />

          <SubmitButton label="Save profile data" disabled={submitting} />
        </form>
      </Content>
      <PageFooter />
    </>
  );
}
