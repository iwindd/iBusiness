import { getServerSession } from "@/libs/session";
import React from "react";

const Dashboard = async () => {
  const session = await getServerSession();
  return <div>{JSON.stringify(session)}</div>;
};

export default Dashboard;
