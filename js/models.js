/**
 * ALPINESCAPE - Enhanced 3D Models & Procedural World Generator
 * Features:
 * - Mountain terrain, alpine pine forests, pristine lake, luxury resort
 * - Infinity pool with underwater LED lighting adjoining the lake
 * - Mountain summit lookout atop Cloudcrest Peak
 * - Interactive Alpine Cable Car / Gondola system gliding in real-time
 * - Living Wildlife: Soaring Mountain Eagle & Lake Swans
 * - Sunken Lakeside Firepit Lounge with campfire
 * - Dynamic Weather Engines: Rain, Snow Flurries, Mist, Rainbow
 * - Night Stargazer Constellations (Orion, Ursa Major, Cassiopeia, Romantic Heart)
 * - Couple Avatars with multiple poses (Breakfast, Summit, Starry Pool, Bed, Swimming)
 */

class WorldBuilder {
  constructor(scene) {
    this.scene = scene;
    this.materials = {};
    this.interactiveObjects = [];
    this.animatedObjects = [];

    // Key Groups
    this.mountainGroup = new THREE.Group();
    this.lakeGroup = new THREE.Group();
    this.resortGroup = new THREE.Group();
    this.summitGroup = new THREE.Group();
    this.gondolaGroup = new THREE.Group();
    this.faunaGroup = new THREE.Group();
    this.weatherGroup = new THREE.Group();
    this.coupleGroup = new THREE.Group();
    this.skyGroup = new THREE.Group();

    // Lighting refs
    this.sunLight = null;
    this.moonLight = null;
    this.ambientLight = null;
    this.poolLights = [];
    this.resortLights = [];
    this.fireplaceLight = null;
    this.firepitLight = null;

    // Couple Avatars
    this.coupleModels = {};

    // Weather particle systems
    this.rainSystem = null;
    this.snowSystem = null;
    this.mistSystem = null;
    this.rainbowMesh = null;
    this.currentWeather = 'sunny';

    // Constellations
    this.constellationGroup = new THREE.Group();

    this.initMaterials();
  }

