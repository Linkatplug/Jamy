import { 
  MISSION_TIME_LIMIT, 
  POINTS_PER_SECOND, 
  COLLISION_PENALTY, 
  PICKUP_ZONE, 
  DELIVERY_ZONE,
  MISSION_TYPES,
  MISSION_ZONES,
  SPEED_BONUS_THRESHOLD,
  PERFECT_DELIVERY_BONUS,
  LEVELS
} from '../utils/constants.js';

/**
 * MissionSystem - Enhanced mission system with multiple mission types and level support
 */
export default class MissionSystem {
  constructor(scene, missionType = MISSION_TYPES.STANDARD, levelKey = 'LEVEL_1') {
    this.scene = scene;
    this.missionType = missionType;
    this.levelKey = levelKey;
    this.levelData = LEVELS[levelKey];
    this.reset();
    this.setupMission();
  }

  reset() {
    this.startTime = Date.now();
    this.timeRemaining = MISSION_TIME_LIMIT;
    this.collisions = 0;
    this.cargoPickedUp = false;
    this.missionComplete = false;
    this.score = 0;
    this.currentStop = 0;
    this.stops = [];
    this.perfectDelivery = true;
  }

  setupMission() {
    switch (this.missionType) {
      case MISSION_TYPES.STANDARD:
        this.setupStandardMission();
        break;
      case MISSION_TYPES.TIME_TRIAL:
        this.setupTimeTrialMission();
        break;
      case MISSION_TYPES.CAREFUL:
        this.setupCarefulMission();
        break;
      case MISSION_TYPES.MULTI_STOP:
        this.setupMultiStopMission();
        break;
      case MISSION_TYPES.PARKING:
        this.setupParkingMission();
        break;
      default:
        this.setupStandardMission();
    }
  }

  setupStandardMission() {
    this.missionName = 'Standard Delivery';
    this.missionDescription = 'Pick up and deliver cargo';
    // Use level-specific zones
    this.stops = [
      { zone: this.levelData.pickupZone, type: 'pickup', label: 'PICKUP' },
      { zone: this.levelData.deliveryZone, type: 'delivery', label: 'DELIVERY' }
    ];
  }

  setupTimeTrialMission() {
    this.missionName = 'Time Trial';
    this.missionDescription = 'Deliver as fast as possible!';
    this.timeRemaining = 90; // Shorter time limit
    this.stops = [
      { zone: MISSION_ZONES.ZONE_A, type: 'pickup', label: 'START' },
      { zone: MISSION_ZONES.ZONE_B, type: 'delivery', label: 'FINISH' }
    ];
  }

  setupCarefulMission() {
    this.missionName = 'Careful Delivery';
    this.missionDescription = 'Fragile cargo - avoid collisions!';
    // Use level-specific zones
    this.stops = [
      { zone: this.levelData.pickupZone, type: 'pickup', label: 'PICKUP' },
      { zone: this.levelData.deliveryZone, type: 'delivery', label: 'DELIVERY' }
    ];
  }

  setupMultiStopMission() {
    this.missionName = 'Multi-Stop Route';
    this.missionDescription = 'Complete all deliveries';
    this.timeRemaining = 180; // More time for multiple stops
    this.stops = [
      { zone: MISSION_ZONES.ZONE_A, type: 'pickup', label: 'PICKUP 1' },
      { zone: MISSION_ZONES.ZONE_C, type: 'delivery', label: 'DROP 1' },
      { zone: MISSION_ZONES.ZONE_D, type: 'pickup', label: 'PICKUP 2' },
      { zone: MISSION_ZONES.ZONE_B, type: 'delivery', label: 'DROP 2' }
    ];
  }

  setupParkingMission() {
    this.missionName = 'Precision Parking';
    this.missionDescription = 'Park perfectly in the zone';
    // Use level-specific delivery zone for parking
    this.stops = [
      { zone: this.levelData.deliveryZone, type: 'park', label: 'PARKING' }
    ];
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
    if (this.currentStop >= this.stops.length) return false;
    
    const currentStopData = this.stops[this.currentStop];
    if (currentStopData.type !== 'pickup') return false;

    const bounds = truck.getBounds();
    const zone = currentStopData.zone;
    
    if (this.checkOverlap(bounds, zone)) {
      this.cargoPickedUp = true;
      this.currentStop++;
      this.scene.events.emit('cargoPickedUp', this.currentStop);
      return true;
    }
    return false;
  }

