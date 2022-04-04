// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import Settings from './components/settings';
import RtlLayout from './components/RtlLayout';
import { ChartStyle } from './components/chart';
import ScrollToTop from './components/ScrollToTop';
import { ProgressBarStyle } from './components/ProgressBar';
import NotistackProvider from './components/NotistackProvider';
import ThemeColorPresets from './components/ThemeColorPresets';
import MotionLazyContainer from './components/animate/MotionLazyContainer';
import setupAxios from './utils/setupAxios';
import { WebsitePageProvider } from './contexts/WebsitePageContext';
import Loading from './components/Loading';

// ----------------------------------------------------------------------

export default function App() {

  setupAxios();

  return (
    <ThemeProvider>
      <ThemeColorPresets>
        <RtlLayout>
          <NotistackProvider>
            <WebsitePageProvider>
            <MotionLazyContainer>
              <ProgressBarStyle />
              <ChartStyle />
              <Settings />
              <ScrollToTop />
              <Router />
              <Loading />
            </MotionLazyContainer>
            </WebsitePageProvider>
          </NotistackProvider>
        </RtlLayout>
      </ThemeColorPresets>
    </ThemeProvider>
  );
}
