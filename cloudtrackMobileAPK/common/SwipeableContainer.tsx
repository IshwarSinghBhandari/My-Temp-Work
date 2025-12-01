import React, { useRef } from 'react';
import { View, PanResponder } from 'react-native';
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

type SwipeableContainerProps = {
  children: React.ReactNode;
  enabled?: boolean;
};

export function SwipeableContainer({ children, enabled = true }: SwipeableContainerProps) {
  const pathname = usePathname();

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, g) => {
        if (!enabled) return false;
        // Only capture horizontal swipes (more horizontal than vertical)
        const isHorizontal = Math.abs(g.dx) > 15 && Math.abs(g.dx) > Math.abs(g.dy) * 1.5;
        return isHorizontal;
      },
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponderCapture: (_, g) => {
        if (!enabled) return false;
        // Capture horizontal swipes early to prevent child components from handling them
        const isHorizontal = Math.abs(g.dx) > 15 && Math.abs(g.dx) > Math.abs(g.dy) * 1.5;
        return isHorizontal;
      },
      onPanResponderGrant: () => {
        // Lock the gesture to prevent child components from stealing it
      },
      onPanResponderTerminationRequest: () => false, // Don't allow termination
      onPanResponderRelease: (_, g) => {
        if (!enabled) return;

        const { dx, vx } = g;
        const isSwipe =
          Math.abs(dx) > SWIPE_THRESHOLD || Math.abs(vx) > VELOCITY_THRESHOLD;

        if (!isSwipe) return;

        const currentIndex = tabRoutes.indexOf(pathname as any);
        if (currentIndex < 0) return;

        // 👉 RIGHT SWIPE
        if (dx > 0) {
          const prev = currentIndex > 0 ? currentIndex - 1 : tabRoutes.length - 1;
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          router.replace(tabRoutes[prev]);
        }

        // 👉 LEFT SWIPE
        if (dx < 0) {
          const next = currentIndex < tabRoutes.length - 1 ? currentIndex + 1 : 0;
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          router.replace(tabRoutes[next]);
        }
      },
    })
  ).current;

  const isTab = tabRoutes.includes(pathname as any);
  const shouldEnable = enabled && isTab;

  return (
    <View
      style={{ flex: 1 }}
      {...(shouldEnable ? panResponder.panHandlers : {})}
      pointerEvents={shouldEnable ? 'box-none' : 'auto'}
    >
      {children}
    </View>
  );
}
