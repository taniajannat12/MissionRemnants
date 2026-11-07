import * as THREE from 'three';
import { MaterialLibrary } from '../materials';

export function createVoyagerSpacecraft(materials: MaterialLibrary): {
  voyager: THREE.Group;
  goldenRecord: THREE.Mesh;
  scanPlatform: THREE.Group;
  cameraLens: THREE.Mesh;
} {
  const voyager = new THREE.Group();
  voyager.name = 'voyager_1_spacecraft';

  const busGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.48, 10);
  const bus = new THREE.Mesh(busGeo, materials.whiteMLI);
  bus.position.y = 0;
  bus.castShadow = true;
  voyager.add(bus);

  const dishGeo = new THREE.CylinderGeometry(1.9, 0.25, 0.45, 24, 1, true);
  const dish = new THREE.Mesh(dishGeo, materials.whiteMLI);
  dish.position.y = 0.45;
  dish.castShadow = true;
  voyager.add(dish);

  const bowlGeo = new THREE.SphereGeometry(1.85, 24, 12, 0, Math.PI * 2, 0, Math.PI * 0.32);
  const bowl = new THREE.Mesh(bowlGeo, materials.whiteMLI);
  bowl.rotation.x = Math.PI;
  bowl.position.y = 0.82;
  voyager.add(bowl);

  const subreflector = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.18, 12), materials.darkChassis);
  subreflector.rotation.x = Math.PI;
  subreflector.position.y = 1.35;
  voyager.add(subreflector);

  for (let i = 0; i < 3; i++) {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.1, 6), materials.silverMetal);
    const angle = (i * 2 * Math.PI) / 3;
    leg.position.set(Math.cos(angle) * 0.45, 0.9, Math.sin(angle) * 0.45);
    leg.rotation.y = angle;
    leg.rotation.z = Math.PI * 0.16;
    voyager.add(leg);
  }

  const rtgBoomGroup = new THREE.Group();
  rtgBoomGroup.position.set(-0.85, -0.15, 0);

  const rtgTruss = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.5, 6), materials.silverMetal);
  rtgTruss.rotation.z = Math.PI / 2;
  rtgTruss.position.x = -0.75;
  rtgBoomGroup.add(rtgTruss);

  for (let i = 0; i < 3; i++) {
    const rtgCan = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.36, 12), materials.darkChassis);
    rtgCan.rotation.x = Math.PI / 2;
    rtgCan.position.set(-1.0 - i * 0.32, 0, 0);
    rtgBoomGroup.add(rtgCan);

    const fins = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 0.32), materials.silverMetal);
    fins.position.set(-1.0 - i * 0.32, 0, 0);
    rtgBoomGroup.add(fins);
  }
  voyager.add(rtgBoomGroup);

  const scanBoomGroup = new THREE.Group();
  scanBoomGroup.position.set(0.85, 0.1, 0);

  const scanTruss = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.3, 6), materials.silverMetal);
  scanTruss.rotation.z = -Math.PI / 2;
  scanTruss.position.x = 0.65;
  scanBoomGroup.add(scanTruss);

  const scanPlatform = new THREE.Group();
  scanPlatform.position.set(1.35, 0, 0);

  const platformBox = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.28, 0.32), materials.goldFoil);
  scanPlatform.add(platformBox);

  const nacTelescope = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.35, 12), materials.darkChassis);
  nacTelescope.rotation.x = Math.PI / 2;
  nacTelescope.position.set(0, 0, 0.22);
  scanPlatform.add(nacTelescope);

  const cameraLens = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.02, 12), materials.opticalGlass);
  cameraLens.rotation.x = Math.PI / 2;
  cameraLens.position.set(0, 0, 0.4);
  cameraLens.name = 'voyager_camera_lens';
  scanPlatform.add(cameraLens);

  const wacTelescope = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.25, 10), materials.silverMetal);
  wacTelescope.rotation.x = Math.PI / 2;
  wacTelescope.position.set(0.12, 0.08, 0.18);
  scanPlatform.add(wacTelescope);

  scanBoomGroup.add(scanPlatform);
  voyager.add(scanBoomGroup);

  const magBoomGroup = new THREE.Group();
  magBoomGroup.position.set(0, -0.25, -0.85);

  const magRod = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 2.6, 6), materials.silverMetal);
  magRod.rotation.x = -Math.PI / 2;
  magRod.position.z = -1.3;
  magBoomGroup.add(magRod);

  const magSensor = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), materials.goldFoil);
  magSensor.position.z = -2.6;
  magBoomGroup.add(magSensor);

  voyager.add(magBoomGroup);

  [-Math.PI * 0.25, Math.PI * 0.25].forEach(ang => {
    const pwAntenna = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 2.8, 4), materials.silverMetal);
    pwAntenna.position.set(0, -0.4, 0.3);
    pwAntenna.rotation.z = ang;
    pwAntenna.rotation.x = Math.PI * 0.35;
    voyager.add(pwAntenna);
  });

  const recordGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.015, 24);
  recordGeo.rotateX(Math.PI / 2);
  const goldenRecord = new THREE.Mesh(recordGeo, materials.goldFoil);
  goldenRecord.position.set(0, 0, 0.86); 
  goldenRecord.name = 'golden_record';
  voyager.add(goldenRecord);

  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.008, 8, 24), materials.silverMetal);
  ring.position.set(0, 0, 0.87);
  voyager.add(ring);

  return { voyager, goldenRecord, scanPlatform, cameraLens };
}
