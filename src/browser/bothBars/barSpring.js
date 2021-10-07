'use strict';
exports.__esModule = true;
exports.runSpring = exports.NAV_BAR_HEIGHT = exports.DRAG_END_INITIAL = void 0;
var react_native_reanimated_1 = require('react-native-reanimated');
var diffClamp = react_native_reanimated_1.default.diffClamp,
  interpolate = react_native_reanimated_1.default.interpolateNode,
  reanimatedEvent = react_native_reanimated_1.default.event,
  multiply = react_native_reanimated_1.default.multiply,
  add = react_native_reanimated_1.default.add,
  cond = react_native_reanimated_1.default.cond,
  lessThan = react_native_reanimated_1.default.lessThan,
  neq = react_native_reanimated_1.default.neq,
  Clock = react_native_reanimated_1.default.Clock,
  Extrapolate = react_native_reanimated_1.default.Extrapolate,
  clockRunning = react_native_reanimated_1.default.clockRunning,
  set = react_native_reanimated_1.default.set,
  startClock = react_native_reanimated_1.default.startClock,
  spring = react_native_reanimated_1.default.spring,
  sub = react_native_reanimated_1.default.sub,
  stopClock = react_native_reanimated_1.default.stopClock,
  eq = react_native_reanimated_1.default.eq;
exports.DRAG_END_INITIAL = 10000000;
exports.NAV_BAR_HEIGHT = 44;
// https://github.com/rgommezz/reanimated-collapsible-navbar/blob/master/App.js#L36
function runSpring(_a) {
  var clock = _a.clock,
    from = _a.from,
    velocity = _a.velocity,
    toValue = _a.toValue,
    scrollEndDragVelocity = _a.scrollEndDragVelocity,
    snapOffset = _a.snapOffset,
    diffClampNode = _a.diffClampNode;
  var state = {
    finished: new react_native_reanimated_1.default.Value(0),
    velocity: new react_native_reanimated_1.default.Value(0),
    position: new react_native_reanimated_1.default.Value(0),
    time: new react_native_reanimated_1.default.Value(0),
  };
  var config = {
    damping: 1,
    mass: 1,
    stiffness: 50,
    overshootClamping: true,
    restSpeedThreshold: 0.001,
    restDisplacementThreshold: 0.001,
    toValue: new react_native_reanimated_1.default.Value(0),
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
      set(scrollEndDragVelocity, exports.DRAG_END_INITIAL),
      set(
        snapOffset,
        cond(
          eq(toValue, 0),
          // SnapOffset acts as an accumulator.
          // We need to keep track of the previous offsets applied.
          add(snapOffset, multiply(diffClampNode, -1)),
          add(snapOffset, sub(exports.NAV_BAR_HEIGHT, diffClampNode)),
        ),
      ),
      stopClock(clock),
    ]),
    state.position,
  ];
}
exports.runSpring = runSpring;
