import { AppShell } from '../components/AppShell';
import { PilgrimageRouteScreen } from '../features/route/screens/PilgrimageRouteScreen';

export function PilgrimageRouteRoute() {
  return (
    <AppShell activeTab="route" onTabChange={() => {}}>
      <PilgrimageRouteScreen />
    </AppShell>
  );
}
