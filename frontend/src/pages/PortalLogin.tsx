import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PortalLogin } from "@/features/portal/components/PortalLogin";
import { usePortalSession } from "@/features/portal/hooks/usePortalSession";

export default function PortalLoginPage() {
  const navigate = useNavigate();
  const { login } = usePortalSession();

  return (
    <PortalLogin
      onLogin={(token, client) => {
        login(token, client);
        navigate("/portal/orders");
      }}
    />
  );
}
