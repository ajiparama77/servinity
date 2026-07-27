import AuthForm from "./components/AuthForm";
import { getBusinessTemplates } from "./actions/templateActions";

export default async function LandingPage() {
  const { data: templates } = await getBusinessTemplates();

  return (
    <main>
      <AuthForm templates={templates} />
    </main>
  );
}