  checkDeliveryZone(truck) {
    if (this.currentStop >= this.stops.length) return false;
    if (this.missionComplete) return false;
    
    const currentStopData = this.stops[this.currentStop];
    if (currentStopData.type !== 'delivery' && currentStopData.type !== 'park') return false;
    if (currentStopData.type === 'delivery' && !this.cargoPickedUp) return false;

    const bounds = truck.getBounds();
    const zone = currentStopData.zone;
    
    if (this.checkOverlap(bounds, zone)) {
      this.currentStop++;
      
      // Check if this was the last stop
      if (this.currentStop >= this.stops.length) {
        this.endMission(true); // Success
      } else {
        // More stops remaining
        this.cargoPickedUp = false;
        this.scene.events.emit('stopCompleted', this.currentStop);
      }
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
    this.perfectDelivery = false;
    this.scene.events.emit('collision', this.collisions);
  }

  endMission(success) {
    if (this.missionComplete) return;
    
    this.missionComplete = true;
    const elapsedTime = MISSION_TIME_LIMIT - this.timeRemaining;
    
    if (success) {
      // Calculate base score
      const timeBonus = Math.floor(this.timeRemaining * POINTS_PER_SECOND);
      const collisionPenalty = this.collisions * COLLISION_PENALTY;
      let totalScore = Math.max(0, timeBonus - collisionPenalty);
      
      // Mission-specific bonuses
      const bonuses = [];
      
      // Speed bonus for time trial or fast completion
      if (this.missionType === MISSION_TYPES.TIME_TRIAL || elapsedTime < SPEED_BONUS_THRESHOLD) {
        const speedBonus = Math.floor((MISSION_TIME_LIMIT - elapsedTime) * 5);
        totalScore += speedBonus;
        bonuses.push({ name: 'Speed Bonus', value: speedBonus });
      }
      
      // Perfect delivery bonus (no collisions)
      if (this.perfectDelivery && this.collisions === 0) {
        totalScore += PERFECT_DELIVERY_BONUS;
        bonuses.push({ name: 'Perfect Delivery!', value: PERFECT_DELIVERY_BONUS });
      }
      
      // Careful mission multiplier
      if (this.missionType === MISSION_TYPES.CAREFUL && this.collisions <= 1) {
        const carefulBonus = Math.floor(totalScore * 0.5);
        totalScore += carefulBonus;
        bonuses.push({ name: 'Careful Driver', value: carefulBonus });
      }
      
      // Multi-stop completion bonus
      if (this.missionType === MISSION_TYPES.MULTI_STOP) {
        const multiStopBonus = 1000;
        totalScore += multiStopBonus;
        bonuses.push({ name: 'Multi-Stop Complete', value: multiStopBonus });
      }
      
      this.score = totalScore;
      
      this.scene.events.emit('missionEnd', {
        success,
        score: this.score,
        timeRemaining: this.timeRemaining,
        elapsedTime,
        collisions: this.collisions,
        missionType: this.missionType,
        missionName: this.missionName,
        bonuses,
        perfectDelivery: this.perfectDelivery
      });
    } else {
      this.score = 0;
      this.scene.events.emit('missionEnd', {
        success,
        score: 0,
        timeRemaining: this.timeRemaining,
        collisions: this.collisions,
        missionType: this.missionType,
        missionName: this.missionName,
        bonuses: [],
        perfectDelivery: false
      });
    }
  }

  getCurrentObjective() {
    if (this.currentStop >= this.stops.length) {
      return 'Mission Complete!';
    }
    
    const currentStopData = this.stops[this.currentStop];
    
    switch (currentStopData.type) {
      case 'pickup':
        return `Go to ${currentStopData.label}`;
      case 'delivery':
        return `Deliver to ${currentStopData.label}`;
      case 'park':
        return `Park in ${currentStopData.label}`;
      default:
        return 'Follow objective';
    }
  }

  getTargetPosition() {
    if (this.currentStop >= this.stops.length) {
      return { x: this.levelData.deliveryZone.x + this.levelData.deliveryZone.width / 2, 
               y: this.levelData.deliveryZone.y + this.levelData.deliveryZone.height / 2 };
    }
    
    const zone = this.stops[this.currentStop].zone;
    return { x: zone.x + zone.width / 2, y: zone.y + zone.height / 2 };
  }

  getMissionProgress() {
    return `${this.currentStop} / ${this.stops.length}`;
  }
}
