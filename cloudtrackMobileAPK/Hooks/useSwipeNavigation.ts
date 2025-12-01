import { useRef } from 'react';
import { PanResponder } from 'react-native';
import { router, usePathname } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { RoutePath } from '@/utils/routes';

const SWIPE_THRESHOLD = 50;
const VELOCITY_THRESHOLD = 0.3;

const tabRoutes = [
  RoutePath.home,
  RoutePath.indents,
  RoutePath.trips,
  RoutePath.invoice,
] as const;

export function useSwipeNavigation(enabled = true) {
  const pathname = usePathname();

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, g) => {
        if (!enabled) return false;
        const isHorizontal =
          Math.abs(g.dx) > 10 && Math.abs(g.dx) > Math.abs(g.dy) * 1.2;
        return isHorizontal;
      },
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponderCapture: (_, g) => {
        if (!enabled) return false;
        const isHorizontal =
          Math.abs(g.dx) > 10 && Math.abs(g.dx) > Math.abs(g.dy) * 1.2;
        return isHorizontal;
      },
      onPanResponderTerminationRequest: () => false,
      onPanResponderRelease: (_, g) => {
        if (!enabled) return;

        const { dx, vx } = g;
        const isSwipe =
          Math.abs(dx) > SWIPE_THRESHOLD || Math.abs(vx) > VELOCITY_THRESHOLD;

        if (!isSwipe) return;

        const currentIndex = tabRoutes.indexOf(pathname as any);
        if (currentIndex < 0) return;

        if (dx > 0) {
          // Swipe right - previous tab
          const prev =
            currentIndex > 0 ? currentIndex - 1 : tabRoutes.length - 1;
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          router.replace(tabRoutes[prev]);
        } else if (dx < 0) {
          // Swipe left - next tab
          const next =
            currentIndex < tabRoutes.length - 1 ? currentIndex + 1 : 0;
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          router.replace(tabRoutes[next]);
        }
      },
    })
  ).current;

  const isTab = tabRoutes.includes(pathname as any);
  const shouldEnable = enabled && isTab;

  return shouldEnable ? panResponder.panHandlers : {};
}
