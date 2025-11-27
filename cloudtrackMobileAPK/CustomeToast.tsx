import { Icon } from '@/components/ui/icon';
import { NativeOnlyAnimatedView } from '@/components/ui/native-only-animated-view';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { TOAST_DURATION } from '@/utils/constants';
import { Portal } from '@rn-primitives/portal';
import { AlertCircle, CheckCircle2, Info, X, XCircle } from 'lucide-react-native';
import * as React from 'react';
import { Animated, Keyboard, PanResponder, Platform, Pressable, View, type ViewStyle } from 'react-native';
import { FadeInDown, FadeInUp, FadeOutDown, FadeOutUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info';
type ToastPosition = 'top' | 'bottom';

export interface ToastData {
  id: string;
  message: string;
  variant?: ToastVariant;
  duration?: number;
  position?: ToastPosition;
  title?: string;
  action?: {
    label: string;
    onPress: () => void;
  };
}

interface ToastContextValue {
  showToast: (toast: Omit<ToastData, 'id'>) => void;
  hideToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | undefined>(undefined);

const toastVariants: Record<ToastVariant, { bg: string; border: string; icon: typeof CheckCircle2; iconColor: string }> = {
  default: {
    bg: 'bg-background',
    border: 'border-border',
    icon: Info,
    iconColor: 'text-foreground',
  },
  success: {
    bg: 'bg-green-50 dark:bg-green-950/20',
    border: 'border-green-200 dark:border-green-800',
    icon: CheckCircle2,
    iconColor: 'text-green-600 dark:text-green-400',
  },
  error: {
    bg: 'bg-red-50 dark:bg-red-950/20',
    border: 'border-red-200 dark:border-red-800',
    icon: XCircle,
    iconColor: 'text-red-600 dark:text-red-400',
  },
  warning: {
    bg: 'bg-yellow-50 dark:bg-yellow-950/20',
    border: 'border-yellow-200 dark:border-yellow-800',
    icon: AlertCircle,
    iconColor: 'text-yellow-600 dark:text-yellow-400',
  },
  info: {
    bg: 'bg-blue-50 dark:bg-blue-950/20',
    border: 'border-blue-200 dark:border-blue-800',
    icon: Info,
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
};

function ToastItem({
  toast,
  onDismiss,
  stackStyle,
}: {
  toast: ToastData;
  onDismiss: (id: string) => void;
  stackStyle?: ViewStyle;
}) {
  const { top, bottom } = useSafeAreaInsets();
  const variant = toast.variant || 'default';
  const position = toast.position || 'bottom';
  const variantStyles = toastVariants[variant];
  const IconComponent = variantStyles.icon;
  const translateX = React.useRef(new Animated.Value(0)).current;

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) =>
          Math.abs(gesture.dx) > Math.abs(gesture.dy) && Math.abs(gesture.dx) > 5,
        onPanResponderMove: (_, gesture) => {
          translateX.setValue(gesture.dx);
        },
        onPanResponderRelease: (_, gesture) => {
          if (Math.abs(gesture.dx) > 80) {
            Animated.timing(translateX, {
              toValue: gesture.dx > 0 ? 300 : -300,
              duration: 200,
              useNativeDriver: true,
            }).start(() => onDismiss(toast.id));
          } else {
            Animated.spring(translateX, {
              toValue: 0,
              useNativeDriver: true,
            }).start();
          }
        },
      }),
    [onDismiss, toast.id, translateX]
  );

  const enteringAnimation = position === 'top' ? FadeInDown.duration(400) : FadeInUp.duration(400);
  const exitingAnimation = position === 'top' ? FadeOutUp.duration(300) : FadeOutDown.duration(300);

  React.useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        onDismiss(toast.id);
      }, toast.duration);

      return () => clearTimeout(timer);
    }
  }, [toast.id, toast.duration, onDismiss]);

  const baseStyle = {
    marginTop: position === 'top' ? top + 4 : 0,
    marginBottom: position === 'bottom' ? bottom + 4 : 0,
  };

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[baseStyle, stackStyle, { transform: [{ translateX }] }]}
    >
      <NativeOnlyAnimatedView
        entering={enteringAnimation.duration(300).springify()}
        exiting={exitingAnimation.duration(200)}
        className={cn(
          'mx-4 mb-0 flex-row items-center justify-center gap-3 rounded-lg border px-4 py-3 ',
          variantStyles.bg,
          variantStyles.border,
          Platform.select({
            web: 'max-w-md',
          })
        )}
      >
        <Icon as={IconComponent} className={cn('size-5 mt-0.5', variantStyles.iconColor)} />
        <View className="flex-1 gap-1">
          {toast.title && (
            <Text className="font-semibold text-foreground text-sm">{toast.title}</Text>
          )}
          <Text className="text-foreground text-sm leading-5">{toast.message}</Text>
          {toast.action && (
            <Pressable onPress={toast.action.onPress} className="mt-1 self-start">
              <Text className={cn('font-medium text-sm underline', variantStyles.iconColor)}>
                {toast.action.label}
              </Text>
            </Pressable>
          )}
        </View>
        <Pressable
          onPress={() => onDismiss(toast.id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          className="ml-2 my-auto">
          <Icon as={X} className="size-4 text-muted-foreground" />
        </Pressable>
      </NativeOnlyAnimatedView>
    </Animated.View>
  );
}

