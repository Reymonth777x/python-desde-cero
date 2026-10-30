import HomePageClient from '@/components/HomePageClient';
import HomeAccountLinks from '@/components/HomeAccountLinks';
import HomeProgressSummary from '@/components/HomeProgressSummary';

export default function HomePage() {
  return (
    <HomePageClient
      accountLinks={<HomeAccountLinks />}
      progressSummary={<HomeProgressSummary />}
    />
  );
}
