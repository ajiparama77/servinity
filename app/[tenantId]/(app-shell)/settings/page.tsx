import { redirect } from "next/navigation";

export default async function SettingsRedirectPage({ params }: { params: Promise<{ tenantId: string }> }) {
  const unwrappedParams = await params;
  redirect(`/${unwrappedParams.tenantId}/settings/business-profile`);
}
