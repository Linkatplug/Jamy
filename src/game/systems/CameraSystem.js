/**
 * CameraSystem - Manages camera follow and deadzone
 */
export default class CameraSystem {
  constructor(scene, target, worldBounds) {
    this.scene = scene;
    this.camera = scene.cameras.main;
    this.target = target;
    
    // Set world bounds
    if (worldBounds) {
      this.camera.setBounds(0, 0, worldBounds.width, worldBounds.height);
    }
    
    // Follow target with deadzone for smoother camera
    this.camera.startFollow(target, true, 0.1, 0.1);
    this.camera.setDeadzone(100, 60);
  }

  setTarget(target) {
    this.target = target;
    this.camera.startFollow(target, true, 0.1, 0.1);
  }

  shake(duration = 100, intensity = 0.005) {
    this.camera.shake(duration, intensity);
  }

  flash(duration = 100, color = 0xffffff) {
    this.camera.flash(duration, color);
  }

  update() {
    // Camera updates automatically when following
  }
}
