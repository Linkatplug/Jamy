import { CONTROLS } from '../utils/constants.js';

/**
 * InputSystem - Manages keyboard input and control mapping
 */
export default class InputSystem {
  constructor(scene) {
    this.scene = scene;
    this.keys = {};
    this.setupKeys();
  }

  setupKeys() {
    const keyboard = this.scene.input.keyboard;
    
    // Create key objects for all controls
    this.keys.forward = CONTROLS.FORWARD.map(key => keyboard.addKey(key));
    this.keys.backward = CONTROLS.BACKWARD.map(key => keyboard.addKey(key));
    this.keys.left = CONTROLS.LEFT.map(key => keyboard.addKey(key));
    this.keys.right = CONTROLS.RIGHT.map(key => keyboard.addKey(key));
    this.keys.handbrake = CONTROLS.HANDBRAKE.map(key => keyboard.addKey(key));
    this.keys.jump = CONTROLS.JUMP.map(key => keyboard.addKey(key));
    this.keys.reset = CONTROLS.RESET.map(key => keyboard.addKey(key));
    this.keys.pause = CONTROLS.PAUSE.map(key => keyboard.addKey(key));
  }

  isPressed(keyGroup) {
    return this.keys[keyGroup].some(key => key.isDown);
  }

  isJustPressed(keyGroup) {
    return this.keys[keyGroup].some(key => Phaser.Input.Keyboard.JustDown(key));
  }

  getInput() {
    return {
      forward: this.isPressed('forward'),
      backward: this.isPressed('backward'),
      left: this.isPressed('left'),
      right: this.isPressed('right'),
      handbrake: this.isPressed('handbrake'),
      jump: this.isJustPressed('jump'),
      reset: this.isJustPressed('reset'),
      pause: this.isJustPressed('pause')
    };
  }

  destroy() {
    // Cleanup if needed
    this.keys = {};
  }
}
