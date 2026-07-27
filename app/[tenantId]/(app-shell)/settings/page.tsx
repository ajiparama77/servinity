import { redirect } from "next/navigation";

export default function SettingsRedirectPage({ params }: { params: { tenantId: string } }) {
  redirect(`/${params.tenantId}/settings/business-profile`);
}
