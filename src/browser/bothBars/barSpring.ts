import Animated, {not} from 'react-native-reanimated';
const {
  diffClamp,
  interpolateNode,
  event: reanimatedEvent,
  multiply,
  add,
  cond,
  lessThan,
  neq,
  Clock,
  Extrapolate,
  clockRunning,
  set,
  startClock,
  spring,
  sub,
  stopClock,
  eq,
} = Animated;

export const DRAG_END_INITIAL: number = 10000000;
export const NAV_BAR_HEIGHT: number = 44;

// https://github.com/rgommezz/reanimated-collapsible-navbar/blob/master/App.js#L36
export function runSpring({
  clock,
  from,
  velocity,
  toValue,
  scrollEndDragVelocity,
  snapOffset,
  diffClampNode,
}) {
  const state = {
    finished: new Animated.Value(0),
    velocity: new Animated.Value(0),
    position: new Animated.Value(0),
    time: new Animated.Value(0),
  };

  const config = {
    damping: 1,
    mass: 1,
    stiffness: 50,
    overshootClamping: true,
    restSpeedThreshold: 0.001,
    restDisplacementThreshold: 0.001,
    toValue: new Animated.Value(0),
  };

  return [
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.velocity, velocity),
      set(state.position, from),
      set(config.toValue, toValue),
      startClock(clock),
    ]),
    spring(clock, state, config),
    cond(state.finished, [
      set(scrollEndDragVelocity, DRAG_END_INITIAL),
      set(
        snapOffset,
        cond(
          eq(toValue, 0),
          // SnapOffset acts as an accumulator.
          // We need to keep track of the previous offsets applied.
          add(snapOffset, multiply(diffClampNode, -1)),
          add(snapOffset, sub(NAV_BAR_HEIGHT, diffClampNode)),
        ),
      ),
      stopClock(clock),
    ]),
    state.position,
  ];
}
