"use client";

import { api } from "@/trpc/react";
import { redirect } from "next/navigation";

import { useEffect, useState } from "react";
import InterestPikerBox from "./InterestPickerBox";
import SuccessButton from "@/app/register/_components/SuccessButton";
import { type Host, type User } from "../interfaces";

interface ComponentGroundProps {
  data: User;
  allInterestList: string[];
}

export default function ComponentsGround(props: ComponentGroundProps) {
  const { data, allInterestList } = props;
  const [selectedInterestList, setSelectedInterestList] = useState<string[]>(
    [],
  );

  const signUpHost = api.auth.signupHost.useMutation();

  const { data: userData } = api.auth.me.useQuery();

  useEffect(() => {
    if (userData) {
      redirect("/");
    }
  }, [userData]);

  const handleSubmit = async (host: Host) => {
    selectedInterestList.sort();
    await signUpHost.mutateAsync({
      email: host.Email,
      password: host.Password,
      username: host.AKA,
      firstName: host.Firstname,
      lastName: host.Lastname,
      gender: host.Gender,
      bio: host.Bio,
      dateOfBirth: host.DOB,
      interests: selectedInterestList,
    });
  };

  const handleButtonClick = () => {
    void handleSubmit(data as Host);
  };

  return (
    <div className="flex flex-col items-center gap-y-8">
      <div className="h1 text-primary-900">Interests</div>
      <InterestPikerBox
        allInterestList={allInterestList}
        selectedInterestList={selectedInterestList}
        setSelectedInterestList={setSelectedInterestList}
      />
      <div className="absolute bottom-6 sm:static">
        <SuccessButton
          setModalPop={(pop: boolean) => {
            return;
          }}
          isModalPop={true}
          handleClick={handleButtonClick}
        />
      </div>
    </div>
  );
}