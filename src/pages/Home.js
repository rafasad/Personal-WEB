import Page from '../components/Page';
// sections
import { HomeHero } from '../sections/home';

// ----------------------------------------------------------------------

export default function HomePage() {
  return (
    <Page title="Personal App">
      <HomeHero />
    </Page>
  );
}
