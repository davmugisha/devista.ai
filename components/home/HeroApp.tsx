import { AppWindow } from '../screens/AppWindow';
import { HOME_LABEL, HomeView } from '../screens/HomeView';
import { PhoneApproval } from '../screens/Phones';

/**
 * The web app's Home with the phone view's approval screen beside it, both adapted from the real
 * app boards. The phone joins on wide screens, hanging off the window's corner; below that the
 * window stands alone. Example data.
 */
export function HeroApp() {
  return (
    <div className="relative xl:pr-28">
      <AppWindow hero label={HOME_LABEL}>
        <HomeView />
      </AppWindow>
      <div className="parallax-near absolute -bottom-20 -right-16 hidden xl:block">
        <PhoneApproval className="animate-float" />
      </div>
    </div>
  );
}
