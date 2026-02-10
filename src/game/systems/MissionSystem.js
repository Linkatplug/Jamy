import { MISSION_TIME_LIMIT, POINTS_PER_SECOND, COLLISION_PENALTY, PICKUP_ZONE, DELIVERY_ZONE } from '../utils/constants.js';

/**
 * MissionSystem - Manages mission objectives, timer, and scoring
 */
export default class MissionSystem {
  constructor(scene) {
    this.scene = scene;
    this.reset();
  }

  reset() {
    this.timeRemaining = MISSION_TIME_LIMIT;
    this.collisions = 0;
    this.cargoPickedUp = false;
    this.missionComplete = false;
    this.score = 0;
  }

  update(delta) {
    if (this.missionComplete) return;

    // Update timer
    this.timeRemaining -= delta / 1000;
    
    if (this.timeRemaining <= 0) {
      this.timeRemaining = 0;
      this.endMission(false); // Time's up
    }
  }

  checkPickupZone(truck) {
    if (this.cargoPickedUp) return;

    const bounds = truck.getBounds();
    const zone = PICKUP_ZONE;
    
    if (this.checkOverlap(bounds, zone)) {
      this.cargoPickedUp = true;
      this.scene.events.emit('cargoPickedUp');
      return true;
    }
    return false;
  }

  checkDeliveryZone(truck) {
    if (!this.cargoPickedUp || this.missionComplete) return;

    const bounds = truck.getBounds();
    const zone = DELIVERY_ZONE;
    
    if (this.checkOverlap(bounds, zone)) {
      this.endMission(true); // Success
      return true;
    }
    return false;
  }

  checkOverlap(bounds, zone) {
    return bounds.x < zone.x + zone.width &&
           bounds.x + bounds.width > zone.x &&
           bounds.y < zone.y + zone.height &&
           bounds.y + bounds.height > zone.y;
  }

  registerCollision() {
    this.collisions++;
    this.scene.events.emit('collision', this.collisions);
  }

  endMission(success) {
    if (this.missionComplete) return;
    
    this.missionComplete = true;
    
    if (success) {
      // Calculate score: time bonus - collision penalties
      const timeBonus = Math.floor(this.timeRemaining * POINTS_PER_SECOND);
      const collisionPenalty = this.collisions * COLLISION_PENALTY;
      this.score = Math.max(0, timeBonus - collisionPenalty);
    } else {
      this.score = 0;
    }

    this.scene.events.emit('missionEnd', {
      success,
      score: this.score,
      timeRemaining: this.timeRemaining,
      collisions: this.collisions
    });
  }

  getCurrentObjective() {
    if (!this.cargoPickedUp) {
      return 'Pick up cargo';
    } else if (!this.missionComplete) {
      return 'Deliver cargo';
    }
    return 'Mission Complete!';
  }

  getTargetPosition() {
    if (!this.cargoPickedUp) {
      return { x: PICKUP_ZONE.x + PICKUP_ZONE.width / 2, y: PICKUP_ZONE.y + PICKUP_ZONE.height / 2 };
    } else {
      return { x: DELIVERY_ZONE.x + DELIVERY_ZONE.width / 2, y: DELIVERY_ZONE.y + DELIVERY_ZONE.height / 2 };
    }
  }
}