const STACK_OFFSET = 10;
const ESTIMATED_TOAST_HEIGHT = 80;

const ToastStack = ({
  toasts,
  position,
  onDismiss,
  keyboardOffset,
  bottomOffset = 0,
}: {
  toasts: ToastData[];
  position: ToastPosition;
  onDismiss: (id: string) => void;
  keyboardOffset: number;
  bottomOffset?: number;
}) => {
  const [expanded, setExpanded] = React.useState(false);

  const visibleToasts = React.useMemo(() => toasts.slice(0, 3), [toasts]);
  const hiddenCount = Math.max(toasts.length - 3, 0);

  const stacked = !expanded && visibleToasts.length > 1;
  const stackHeight = stacked
    ? ESTIMATED_TOAST_HEIGHT + (Math.min(visibleToasts.length, 3) - 1) * STACK_OFFSET
    : undefined;

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: position === 'bottom' ? keyboardOffset + bottomOffset : undefined,
        top: position === 'top' ? 0 : undefined,
      }}
    >
      <View
        pointerEvents="box-none"
        style={{
          position: 'relative',
          height: stackHeight,
        }}
      >
        {visibleToasts.map((toast, index) => {
          const stackStyle = stacked
            ? {
              position: 'absolute',
              left: 0,
              right: 0,
              [position === 'bottom' ? 'bottom' : 'top']: index * STACK_OFFSET,
              zIndex: visibleToasts.length - index,
            }
            : undefined;

          return (
            <ToastItem
              key={toast.id}
              toast={toast}
              onDismiss={onDismiss}
              stackStyle={stackStyle as ViewStyle}
            />
          );
        })}
        {stacked && (
          <Pressable
            onPress={() => setExpanded(true)}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            className='z-20'
          />
        )}
        {hiddenCount > 0 && (
          <View className="absolute bottom-0 right-4 rounded-full bg-black/70 px-2 py-1">
            <Text className="text-xs font-semibold text-white">+{hiddenCount}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

function ToastContainer({
  toasts,
  onDismiss,
  keyboardOffset,
  bottomOffset,
}: {
  toasts: ToastData[];
  onDismiss: (id: string) => void;
  keyboardOffset: number;
  bottomOffset: number;
}) {
  const topToasts = toasts.filter((t) => (t.position || 'bottom') === 'top');
  const bottomToasts = toasts.filter((t) => (t.position || 'bottom') === 'bottom');

  return (
    <Portal name="toast">
      <View
        pointerEvents="box-none"
        className="absolute left-0 right-0 z-[9999]"
        style={{ top: 0, bottom: 0 }}>
        {topToasts.length > 0 && (
          <ToastStack toasts={topToasts} position="top" onDismiss={onDismiss} keyboardOffset={0} />
        )}
        {bottomToasts.length > 0 && (
          <ToastStack
            toasts={bottomToasts}
            position="bottom"
            onDismiss={onDismiss}
            keyboardOffset={keyboardOffset}
            bottomOffset={bottomOffset}
          />
        )}
      </View>
    </Portal>
  );
}

type ToastProviderProps = {
  children: React.ReactNode;
  bottomOffset?: number;
};

export function ToastProvider({ children, bottomOffset = 0 }: ToastProviderProps) {
  const [toasts, setToasts] = React.useState<ToastData[]>([]);
  const [keyboardOffset, setKeyboardOffset] = React.useState(0);

  React.useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (event) => {
      setKeyboardOffset(event.endCoordinates?.height ?? 0);
    });

    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardOffset(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const showToast = React.useCallback((toast: Omit<ToastData, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [
      ...prev,
      {
        duration: TOAST_DURATION || 5000, //  default 5 seconds
        ...toast,
        id
      }
    ]);
  }, []);


  const hideToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <ToastContainer
        toasts={toasts}
        onDismiss={hideToast}
        keyboardOffset={keyboardOffset}
        bottomOffset={bottomOffset}
      />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }

  return {
    show: (message: string, options?: Omit<ToastData, 'id' | 'message'>) => {
      context.showToast({ message, ...options });
    },
    success: (message: string, options?: Omit<ToastData, 'id' | 'message' | 'variant'>) => {
      context.showToast({ message, variant: 'success', ...options });
    },
    error: (message: string, options?: Omit<ToastData, 'id' | 'message' | 'variant'>) => {
      context.showToast({ message, variant: 'error', ...options });
    },
    warning: (message: string, options?: Omit<ToastData, 'id' | 'message' | 'variant'>) => {
      context.showToast({ message, variant: 'warning', ...options });
    },
    info: (message: string, options?: Omit<ToastData, 'id' | 'message' | 'variant'>) => {
      context.showToast({ message, variant: 'info', ...options });
    },
    hide: context.hideToast,
  };
}