  initMaterials() {
    this.materials.rock = new THREE.MeshStandardMaterial({
      color: 0x5a6577,
      roughness: 0.9,
      metalness: 0.1,
      flatShading: true
    });

    this.materials.snow = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.4,
      metalness: 0.05
    });

    this.materials.grass = new THREE.MeshStandardMaterial({
      color: 0x3d6b45,
      roughness: 0.85,
      metalness: 0.05,
      flatShading: true
    });

    this.materials.wood = new THREE.MeshStandardMaterial({
      color: 0x8b5a2b,
      roughness: 0.65,
      metalness: 0.1
    });

    this.materials.darkWood = new THREE.MeshStandardMaterial({
      color: 0x4a2e18,
      roughness: 0.7,
      metalness: 0.1
    });

    this.materials.glass = new THREE.MeshPhysicalMaterial({
      color: 0xdbeafe,
      transmission: 0.92,
      opacity: 1,
      transparent: true,
      roughness: 0.08,
      ior: 1.5,
      reflectivity: 0.8
    });

    this.materials.lakeWater = new THREE.MeshStandardMaterial({
      color: 0x0c4a6e,
      roughness: 0.15,
      metalness: 0.35,
      transparent: true,
      opacity: 0.88
    });

    this.materials.poolWater = new THREE.MeshPhysicalMaterial({
      color: 0x06b6d4,
      transmission: 0.78,
      opacity: 0.84,
      transparent: true,
      roughness: 0.1,
      ior: 1.333,
      reflectivity: 0.85
    });

    this.materials.poolGlow = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.8
    });

    this.materials.warmLight = new THREE.MeshBasicMaterial({
      color: 0xfef08a
    });

    this.materials.fire = new THREE.MeshBasicMaterial({
      color: 0xf97316
    });

    this.materials.pineNeedles = new THREE.MeshStandardMaterial({
      color: 0x1e3a24,
      roughness: 0.8,
      metalness: 0.1,
      flatShading: true
    });

    this.materials.metalRed = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      roughness: 0.3,
      metalness: 0.6
    });
  }

  buildAll() {
    this.scene.add(this.mountainGroup);
    this.scene.add(this.lakeGroup);
    this.scene.add(this.resortGroup);
    this.scene.add(this.summitGroup);
    this.scene.add(this.gondolaGroup);
    this.scene.add(this.faunaGroup);
    this.scene.add(this.weatherGroup);
    this.scene.add(this.coupleGroup);
    this.scene.add(this.skyGroup);

    this.setupLighting();
    this.buildTerrainAndMountains();
    this.buildPineForests();
    this.buildAlpineLake();
    this.buildResortChalet();
    this.buildInfinityPool();
    this.buildLakesideDeckAndBreakfast();
    this.buildSunkenFirepitLounge();
    this.buildMountainSummit();
    this.buildBedroomInterior();
    this.buildCableCarGondola();
    this.buildWildlifeFauna();
    this.buildCoupleAvatars();
    this.buildSkyAndCosmos();
    this.buildConstellations();
    this.buildWeatherEngines();
    this.buildParticles();

    return {
      couple: this.coupleModels,
      animated: this.animatedObjects,
      interactives: this.interactiveObjects
    };
  }

  // =========================================================================
  // LIGHTING & AMBIENT
  // =========================================================================
  setupLighting() {
    this.ambientLight = new THREE.AmbientLight(0xfff7ed, 0.45);
    this.scene.add(this.ambientLight);

    this.sunLight = new THREE.DirectionalLight(0xffeedd, 1.8);
    this.sunLight.position.set(60, 80, 40);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 1;
    this.sunLight.shadow.camera.far = 300;
    const d = 80;
    this.sunLight.shadow.camera.left = -d;
    this.sunLight.shadow.camera.right = d;
    this.sunLight.shadow.camera.top = d;
    this.sunLight.shadow.camera.bottom = -d;
    this.sunLight.shadow.bias = -0.0005;
    this.scene.add(this.sunLight);

    this.moonLight = new THREE.DirectionalLight(0x7dd3fc, 0.0);
    this.moonLight.position.set(-60, 70, -40);
    this.scene.add(this.moonLight);
  }

  // =========================================================================
  // TERRAIN & MOUNTAIN PEAKS
  // =========================================================================
  buildTerrainAndMountains() {
    const size = 320;
    const segments = 120;
    const geometry = new THREE.PlaneGeometry(size, size, segments, segments);
    geometry.rotateX(-Math.PI / 2);

    const pos = geometry.attributes.position;
    const vertex = new THREE.Vector3();
    const colors = [];

    for (let i = 0; i < pos.count; i++) {
      vertex.fromBufferAttribute(pos, i);
      const distFromCenter = Math.sqrt(vertex.x * vertex.x + vertex.z * vertex.z);

      let height = 0;
      const lakeDist = Math.hypot(vertex.x + 25, vertex.z - 10);
      const resortDist = Math.hypot(vertex.x - 12, vertex.z - 6);
      const summitDist = Math.hypot(vertex.x - 35, vertex.z + 55);

      if (lakeDist < 38) {
        height = -2.5 + Math.sin(vertex.x * 0.2) * 0.4;
      } else if (resortDist < 25) {
        height = 1.2 + Math.sin(vertex.x * 0.1) * 0.3;
      } else if (summitDist < 30) {
        const factor = Math.max(0, 1 - summitDist / 30);
        height = 58 * Math.pow(factor, 1.4) + Math.sin(vertex.x * 0.5) * 3;
      } else {
        const n1 = Math.sin(vertex.x * 0.035) * Math.cos(vertex.z * 0.035) * 22;
        const n2 = Math.sin(vertex.x * 0.08 + 1.2) * Math.cos(vertex.z * 0.07) * 14;
        const n3 = Math.sin(vertex.x * 0.15) * Math.cos(vertex.z * 0.18) * 5;
        const edgeDist = Math.max(0, distFromCenter - 45);
        height = (n1 + n2 + n3 + 12) * (edgeDist / 70);
      }

      pos.setY(i, height);

      let color;
      if (height < 2.0) {
        color = new THREE.Color(0x3e5239);
      } else if (height < 18) {
        color = new THREE.Color(0x2d4f33);
      } else if (height < 38) {
        color = new THREE.Color(0x56616e);
      } else {
        color = new THREE.Color(0xf1f5f9);
      }
      colors.push(color.r, color.g, color.b);
    }

    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.85,
      metalness: 0.1,
      flatShading: true
    });

    const terrain = new THREE.Mesh(geometry, terrainMat);
    terrain.receiveShadow = true;
    this.mountainGroup.add(terrain);
  }

  // =========================================================================
  // PINE CONIFER FORESTS
  // =========================================================================
  buildPineForests() {
    const treeCount = 280;
    const treeGroup = new THREE.Group();

    const trunkGeo = new THREE.CylinderGeometry(0.2, 0.35, 2.5, 6);
    const trunk = new THREE.Mesh(trunkGeo, this.materials.darkWood);
    trunk.position.y = 1.25;
    treeGroup.add(trunk);

    const fMat = this.materials.pineNeedles;
    for (let c = 0; c < 3; c++) {
      const coneGeo = new THREE.ConeGeometry(1.6 - c * 0.35, 2.2, 7);
      const cone = new THREE.Mesh(coneGeo, fMat);
      cone.position.y = 2.4 + c * 1.3;
      cone.castShadow = true;
      treeGroup.add(cone);
    }

    for (let i = 0; i < treeCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 28 + Math.random() * 95;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      const lakeDist = Math.hypot(x + 25, z - 10);
      const resortDist = Math.hypot(x - 12, z - 6);
      const summitDist = Math.hypot(x - 35, z + 55);

      if (lakeDist > 28 && resortDist > 16 && summitDist > 12) {
        const distFromCenter = Math.sqrt(x * x + z * z);
        const edgeDist = Math.max(0, distFromCenter - 45);
        const y = Math.max(0.5, (Math.sin(x * 0.05) * 10 + 10) * (edgeDist / 70));

        if (y < 35) {
          const scale = 0.7 + Math.random() * 0.8;
          const clone = treeGroup.clone();
          clone.position.set(x, y - 0.2, z);
          clone.scale.set(scale, scale, scale);
          clone.rotation.y = Math.random() * Math.PI * 2;
          this.mountainGroup.add(clone);
        }
      }
    }
  }

  // =========================================================================
  // THE PRISTINE ALPINE LAKE
  // =========================================================================
  buildAlpineLake() {
    const lakeGeo = new THREE.PlaneGeometry(85, 75, 48, 48);
    lakeGeo.rotateX(-Math.PI / 2);

    this.lakeWaterMesh = new THREE.Mesh(lakeGeo, this.materials.lakeWater);
    this.lakeWaterMesh.position.set(-25, 0.15, 10);
    this.lakeWaterMesh.receiveShadow = true;
    this.lakeGroup.add(this.lakeWaterMesh);

    // Wooden boat dock
    const dock = new THREE.Group();
    const dockPlankGeo = new THREE.BoxGeometry(3.5, 0.3, 14);
    const dockPlank = new THREE.Mesh(dockPlankGeo, this.materials.wood);
    dockPlank.position.set(0, 0.6, 7);
    dockPlank.castShadow = true;
    dockPlank.receiveShadow = true;
    dock.add(dockPlank);

    for (let p = 0; p < 4; p++) {
      const poleGeo = new THREE.CylinderGeometry(0.15, 0.15, 3.2, 8);
      const pole = new THREE.Mesh(poleGeo, this.materials.darkWood);
      pole.position.set((p % 2 === 0 ? -1.5 : 1.5), -0.5, 3 + Math.floor(p / 2) * 7);
      dock.add(pole);
    }

    const boat = this.buildRowboat();
    boat.position.set(-3.2, 0.35, 11);
    boat.rotation.y = 0.3;
    dock.add(boat);

    dock.position.set(-8, 0, 8);
    this.lakeGroup.add(dock);

    this.animatedObjects.push({
      type: 'water',
      mesh: this.lakeWaterMesh,
      initialY: 0.15
    });

    for (let b = 0; b < 24; b++) {
      const rockGeo = new THREE.DodecahedronGeometry(0.8 + Math.random() * 1.2, 1);
      const rock = new THREE.Mesh(rockGeo, this.materials.rock);
      const theta = (b / 24) * Math.PI * 2;
      const r = 32 + (Math.random() - 0.5) * 8;
      rock.position.set(-25 + Math.cos(theta) * r, 0.3, 10 + Math.sin(theta) * r);
      rock.rotation.set(Math.random(), Math.random(), Math.random());
      rock.castShadow = true;
      this.lakeGroup.add(rock);
    }
  }

  buildRowboat() {
    const boat = new THREE.Group();
    const hullGeo = new THREE.BoxGeometry(1.8, 0.8, 4.2);
    const hull = new THREE.Mesh(hullGeo, this.materials.wood);
    hull.position.y = 0.4;
    boat.add(hull);

    const benchGeo = new THREE.BoxGeometry(1.5, 0.15, 0.6);
    const bench = new THREE.Mesh(benchGeo, this.materials.darkWood);
    bench.position.set(0, 0.6, 0);
    boat.add(bench);

    const oarGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.6);
    const oar1 = new THREE.Mesh(oarGeo, this.materials.wood);
    oar1.rotation.z = 1.1;
    oar1.position.set(0.9, 0.7, 0.2);
    boat.add(oar1);

    this.animatedObjects.push({
      type: 'bobbing',
      object: boat,
      speed: 1.8,
      intensity: 0.08
    });

    return boat;
  }

  // =========================================================================
  // LUXURY MOUNTAIN RESORT CHALET
  // =========================================================================
  buildResortChalet() {
    const chalet = new THREE.Group();
    chalet.position.set(12, 1.2, -6);

    const foundationGeo = new THREE.BoxGeometry(22, 1.8, 16);
    const foundation = new THREE.Mesh(foundationGeo, this.materials.rock);
    foundation.position.y = 0.9;
    foundation.receiveShadow = true;
    chalet.add(foundation);

    const buildingGeo = new THREE.BoxGeometry(18, 6.5, 13);
    const building = new THREE.Mesh(buildingGeo, this.materials.wood);
    building.position.set(0, 5.0, 0);
    building.castShadow = true;
    building.receiveShadow = true;
    chalet.add(building);

    const glassWallGeo = new THREE.BoxGeometry(14, 5.2, 0.3);
    const glassWall = new THREE.Mesh(glassWallGeo, this.materials.glass);
    glassWall.position.set(-2, 4.6, 6.6);
    chalet.add(glassWall);

    const roof = new THREE.Group();
    const roof1Geo = new THREE.BoxGeometry(12, 0.4, 16);
    const roof1 = new THREE.Mesh(roof1Geo, this.materials.darkWood);
    roof1.rotation.z = 0.38;
    roof1.position.set(-5, 9.2, 0);
    roof.add(roof1);

    const roof2 = new THREE.Mesh(roof1Geo, this.materials.darkWood);
    roof2.rotation.z = -0.38;
    roof2.position.set(5, 9.2, 0);
    roof.add(roof2);
    chalet.add(roof);

    const chimneyGeo = new THREE.BoxGeometry(1.8, 11, 2.2);
    const chimney = new THREE.Mesh(chimneyGeo, this.materials.rock);
    chimney.position.set(7, 6.5, -4);
    chimney.castShadow = true;
    chalet.add(chimney);

    const interiorLight = new THREE.PointLight(0xffedd5, 1.4, 25);
    interiorLight.position.set(0, 5, 0);
    chalet.add(interiorLight);
    this.resortLights.push(interiorLight);

    const balconyGeo = new THREE.BoxGeometry(16, 0.3, 3.5);
    const balcony = new THREE.Mesh(balconyGeo, this.materials.darkWood);
    balcony.position.set(-1, 4.8, 8.2);
    chalet.add(balcony);

    for (let lx = -6; lx <= 6; lx += 6) {
      const lanternGeo = new THREE.BoxGeometry(0.3, 0.5, 0.3);
      const lantern = new THREE.Mesh(lanternGeo, this.materials.warmLight);
      lantern.position.set(lx, 5.5, 6.7);
      chalet.add(lantern);

      const lamp = new THREE.PointLight(0xfbbf24, 0.8, 8);
      lamp.position.set(lx, 5.4, 7.2);
      chalet.add(lamp);
      this.resortLights.push(lamp);
    }

    this.resortGroup.add(chalet);
  }

  // =========================================================================
  // THE ADJOINING INFINITY SWIMMING POOL
  // =========================================================================
  buildInfinityPool() {
    const poolGroup = new THREE.Group();
    poolGroup.position.set(3, 1.8, 6.5);

    const deckOuterGeo = new THREE.BoxGeometry(16, 1.2, 11);
    const deckOuter = new THREE.Mesh(deckOuterGeo, this.materials.wood);
    deckOuter.position.set(0, -0.6, 0);
    deckOuter.receiveShadow = true;
    poolGroup.add(deckOuter);

    const basinMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.3,
      metalness: 0.2
    });

    const basinGeo = new THREE.BoxGeometry(12.5, 1.4, 7.5);
    const basin = new THREE.Mesh(basinGeo, basinMat);
    basin.position.set(-1, -0.7, 0);
    poolGroup.add(basin);

    const poolWaterGeo = new THREE.PlaneGeometry(12.2, 7.2);
    poolWaterGeo.rotateX(-Math.PI / 2);
    this.poolWaterMesh = new THREE.Mesh(poolWaterGeo, this.materials.poolWater);
    this.poolWaterMesh.position.set(-1, -0.05, 0);
    poolGroup.add(this.poolWaterMesh);

    const weirGeo = new THREE.BoxGeometry(0.3, 0.2, 7.4);
    const weir = new THREE.Mesh(weirGeo, this.materials.glass);
    weir.position.set(-7.1, -0.02, 0);
    poolGroup.add(weir);

    for (let s = 0; s < 3; s++) {
      const stepGeo = new THREE.BoxGeometry(1.4, 0.25, 4.0);
      const step = new THREE.Mesh(stepGeo, basinMat);
      step.position.set(4.2 - s * 0.9, -0.35 - s * 0.25, 0);
      poolGroup.add(step);
    }

    for (let p = -2; p <= 2; p += 2) {
      const ledLamp = new THREE.PointLight(0x06b6d4, 1.6, 10);
      ledLamp.position.set(-1 + p * 2.2, -0.8, 0);
      poolGroup.add(ledLamp);
      this.poolLights.push(ledLamp);

      const bulbGeo = new THREE.SphereGeometry(0.12, 8, 8);
      const bulb = new THREE.Mesh(bulbGeo, this.materials.poolGlow);
      bulb.position.copy(ledLamp.position);
      poolGroup.add(bulb);
    }

    // Teak sun loungers
    for (let l = 0; l < 2; l++) {
      const lounger = new THREE.Group();
      const frameGeo = new THREE.BoxGeometry(3.6, 0.25, 1.4);
      const frame = new THREE.Mesh(frameGeo, this.materials.darkWood);
      lounger.add(frame);

      const cushionMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.9 });
      const cushionGeo = new THREE.BoxGeometry(3.5, 0.2, 1.3);
      const cushion = new THREE.Mesh(cushionGeo, cushionMat);
      cushion.position.y = 0.2;
      lounger.add(cushion);

      const headGeo = new THREE.BoxGeometry(1.0, 0.25, 1.3);
      const head = new THREE.Mesh(headGeo, cushionMat);
      head.rotation.z = -0.4;
      head.position.set(1.4, 0.45, 0);
      lounger.add(head);

      lounger.position.set(2.5, 0.25, 3.8 - l * 2.2);
      lounger.rotation.y = -Math.PI / 2;
      poolGroup.add(lounger);
    }

    // Floating Cocktail / Breakfast Tray on Pool Water
    const trayGroup = new THREE.Group();
    trayGroup.position.set(-1.8, 0.05, 1.2);
    const trayPlank = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.08, 0.8), this.materials.wood);
    trayGroup.add(trayPlank);

    // Champagne flutes on tray
    const fluteMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.9, opacity: 0.9, transparent: true });
    for (let f = 0; f < 2; f++) {
      const flute = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.03, 0.25, 8), fluteMat);
      flute.position.set(f === 0 ? -0.2 : 0.2, 0.16, 0);
      trayGroup.add(flute);
    }
    poolGroup.add(trayGroup);

    this.animatedObjects.push({
      type: 'bobbing',
      object: trayGroup,
      speed: 1.5,
      intensity: 0.04
    });

    this.animatedObjects.push({
      type: 'water',
      mesh: this.poolWaterMesh,
      initialY: -0.05
    });

    this.resortGroup.add(poolGroup);
  }

  // =========================================================================
  // SUNKEN LAKESIDE FIREPIT LOUNGE
  // =========================================================================
  buildSunkenFirepitLounge() {
    const firepitGroup = new THREE.Group();
    firepitGroup.position.set(10.5, 1.5, 9.5);

    // Circular stone pit
    const pitGeo = new THREE.CylinderGeometry(2.4, 2.4, 0.8, 24);
    const pit = new THREE.Mesh(pitGeo, this.materials.rock);
    pit.position.y = 0.4;
    firepitGroup.add(pit);

    // Circular curved wooden bench seating
    const seatGeo = new THREE.TorusGeometry(3.6, 0.35, 8, 24, Math.PI * 1.3);
    seatGeo.rotateX(Math.PI / 2);
    const seat = new THREE.Mesh(seatGeo, this.materials.wood);
    seat.position.set(0, 0.7, 0);
    seat.rotation.z = 0.6;
    firepitGroup.add(seat);

    // Campfire wood logs & flame
    const logGeo = new THREE.CylinderGeometry(0.1, 0.1, 1.2, 8);
    for (let l = 0; l < 4; l++) {
      const log = new THREE.Mesh(logGeo, this.materials.darkWood);
      log.rotation.z = 0.4 + l * 0.4;
      log.rotation.y = l * (Math.PI / 2);
      log.position.y = 0.6;
      firepitGroup.add(log);
    }

    const fireGeo = new THREE.ConeGeometry(0.4, 0.7, 6);
    this.firepitMesh = new THREE.Mesh(fireGeo, this.materials.fire);
    this.firepitMesh.position.set(0, 0.9, 0);
    firepitGroup.add(this.firepitMesh);

    this.firepitLight = new THREE.PointLight(0xf97316, 1.6, 14);
    this.firepitLight.position.set(0, 1.2, 0);
    firepitGroup.add(this.firepitLight);

    // Marshmallow stick
    const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.6), this.materials.wood);
    stick.position.set(1.1, 0.9, 0.4);
    stick.rotation.z = 1.1;
    firepitGroup.add(stick);

    this.animatedObjects.push({
      type: 'fire',
      light: this.firepitLight,
      mesh: this.firepitMesh
    });

    this.resortGroup.add(firepitGroup);
  }

  // =========================================================================
  // LAKESIDE BREAKFAST DECK
  // =========================================================================
  buildLakesideDeckAndBreakfast() {
    const deckGroup = new THREE.Group();
    deckGroup.position.set(4, 2.0, -1.5);

    const tableTopGeo = new THREE.CylinderGeometry(1.6, 1.6, 0.1, 24);
    const clothMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 });
    const tableTop = new THREE.Mesh(tableTopGeo, clothMat);
    tableTop.position.set(0, 1.2, 0);
    tableTop.castShadow = true;
    deckGroup.add(tableTop);

    const legGeo = new THREE.CylinderGeometry(0.12, 0.35, 1.2, 12);
    const leg = new THREE.Mesh(legGeo, this.materials.darkWood);
    leg.position.set(0, 0.6, 0);
    deckGroup.add(leg);

    for (let c = 0; c < 2; c++) {
      const chair = new THREE.Group();
      const seatGeo = new THREE.BoxGeometry(0.9, 0.08, 0.9);
      const seat = new THREE.Mesh(seatGeo, this.materials.wood);
      seat.position.y = 0.75;
      chair.add(seat);

      const backGeo = new THREE.BoxGeometry(0.9, 0.9, 0.08);
      const back = new THREE.Mesh(backGeo, this.materials.wood);
      back.position.set(0, 1.2, -0.42);
      chair.add(back);

      const cLegGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.75);
      for (let cl = 0; cl < 4; cl++) {
        const cLeg = new THREE.Mesh(cLegGeo, this.materials.darkWood);
        cLeg.position.set((cl % 2 ? 0.35 : -0.35), 0.375, (cl < 2 ? 0.35 : -0.35));
        chair.add(cLeg);
      }

      chair.position.set(c === 0 ? -1.8 : 1.8, 0, 0);
      chair.rotation.y = c === 0 ? Math.PI / 2 : -Math.PI / 2;
      deckGroup.add(chair);
    }

    // Gourmet items
    const mugMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.3 });
    const mugGeo = new THREE.CylinderGeometry(0.14, 0.12, 0.22, 12);
    
    this.mug1 = new THREE.Mesh(mugGeo, mugMat);
    this.mug1.position.set(-0.7, 1.35, 0.2);
    deckGroup.add(this.mug1);

    this.mug2 = new THREE.Mesh(mugGeo, new THREE.MeshStandardMaterial({ color: 0xec4899, roughness: 0.3 }));
    this.mug2.position.set(0.7, 1.35, -0.2);
    deckGroup.add(this.mug2);

    this.steamParticles = this.createSteamSystem();
    this.steamParticles.position.set(-0.7, 1.48, 0.2);
    deckGroup.add(this.steamParticles);

    const basketGeo = new THREE.CylinderGeometry(0.45, 0.3, 0.15, 12);
    const basket = new THREE.Mesh(basketGeo, this.materials.wood);
    basket.position.set(0, 1.32, -0.4);
    deckGroup.add(basket);

    const pastryMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.7 });
    for (let p = 0; p < 3; p++) {
      const croissantGeo = new THREE.TorusGeometry(0.12, 0.06, 8, 12, Math.PI * 1.4);
      const croissant = new THREE.Mesh(croissantGeo, pastryMat);
      croissant.position.set(-0.15 + p * 0.15, 1.42, -0.4);
      croissant.rotation.x = Math.PI / 2;
      deckGroup.add(croissant);
    }

    const bowlGeo = new THREE.SphereGeometry(0.35, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2);
    const bowl = new THREE.Mesh(bowlGeo, new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 }));
    bowl.position.set(0.2, 1.25, 0.3);
    bowl.rotation.x = Math.PI;
    deckGroup.add(bowl);

    const vaseGeo = new THREE.CylinderGeometry(0.12, 0.16, 0.45, 12);
    const vase = new THREE.Mesh(vaseGeo, this.materials.glass);
    vase.position.set(-0.2, 1.45, -0.1);
    deckGroup.add(vase);

    const flower = new THREE.Mesh(new THREE.SphereGeometry(0.08, 6, 6), new THREE.MeshBasicMaterial({ color: 0xf59e0b }));
    flower.position.set(-0.2, 1.72, -0.1);
    deckGroup.add(flower);

    this.resortGroup.add(deckGroup);
  }

  createSteamSystem() {
    const particleCount = 20;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 0.15;
      positions[i * 3 + 1] = Math.random() * 0.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.15;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.1,
      transparent: true,
      opacity: 0.45,
      depthWrite: false
    });

    const pSystem = new THREE.Points(geo, mat);
    this.animatedObjects.push({
      type: 'steam',
      points: pSystem
    });
    return pSystem;
  }

  // =========================================================================
  // MOUNTAIN TOP SUMMIT VIEWPOINT
  // =========================================================================
  buildMountainSummit() {
    const summit = new THREE.Group();
    summit.position.set(35, 58, -55);

    const platformGeo = new THREE.BoxGeometry(10, 0.6, 9);
    const platform = new THREE.Mesh(platformGeo, this.materials.wood);
    platform.position.y = 0.3;
    platform.castShadow = true;
    platform.receiveShadow = true;
    summit.add(platform);

    const railMat = this.materials.darkWood;
    const postGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.4);
    for (let rx = -4.5; rx <= 4.5; rx += 1.8) {
      const postFront = new THREE.Mesh(postGeo, railMat);
      postFront.position.set(rx, 1.0, 4.3);
      summit.add(postFront);
      
      const postLeft = new THREE.Mesh(postGeo, railMat);
      postLeft.position.set(-4.8, 1.0, rx * 0.8);
      summit.add(postLeft);

      const postRight = new THREE.Mesh(postGeo, railMat);
      postRight.position.set(4.8, 1.0, rx * 0.8);
      summit.add(postRight);
    }

    const topBarFrontGeo = new THREE.BoxGeometry(9.6, 0.12, 0.12);
    const topBarFront = new THREE.Mesh(topBarFrontGeo, railMat);
    topBarFront.position.set(0, 1.6, 4.3);
    summit.add(topBarFront);

    // Telescope
    const telescope = new THREE.Group();
    telescope.position.set(-2.5, 0.6, 3.2);

    const tubeGeo = new THREE.CylinderGeometry(0.12, 0.16, 1.4, 12);
    const tubeMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.2 });
    const tube = new THREE.Mesh(tubeGeo, tubeMat);
    tube.rotation.x = Math.PI / 3.2;
    tube.position.y = 1.3;
    telescope.add(tube);

    const tripodLegGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.5);
    for (let t = 0; t < 3; t++) {
      const leg = new THREE.Mesh(tripodLegGeo, tubeMat);
      const ang = (t / 3) * Math.PI * 2;
      leg.position.set(Math.sin(ang) * 0.35, 0.6, Math.cos(ang) * 0.35);
      leg.rotation.z = Math.sin(ang) * 0.25;
      leg.rotation.x = Math.cos(ang) * 0.25;
      telescope.add(leg);
    }
    summit.add(telescope);

    // Bench
    const benchGroup = new THREE.Group();
    benchGroup.position.set(2.2, 0.6, -1.5);
    benchGroup.rotation.y = -0.3;

    const bSeatGeo = new THREE.BoxGeometry(2.4, 0.1, 0.8);
    const bSeat = new THREE.Mesh(bSeatGeo, this.materials.wood);
    bSeat.position.y = 0.5;
    benchGroup.add(bSeat);

    const bBackGeo = new THREE.BoxGeometry(2.4, 0.7, 0.1);
    const bBack = new THREE.Mesh(bBackGeo, this.materials.wood);
    bBack.position.set(0, 0.9, -0.38);
    benchGroup.add(bBack);
    summit.add(benchGroup);

    // Prayer Flags
    const flagLine = new THREE.Group();
    flagLine.position.set(0, 2.2, 4.3);
    const colors = [0x3b82f6, 0xef4444, 0xfacc15, 0x10b981, 0xffffff];
    for (let f = 0; f < 9; f++) {
      const flagGeo = new THREE.PlaneGeometry(0.4, 0.3);
      const flagMat = new THREE.MeshBasicMaterial({ color: colors[f % colors.length], side: THREE.DoubleSide });
      const flag = new THREE.Mesh(flagGeo, flagMat);
      flag.position.set(-4 + f * 1.0, 0, 0);
      flag.rotation.y = 0.2;
      flagLine.add(flag);
    }
    summit.add(flagLine);
    this.animatedObjects.push({
      type: 'flags',
      group: flagLine
    });

    this.summitGroup.add(summit);
  }

  // =========================================================================
  // SCENIC ALPINE CABLE CAR / GONDOLA SYSTEM
  // =========================================================================
  buildCableCarGondola() {
    // Connects Resort Base (x: 20, y: 3, z: -15) to Cloudcrest Summit (x: 35, y: 58, z: -50)
    const basePos = new THREE.Vector3(20, 3.5, -15);
    const summitPos = new THREE.Vector3(35, 58.5, -50);

    // 1. Two Cable lines
    const lineMat = new THREE.LineBasicMaterial({ color: 0x334155, linewidth: 2 });
    const cableGeo = new THREE.BufferGeometry().setFromPoints([basePos, summitPos]);
    const cableLine = new THREE.Line(cableGeo, lineMat);
    this.gondolaGroup.add(cableLine);

    // 2. Intermediate Support Pylon Tower
    const pylonPos = new THREE.Vector3().lerpVectors(basePos, summitPos, 0.45);
    const pylonGeo = new THREE.CylinderGeometry(0.3, 0.7, pylonPos.y + 4, 8);
    const pylon = new THREE.Mesh(pylonGeo, this.materials.rock);
    pylon.position.set(pylonPos.x, (pylonPos.y + 4) / 2, pylonPos.z);
    this.gondolaGroup.add(pylon);

    // Crossbar on pylon
    const crossbar = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.25, 0.25), this.materials.darkWood);
    crossbar.position.set(pylonPos.x, pylonPos.y + 4, pylonPos.z);
    this.gondolaGroup.add(crossbar);

    // 3. Gondola Cabin
    this.gondolaCabin = new THREE.Group();

    // Red Alpine Cabin Body
    const cabinBodyGeo = new THREE.BoxGeometry(2.2, 1.8, 1.6);
    const cabinBody = new THREE.Mesh(cabinBodyGeo, this.materials.metalRed);
    this.gondolaCabin.add(cabinBody);

    // Panoramic Cabin Windows
    const cabinGlassGeo = new THREE.BoxGeometry(2.25, 0.8, 1.65);
    const cabinGlass = new THREE.Mesh(cabinGlassGeo, this.materials.glass);
    cabinGlass.position.y = 0.2;
    this.gondolaCabin.add(cabinGlass);

    // Suspension Hanger Arm & Roller Wheels
    const hangerGeo = new THREE.CylinderGeometry(0.06, 0.06, 1.4);
    const hanger = new THREE.Mesh(hangerGeo, this.materials.darkWood);
    hanger.position.set(0, 1.5, 0);
    this.gondolaCabin.add(hanger);

    const wheelGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.15, 12);
    const wheel = new THREE.Mesh(wheelGeo, this.materials.darkWood);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(0, 2.2, 0);
    this.gondolaCabin.add(wheel);

    this.gondolaGroup.add(this.gondolaCabin);

    // Register real-time cable car animation
    this.animatedObjects.push({
      type: 'gondola',
      cabin: this.gondolaCabin,
      start: basePos,
      end: summitPos,
      speed: 0.035, // Smooth slow alpine ascent
      progress: 0.15
    });
  }

  // =========================================================================
  // LIVING WILDLIFE: SOARING EAGLE & LAKE SWANS
  // =========================================================================
  buildWildlifeFauna() {
    // 1. Soaring Golden Eagle
    this.eagle = new THREE.Group();
    const eagleBody = new THREE.Mesh(new THREE.ConeGeometry(0.3, 1.2, 6), this.materials.darkWood);
    eagleBody.rotation.x = Math.PI / 2;
    this.eagle.add(eagleBody);

    // Eagle Wings
    const wingGeo = new THREE.BoxGeometry(2.4, 0.06, 0.6);
    this.eagleWingL = new THREE.Mesh(wingGeo, this.materials.darkWood);
    this.eagleWingL.position.set(1.2, 0, 0);
    this.eagle.add(this.eagleWingL);

    this.eagleWingR = new THREE.Mesh(wingGeo, this.materials.darkWood);
    this.eagleWingR.position.set(-1.2, 0, 0);
    this.eagle.add(this.eagleWingR);

    this.eagle.position.set(20, 68, -40);
    this.faunaGroup.add(this.eagle);

    this.animatedObjects.push({
      type: 'eagle',
      eagle: this.eagle,
      wingL: this.eagleWingL,
      wingR: this.eagleWingR
    });

    // 2. Lake Swans
    this.swans = [];
    const swanMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
    const beakMat = new THREE.MeshBasicMaterial({ color: 0xf97316 });

    for (let s = 0; s < 2; s++) {
      const swan = new THREE.Group();
      // Body
      const body = new THREE.Mesh(new THREE.SphereGeometry(0.4, 8, 8), swanMat);
      body.scale.set(1, 0.6, 1.4);
      swan.add(body);

      // Neck & Head
      const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.7, 8), swanMat);
      neck.position.set(0, 0.45, 0.35);
      neck.rotation.x = -0.3;
      swan.add(neck);

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.12, 6, 6), swanMat);
      head.position.set(0, 0.8, 0.45);
      swan.add(head);

      const beak = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.2, 6), beakMat);
      beak.rotation.x = Math.PI / 2;
      beak.position.set(0, 0.78, 0.6);
      swan.add(beak);

      swan.position.set(-20 + s * 6, 0.28, 14 + s * 5);
      this.faunaGroup.add(swan);
      this.swans.push(swan);
    }

    this.animatedObjects.push({
      type: 'swans',
      swans: this.swans
    });
  }

  // =========================================================================
  // LUXURY BEDROOM INTERIOR
  // =========================================================================
  buildBedroomInterior() {
    const room = new THREE.Group();
    room.position.set(13.5, 4.8, -4.5);

    const floorGeo = new THREE.BoxGeometry(8, 0.2, 8);
    const floor = new THREE.Mesh(floorGeo, this.materials.darkWood);
    floor.position.y = -0.1;
    room.add(floor);

    const rugGeo = new THREE.BoxGeometry(5.5, 0.05, 5.5);
    const rugMat = new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.95 });
    const rug = new THREE.Mesh(rugGeo, rugMat);
    rug.position.set(0, 0.02, 0.5);
    room.add(rug);

    const bedGroup = new THREE.Group();
    bedGroup.position.set(0, 0, -1.8);

    const headboardGeo = new THREE.BoxGeometry(4.2, 2.4, 0.3);
    const headboard = new THREE.Mesh(headboardGeo, this.materials.darkWood);
    headboard.position.set(0, 1.2, -1.8);
    bedGroup.add(headboard);

    const mattressGeo = new THREE.BoxGeometry(3.6, 0.6, 3.8);
    const mattressMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.85 });
    const mattress = new THREE.Mesh(mattressGeo, mattressMat);
    mattress.position.set(0, 0.5, 0);
    bedGroup.add(mattress);

    const duvetGeo = new THREE.BoxGeometry(3.65, 0.25, 2.8);
    const duvetMat = new THREE.MeshStandardMaterial({ color: 0xdbeafe, roughness: 0.7 });
    const duvet = new THREE.Mesh(duvetGeo, duvetMat);
    duvet.position.set(0, 0.7, 0.5);
    bedGroup.add(duvet);

    for (let p = 0; p < 2; p++) {
      const pillowGeo = new THREE.BoxGeometry(1.2, 0.25, 0.7);
      const pillow = new THREE.Mesh(pillowGeo, mattressMat);
      pillow.position.set(p === 0 ? -1.0 : 1.0, 0.75, -1.1);
      pillow.rotation.x = 0.2;
      bedGroup.add(pillow);
    }

    for (let s = 0; s < 2; s++) {
      const standGeo = new THREE.BoxGeometry(0.9, 0.7, 0.8);
      const stand = new THREE.Mesh(standGeo, this.materials.wood);
      stand.position.set(s === 0 ? -2.4 : 2.4, 0.35, -1.4);
      bedGroup.add(stand);

      const lampShadeGeo = new THREE.ConeGeometry(0.25, 0.35, 12, 1, true);
      const lampShade = new THREE.Mesh(lampShadeGeo, this.materials.warmLight);
      lampShade.position.set(s === 0 ? -2.4 : 2.4, 1.0, -1.4);
      bedGroup.add(lampShade);

      const nightLamp = new THREE.PointLight(0xfef08a, 0.8, 6);
      nightLamp.position.set(s === 0 ? -2.4 : 2.4, 0.95, -1.4);
      bedGroup.add(nightLamp);
      this.resortLights.push(nightLamp);
    }
    room.add(bedGroup);

    const fireGroup = new THREE.Group();
    fireGroup.position.set(3.5, 0, 1.2);
    fireGroup.rotation.y = -Math.PI / 2;

    const hearthGeo = new THREE.BoxGeometry(2.4, 2.2, 1.2);
    const hearth = new THREE.Mesh(hearthGeo, this.materials.rock);
    hearth.position.y = 1.1;
    fireGroup.add(hearth);

    const nicheGeo = new THREE.BoxGeometry(1.4, 1.2, 0.6);
    const nicheMat = new THREE.MeshBasicMaterial({ color: 0x1c1917 });
    const niche = new THREE.Mesh(nicheGeo, nicheMat);
    niche.position.set(0, 0.8, 0.35);
    fireGroup.add(niche);

    const fireGeo = new THREE.ConeGeometry(0.35, 0.55, 6);
    this.fireMesh = new THREE.Mesh(fireGeo, this.materials.fire);
    this.fireMesh.position.set(0, 0.5, 0.4);
    fireGroup.add(this.fireMesh);

    this.fireplaceLight = new THREE.PointLight(0xf97316, 2.2, 12);
    this.fireplaceLight.position.set(0, 0.8, 0.6);
    fireGroup.add(this.fireplaceLight);

    room.add(fireGroup);
    this.resortGroup.add(room);

    this.animatedObjects.push({
      type: 'fire',
      light: this.fireplaceLight,
      mesh: this.fireMesh
    });
  }

  // =========================================================================
  // THE 3D COUPLE AVATARS (Breakfast, Summit, Starry Pool, Bed, Swimming)
  // =========================================================================
  buildCoupleAvatars() {
    this.coupleModels = {
      ch1: this.createCouplePose1_Breakfast(),
      ch2: this.createCouplePose2_Summit(),
      ch3: this.createCouplePose3_PoolsideNight(),
      ch4: this.createCouplePose4_InBed(),
      swim: this.createCouplePose5_Swimming()
    };

    Object.keys(this.coupleModels).forEach(key => {
      this.coupleGroup.add(this.coupleModels[key]);
      this.coupleModels[key].visible = (key === 'ch1');
    });
  }

  createCharacter(gender = 'male', clothingColor = 0x2563eb, hairColor = 0x3e2723) {
    const char = new THREE.Group();

    const skinMat = new THREE.MeshStandardMaterial({
      color: gender === 'male' ? 0xf5d0b5 : 0xffdfc4,
      roughness: 0.6
    });

    const clothMat = new THREE.MeshStandardMaterial({
      color: clothingColor,
      roughness: 0.7
    });

    const hairMat = new THREE.MeshStandardMaterial({
      color: hairColor,
      roughness: 0.9
    });

    const pantsMat = new THREE.MeshStandardMaterial({
      color: gender === 'male' ? 0x1e293b : 0x475569,
      roughness: 0.8
    });

    const headGeo = new THREE.SphereGeometry(0.24, 16, 16);
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.y = 1.62;
    head.castShadow = true;
    char.add(head);

    if (gender === 'male') {
      const hairGeo = new THREE.SphereGeometry(0.25, 12, 12, 0, Math.PI * 2, 0, Math.PI * 0.55);
      const hair = new THREE.Mesh(hairGeo, hairMat);
      hair.position.set(0, 1.68, -0.02);
      char.add(hair);
    } else {
      const hairGeo = new THREE.SphereGeometry(0.26, 12, 12);
      const hair = new THREE.Mesh(hairGeo, hairMat);
      hair.position.set(0, 1.66, -0.06);
      char.add(hair);

      const bunGeo = new THREE.SphereGeometry(0.14, 8, 8);
      const bun = new THREE.Mesh(bunGeo, hairMat);
      bun.position.set(0, 1.6, -0.26);
      char.add(bun);
    }

    const torsoGeo = new THREE.CylinderGeometry(0.26, 0.22, 0.7, 12);
    const torso = new THREE.Mesh(torsoGeo, clothMat);
    torso.position.y = 1.1;
    torso.castShadow = true;
    char.add(torso);

    char.limbs = { head, torso, skinMat, clothMat, pantsMat };
    return char;
  }

  createCouplePose1_Breakfast() {
    const group = new THREE.Group();
    group.position.set(4, 2.0, -1.5);

    const ethan = this.createCharacter('male', 0x2563eb, 0x271c19);
    ethan.position.set(-1.8, 0, 0);
    ethan.rotation.y = Math.PI / 2;

    const legGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.6);
    const legL = new THREE.Mesh(legGeo, ethan.limbs.pantsMat);
    legL.position.set(0.12, 0.65, 0.3);
    legL.rotation.x = Math.PI / 2;
    ethan.add(legL);

    const legR = legL.clone();
    legR.position.x = -0.12;
    ethan.add(legR);

    const armGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.5);
    const arm = new THREE.Mesh(armGeo, ethan.limbs.clothMat);
    arm.position.set(0.28, 1.05, 0.35);
    arm.rotation.x = 0.9;
    ethan.add(arm);
    group.add(ethan);

    const maya = this.createCharacter('female', 0xf43f5e, 0x451a03);
    maya.position.set(1.8, 0, 0);
    maya.rotation.y = -Math.PI / 2;

    const mLegL = new THREE.Mesh(legGeo, maya.limbs.skinMat);
    mLegL.position.set(0.12, 0.65, 0.3);
    mLegL.rotation.x = Math.PI / 2;
    maya.add(mLegL);

    const mLegR = mLegL.clone();
    mLegR.position.x = -0.12;
    maya.add(mLegR);

    const mArm = new THREE.Mesh(armGeo, maya.limbs.clothMat);
    mArm.position.set(-0.28, 1.05, 0.35);
    mArm.rotation.x = 0.85;
    maya.add(mArm);
    group.add(maya);

    return group;
  }

  createCouplePose2_Summit() {
    const group = new THREE.Group();
    group.position.set(35, 58.6, -51.5);

    const ethan = this.createCharacter('male', 0x0284c7, 0x271c19);
    ethan.position.set(-0.45, 0, 0);
    ethan.rotation.y = 0.25;

    const legGeo = new THREE.CylinderGeometry(0.09, 0.07, 0.85);
    const legL = new THREE.Mesh(legGeo, ethan.limbs.pantsMat);
    legL.position.set(0.14, 0.45, 0);
    ethan.add(legL);
    const legR = legL.clone();
    legR.position.x = -0.14;
    ethan.add(legR);

    const armGeo = new THREE.CylinderGeometry(0.07, 0.06, 0.6);
    const armL = new THREE.Mesh(armGeo, ethan.limbs.clothMat);
    armL.position.set(-0.32, 1.15, 0.25);
    armL.rotation.x = 0.6;
    ethan.add(armL);
    group.add(ethan);

    const maya = this.createCharacter('female', 0xeab308, 0x451a03);
    maya.position.set(0.45, 0, 0);
    maya.rotation.y = -0.25;

    const mLegL = new THREE.Mesh(legGeo, maya.limbs.pantsMat);
    mLegL.position.set(0.13, 0.45, 0);
    maya.add(mLegL);
    const mLegR = mLegL.clone();
    mLegR.position.x = -0.13;
    maya.add(mLegR);

    const armPoint = new THREE.Mesh(armGeo, maya.limbs.clothMat);
    armPoint.position.set(0.35, 1.3, 0.35);
    armPoint.rotation.x = 1.3;
    armPoint.rotation.z = 0.3;
    maya.add(armPoint);
    group.add(maya);

    return group;
  }

  createCouplePose3_PoolsideNight() {
    const group = new THREE.Group();
    group.position.set(1.5, 2.05, 6.5);
    group.rotation.y = Math.PI / 2;

    const ethan = this.createCharacter('male', 0x334155, 0x271c19);
    ethan.position.set(-0.45, 0, 0);
    ethan.rotation.y = 0.1;

    const legGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.65);
    const legL = new THREE.Mesh(legGeo, ethan.limbs.skinMat);
    legL.position.set(0.12, 0.1, 0.35);
    legL.rotation.x = 1.2;
    ethan.add(legL);
    const legR = legL.clone();
    legR.position.x = -0.12;
    ethan.add(legR);
    group.add(ethan);

    const maya = this.createCharacter('female', 0x64748b, 0x451a03);
    maya.position.set(0.45, 0, 0);
    maya.rotation.y = -0.1;

    const mLegL = new THREE.Mesh(legGeo, maya.limbs.skinMat);
    mLegL.position.set(0.12, 0.1, 0.35);
    mLegL.rotation.x = 1.2;
    maya.add(mLegL);
    const mLegR = mLegL.clone();
    mLegR.position.x = -0.12;
    maya.add(mLegR);

    const blanketGeo = new THREE.BoxGeometry(1.6, 0.45, 0.6);
    const blanketMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.9 });
    const blanket = new THREE.Mesh(blanketGeo, blanketMat);
    blanket.position.set(0, 0.9, 0.05);
    group.add(blanket);

    return group;
  }

  createCouplePose4_InBed() {
    const group = new THREE.Group();
    group.position.set(13.5, 5.5, -6.3);

    const skinMat = new THREE.MeshStandardMaterial({ color: 0xf5d0b5, roughness: 0.6 });
    const hairMatM = new THREE.MeshStandardMaterial({ color: 0x271c19, roughness: 0.9 });
    const hairMatF = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9 });

    const headM = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 12), skinMat);
    headM.position.set(-0.9, 0.35, 0.2);
    headM.rotation.x = 0.2;
    headM.rotation.y = 0.3;
    group.add(headM);

    const hairM = new THREE.Mesh(new THREE.SphereGeometry(0.24, 12, 12, 0, Math.PI * 2, 0, Math.PI * 0.6), hairMatM);
    hairM.position.set(-0.9, 0.38, 0.18);
    group.add(hairM);

    const headF = new THREE.Mesh(new THREE.SphereGeometry(0.21, 12, 12), skinMat);
    headF.position.set(0.7, 0.35, 0.2);
    headF.rotation.x = 0.2;
    headF.rotation.y = -0.3;
    group.add(headF);

    const hairF = new THREE.Mesh(new THREE.SphereGeometry(0.23, 12, 12), hairMatF);
    hairF.position.set(0.7, 0.38, 0.16);
    group.add(hairF);

    return group;
  }

  // --- Extra Couple Pose: Swimming in Infinity Pool ---
  createCouplePose5_Swimming() {
    const group = new THREE.Group();
    // Submerged inside the turquoise infinity pool water
    group.position.set(1.5, 1.35, 6.5);

    const skinMat = new THREE.MeshStandardMaterial({ color: 0xf5d0b5, roughness: 0.5 });
    const hairMatM = new THREE.MeshStandardMaterial({ color: 0x271c19, roughness: 0.9 });
    const hairMatF = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9 });

    // Ethan head & shoulders resting near pool edge
    const ethanGroup = new THREE.Group();
    ethanGroup.position.set(-0.6, 0, 0);

    const headM = new THREE.Mesh(new THREE.SphereGeometry(0.24, 12, 12), skinMat);
    headM.position.y = 0.35;
    ethanGroup.add(headM);

    const hairM = new THREE.Mesh(new THREE.SphereGeometry(0.25, 12, 12, 0, Math.PI * 2, 0, Math.PI * 0.6), hairMatM);
    hairM.position.set(0, 0.4, -0.02);
    ethanGroup.add(hairM);

    const shouldersM = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.25, 12), skinMat);
    shouldersM.position.y = 0.05;
    ethanGroup.add(shouldersM);
    group.add(ethanGroup);

    // Maya head & shoulders
    const mayaGroup = new THREE.Group();
    mayaGroup.position.set(0.6, 0, 0);

    const headF = new THREE.Mesh(new THREE.SphereGeometry(0.23, 12, 12), skinMat);
    headF.position.y = 0.35;
    mayaGroup.add(headF);

    const hairF = new THREE.Mesh(new THREE.SphereGeometry(0.25, 12, 12), hairMatF);
    hairF.position.set(0, 0.38, -0.05);
    mayaGroup.add(hairF);

    const shouldersF = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.25, 12), skinMat);
    shouldersF.position.y = 0.05;
    mayaGroup.add(shouldersF);
    group.add(mayaGroup);

    return group;
  }

  // =========================================================================
  // SKY, COSMOS, STARS & METEORS
  // =========================================================================
  buildSkyAndCosmos() {
    const skyGeo = new THREE.SphereGeometry(280, 32, 24);
    this.skyMat = new THREE.MeshBasicMaterial({ color: 0x87ceeb, side: THREE.BackSide });
    this.skyDome = new THREE.Mesh(skyGeo, this.skyMat);
    this.skyGroup.add(this.skyDome);

    const sunGeo = new THREE.SphereGeometry(6, 16, 16);
    this.sunMesh = new THREE.Mesh(sunGeo, new THREE.MeshBasicMaterial({ color: 0xffedd5 }));
    this.sunMesh.position.set(90, 110, 60);
    this.skyGroup.add(this.sunMesh);

    const moonGeo = new THREE.SphereGeometry(5, 16, 16);
    this.moonMesh = new THREE.Mesh(moonGeo, new THREE.MeshBasicMaterial({ color: 0xe0f2fe }));
    this.moonMesh.position.set(-90, 100, -70);
    this.skyGroup.add(this.moonMesh);

    // Starfield (3,500 twinkling points)
    const starCount = 3500;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0) * 0.5;
      const r = 260;

      starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = r * Math.cos(phi) + 10;
      starPos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      starSizes[i] = 0.8 + Math.random() * 1.8;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));

    this.starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.6,
      transparent: true,
      opacity: 0.0,
      sizeAttenuation: true
    });

    this.starField = new THREE.Points(starGeo, this.starMaterial);
    this.skyGroup.add(this.starField);

    // Shooting Stars
    this.shootingStars = [];
    for (let s = 0; s < 4; s++) {
      const lineGeo = new THREE.BufferGeometry();
      const linePos = new Float32Array(6);
      lineGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3));
      const meteor = new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: 0xfffbeb, transparent: true, opacity: 0 }));
      this.skyGroup.add(meteor);
      this.shootingStars.push({
        mesh: meteor,
        active: false,
        progress: 0,
        start: new THREE.Vector3(),
        end: new THREE.Vector3()
      });
    }

    // Clouds
    this.clouds = new THREE.Group();
    const cloudMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9, transparent: true, opacity: 0.75 });
    for (let c = 0; c < 12; c++) {
      const singleCloud = new THREE.Group();
      for (let p = 0; p < 5; p++) {
        const puff = new THREE.Mesh(new THREE.SphereGeometry(4 + Math.random() * 3, 8, 8), cloudMat);
        puff.position.set((p - 2) * 4.5, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 3);
        singleCloud.add(puff);
      }
      singleCloud.position.set((Math.random() - 0.5) * 200, 45 + Math.random() * 25, (Math.random() - 0.5) * 200);
      this.clouds.add(singleCloud);
    }
    this.skyGroup.add(this.clouds);
  }

  // =========================================================================
  // NIGHT STARGAZER CONSTELLATIONS
  // =========================================================================
  buildConstellations() {
    // Glowing cyan/gold celestial constellation lines
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.0
    });
    this.constellationMat = lineMat;

    // 1. The Big Dipper (Ursa Major)
    const dipperPts = [
      new THREE.Vector3(-40, 160, -90),
      new THREE.Vector3(-25, 168, -95),
      new THREE.Vector3(-10, 172, -92),
      new THREE.Vector3(5, 170, -85),
      new THREE.Vector3(18, 162, -80),
      new THREE.Vector3(12, 148, -75),
      new THREE.Vector3(0, 150, -78),
      new THREE.Vector3(5, 170, -85)
    ];
    const dipperGeo = new THREE.BufferGeometry().setFromPoints(dipperPts);
    this.constellationGroup.add(new THREE.Line(dipperGeo, lineMat));

    // 2. The Romantic Couple Heart Constellation
    const heartPts = [
      new THREE.Vector3(20, 155, 30),
      new THREE.Vector3(30, 170, 25),
      new THREE.Vector3(45, 165, 20),
      new THREE.Vector3(50, 145, 20),
      new THREE.Vector3(30, 125, 25),
      new THREE.Vector3(10, 145, 30),
      new THREE.Vector3(15, 165, 30),
      new THREE.Vector3(30, 170, 25)
    ];
    const heartGeo = new THREE.BufferGeometry().setFromPoints(heartPts);
    const heartLine = new THREE.Line(heartGeo, new THREE.LineBasicMaterial({ color: 0xf43f5e, transparent: true, opacity: 0.0 }));
    this.romanticHeartMat = heartLine.material;
    this.constellationGroup.add(heartLine);

    this.skyGroup.add(this.constellationGroup);
  }

  toggleConstellations(show) {
    if (this.constellationMat) {
      this.constellationMat.opacity = show ? 0.75 : 0.0;
    }
    if (this.romanticHeartMat) {
      this.romanticHeartMat.opacity = show ? 0.85 : 0.0;
    }
  }

  // =========================================================================
  // DYNAMIC WEATHER ENGINES: RAIN, SNOW, MIST, RAINBOW
  // =========================================================================
  buildWeatherEngines() {
    // 1. Mountain Rain Engine (1,200 falling rain streaks)
    const rainCount = 1400;
    const rainGeo = new THREE.BufferGeometry();
    const rainPos = new Float32Array(rainCount * 6); // 2 vertices per line streak

    for (let i = 0; i < rainCount; i++) {
      const rx = (Math.random() - 0.5) * 160;
      const ry = Math.random() * 90;
      const rz = (Math.random() - 0.5) * 160;

      rainPos[i * 6] = rx;
      rainPos[i * 6 + 1] = ry;
      rainPos[i * 6 + 2] = rz;

      rainPos[i * 6 + 3] = rx - 0.2;
      rainPos[i * 6 + 4] = ry - 1.8;
      rainPos[i * 6 + 5] = rz - 0.2;
    }
    rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPos, 3));

    this.rainMat = new THREE.LineBasicMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.0
    });
    this.rainSystem = new THREE.LineSegments(rainGeo, this.rainMat);
    this.weatherGroup.add(this.rainSystem);

    // 2. Winter Snow Flurries Engine (1,500 drifting snowflakes)
    const snowCount = 1600;
    const snowGeo = new THREE.BufferGeometry();
    const snowPos = new Float32Array(snowCount * 3);

    for (let i = 0; i < snowCount; i++) {
      snowPos[i * 3] = (Math.random() - 0.5) * 180;
      snowPos[i * 3 + 1] = Math.random() * 90;
      snowPos[i * 3 + 2] = (Math.random() - 0.5) * 180;
    }
    snowGeo.setAttribute('position', new THREE.BufferAttribute(snowPos, 3));

    this.snowMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.45,
      transparent: true,
      opacity: 0.0
    });
    this.snowSystem = new THREE.Points(snowGeo, this.snowMat);
    this.weatherGroup.add(this.snowSystem);

    // 3. Post-Rain Valley Rainbow
    const rainbowGeo = new THREE.TorusGeometry(75, 1.8, 12, 32, Math.PI);
    const rainbowMat = new THREE.MeshBasicMaterial({
      color: 0xfde047,
      transparent: true,
      opacity: 0.0,
      side: THREE.DoubleSide
    });
    this.rainbowMesh = new THREE.Mesh(rainbowGeo, rainbowMat);
    this.rainbowMesh.position.set(-20, 10, -35);
    this.rainbowMesh.rotation.y = 0.4;
    this.weatherGroup.add(this.rainbowMesh);

    // Register weather particle animator
    this.animatedObjects.push({
      type: 'weather',
      rain: this.rainSystem,
      snow: this.snowSystem,
      builder: this
    });
  }

  setWeather(type) {
    this.currentWeather = type;

    if (type === 'rain') {
      this.rainMat.opacity = 0.75;
      this.snowMat.opacity = 0.0;
      this.rainbowMesh.material.opacity = 0.0;
      if (this.skyMat) this.skyMat.color.setHex(0x475569); // Overcast sky
    } else if (type === 'snow') {
      this.rainMat.opacity = 0.0;
      this.snowMat.opacity = 0.85;
      this.rainbowMesh.material.opacity = 0.0;
      if (this.skyMat) this.skyMat.color.setHex(0x94a3b8);
    } else if (type === 'mist') {
      this.rainMat.opacity = 0.0;
      this.snowMat.opacity = 0.0;
      this.rainbowMesh.material.opacity = 0.0;
      this.scene.fog.density = 0.009; // Thicker lake mist
    } else {
      // Sunny
      this.rainMat.opacity = 0.0;
      this.snowMat.opacity = 0.0;
      this.rainbowMesh.material.opacity = 0.45; // Subtle rainbow
      this.scene.fog.density = 0.0035;
    }
  }

  // =========================================================================
  // PARTICLES (Fireflies & Mist)
  // =========================================================================
  buildParticles() {
    const fireflyCount = 45;
    const ffGeo = new THREE.BufferGeometry();
    const ffPos = new Float32Array(fireflyCount * 3);
    for (let i = 0; i < fireflyCount; i++) {
      ffPos[i * 3] = 6 + (Math.random() - 0.5) * 24;
      ffPos[i * 3 + 1] = 1.5 + Math.random() * 3.5;
      ffPos[i * 3 + 2] = 2 + (Math.random() - 0.5) * 18;
    }
    ffGeo.setAttribute('position', new THREE.BufferAttribute(ffPos, 3));

    this.fireflyMaterial = new THREE.PointsMaterial({
      color: 0xa3e635,
      size: 0.35,
      transparent: true,
      opacity: 0.0
    });

    this.fireflies = new THREE.Points(ffGeo, this.fireflyMaterial);
    this.scene.add(this.fireflies);

    this.animatedObjects.push({
      type: 'fireflies',
      points: this.fireflies,
      count: fireflyCount
    });
  }

  triggerShootingStar() {
    const inactive = this.shootingStars.find(s => !s.active);
    if (!inactive) return;

    const startX = (Math.random() - 0.5) * 120;
    const startY = 120 + Math.random() * 40;
    const startZ = -60 - Math.random() * 60;

    inactive.start.set(startX, startY, startZ);
    inactive.end.set(startX + 40, startY - 25, startZ + 35);
    inactive.progress = 0;
    inactive.active = true;
    inactive.mesh.material.opacity = 1.0;
  }
}

window.WorldBuilder = WorldBuilder;
