import { AppLayout } from '../components/AppLayout';
import { PilgrimageRouteScreen } from '../features/route/screens/PilgrimageRouteScreen';

export function PilgrimageRouteRoute() {
  return (
    <AppLayout activeTab="route" onTabChange={() => {}}>
      <PilgrimageRouteScreen />
    </AppLayout>
  );
}
