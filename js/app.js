/**
 * ALPINESCAPE - Enhanced Main Application Controller
 * Handles Three.js rendering loop, live wildlife (eagle & swans),
 * cable car gondola motion & ride camera, weather particle systems,
 * scrapbook album, and UI interactions.
 */

class AlpineApp {
  constructor() {
    this.container = document.getElementById('canvas-container');
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    
    this.world = null;
    this.timeline = null;
    this.audio = window.ProceduralAudio;
    
    this.clock = new THREE.Clock();
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.isPhotoModalOpen = false;
  }

  init() {
    this.initThree();
    this.buildScene();
    this.bindUI();
    this.setupResize();
    this.hideLoader();
    this.animate();
  }

  initThree() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x050b14);
    this.scene.fog = new THREE.FogExp2(0x87ceeb, 0.0035);

    this.camera = new THREE.PerspectiveCamera(
      48,
      window.innerWidth / window.innerHeight,
      0.5,
      600
    );
    this.camera.position.set(9.5, 3.8, 2.2);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
      preserveDrawingBuffer: true
    });
    const isMobile = window.innerWidth <= 768;
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    this.container.appendChild(this.renderer.domElement);

    // 4. OrbitControls with optimized touch bindings
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.02;
    this.controls.minDistance = 2.0;
    this.controls.maxDistance = 220;
    this.controls.target.set(3.8, 2.8, -1.2);

    // Mobile touch gestures: 1 finger rotate, 2 fingers pinch zoom & pan
    this.controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_PAN
    };
  }

  buildScene() {
    this.world = new window.WorldBuilder(this.scene);
    this.worldData = this.world.buildAll();

    this.timeline = new window.StoryTimeline(this.world, this.camera, this.controls);
    this.timeline.goToChapter(1, false);
  }

  // =========================================================================
  // ANIMATION & RENDER LOOP
  // =========================================================================
  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // 1. Update Controls (unless riding gondola)
    if (this.timeline.isRidingGondola && this.world.gondolaCabin) {
      const cabPos = this.world.gondolaCabin.position;
      this.camera.position.set(cabPos.x + 0.8, cabPos.y + 1.2, cabPos.z + 1.2);
      this.controls.target.set(cabPos.x - 10, cabPos.y - 4, cabPos.z + 10);
      this.controls.update();
    } else {
      this.controls.update();
    }

    // 2. Animate Dynamic Elements
    if (this.worldData && this.worldData.animated) {
      this.worldData.animated.forEach(item => {
        if (item.type === 'water') {
          const pos = item.mesh.geometry.attributes.position;
          for (let i = 0; i < pos.count; i++) {
            const u = pos.getX(i);
            const v = pos.getY(i);
            const wave = Math.sin(u * 0.4 + elapsedTime * 1.5) * 0.05 + 
                         Math.cos(v * 0.5 + elapsedTime * 1.8) * 0.05;
            pos.setZ(i, wave);
          }
          pos.needsUpdate = true;
        } else if (item.type === 'bobbing') {
          item.object.position.y = (item.initialY || item.object.position.y);
          item.object.position.y += Math.sin(elapsedTime * item.speed) * item.intensity;
          item.object.rotation.z = Math.sin(elapsedTime * (item.speed * 0.8)) * 0.03;
        } else if (item.type === 'steam') {
          const pos = item.points.geometry.attributes.position;
          for (let i = 0; i < pos.count; i++) {
            let y = pos.getY(i) + delta * 0.3;
            if (y > 0.6) y = 0.0;
            pos.setY(i, y);
          }
          pos.needsUpdate = true;
        } else if (item.type === 'flags') {
          item.group.children.forEach((flag, idx) => {
            flag.rotation.y = Math.sin(elapsedTime * 4.0 + idx * 0.6) * 0.35;
          });
        } else if (item.type === 'fire') {
          item.light.intensity = 1.8 + Math.sin(elapsedTime * 12.0) * 0.4 + Math.random() * 0.2;
          item.mesh.scale.y = 0.9 + Math.sin(elapsedTime * 10.0) * 0.2;
        } else if (item.type === 'fireflies') {
          const pos = item.points.geometry.attributes.position;
          for (let i = 0; i < item.count; i++) {
            let px = pos.getX(i) + Math.sin(elapsedTime * 0.8 + i) * 0.015;
            let py = pos.getY(i) + Math.cos(elapsedTime * 1.1 + i) * 0.01;
            let pz = pos.getZ(i) + Math.sin(elapsedTime * 0.6 + i) * 0.015;
            pos.setXYZ(i, px, py, pz);
          }
          pos.needsUpdate = true;
        } else if (item.type === 'gondola') {
          // Smooth alpine cable car ascent & descent
          item.progress += delta * item.speed;
          if (item.progress > 1.0) item.progress = 0.0;
          // Ping-pong travel path
          const pingPong = Math.sin(item.progress * Math.PI);
          item.cabin.position.lerpVectors(item.start, item.end, pingPong);
        } else if (item.type === 'eagle') {
          // Soaring eagle flight circle & wing flapping
          const radius = 35;
          const eagleAng = elapsedTime * 0.45;
          item.eagle.position.x = 25 + Math.cos(eagleAng) * radius;
          item.eagle.position.z = -45 + Math.sin(eagleAng) * radius;
          item.eagle.rotation.y = -eagleAng - Math.PI / 2;
          // Wing flap
          const flap = Math.sin(elapsedTime * 6.0) * 0.25;
          item.wingL.rotation.z = flap;
          item.wingR.rotation.z = -flap;
        } else if (item.type === 'swans') {
          // Gentle swimming swans
          item.swans.forEach((swan, idx) => {
            const swanAng = elapsedTime * 0.2 + idx * Math.PI;
            swan.position.x = -22 + Math.cos(swanAng) * 9;
            swan.position.z = 12 + Math.sin(swanAng) * 7;
            swan.rotation.y = -swanAng + Math.PI / 2;
          });
        } else if (item.type === 'weather') {
          // Rain animation
          if (item.builder.currentWeather === 'rain') {
            const rPos = item.rain.geometry.attributes.position;
            for (let i = 0; i < rPos.count; i += 2) {
              let y = rPos.getY(i) - delta * 45;
              if (y < 0) y = 90;
              rPos.setY(i, y);
              rPos.setY(i + 1, y - 1.8);
            }
            rPos.needsUpdate = true;
          }
          // Snow animation
          if (item.builder.currentWeather === 'snow') {
            const sPos = item.snow.geometry.attributes.position;
            for (let i = 0; i < sPos.count; i++) {
              let y = sPos.getY(i) - delta * 6;
              let x = sPos.getX(i) + Math.sin(elapsedTime * 2.0 + i) * 0.04;
              if (y < 0) y = 90;
              sPos.setY(i, y);
              sPos.setX(i, x);
            }
            sPos.needsUpdate = true;
          }
        }
      });
    }

    // 3. Shooting Stars
    if (this.world && this.world.shootingStars) {
      this.world.shootingStars.forEach(s => {
        if (s.active) {
          s.progress += delta * 2.2;
          if (s.progress >= 1.0) {
            s.active = false;
            s.mesh.material.opacity = 0;
          } else {
            const curX = THREE.MathUtils.lerp(s.start.x, s.end.x, s.progress);
            const curY = THREE.MathUtils.lerp(s.start.y, s.end.y, s.progress);
            const curZ = THREE.MathUtils.lerp(s.start.z, s.end.z, s.progress);

            const trailLen = 0.15;
            const prevProg = Math.max(0, s.progress - trailLen);
            const tailX = THREE.MathUtils.lerp(s.start.x, s.end.x, prevProg);
            const tailY = THREE.MathUtils.lerp(s.start.y, s.end.y, prevProg);
            const tailZ = THREE.MathUtils.lerp(s.start.z, s.end.z, prevProg);

            const pos = s.mesh.geometry.attributes.position;
            pos.setXYZ(0, curX, curY, curZ);
            pos.setXYZ(1, tailX, tailY, tailZ);
            pos.needsUpdate = true;
            s.mesh.material.opacity = Math.sin(s.progress * Math.PI);
          }
        }
      });

      if (this.timeline.currentTime > 19 || this.timeline.currentTime < 5.5) {
        if (Math.random() < 0.008) {
          this.world.triggerShootingStar();
        }
      }
    }

    // 4. Clouds
    if (this.world && this.world.clouds) {
      this.world.clouds.children.forEach(cloud => {
        cloud.position.x += delta * 1.2;
        if (cloud.position.x > 120) cloud.position.x = -120;
      });
    }

    // 5. Project 3D Hotspots
    this.updateHotspotScreenPositions();

    // 6. Render
    this.renderer.render(this.scene, this.camera);
  }

  updateHotspotScreenPositions() {
    const markers = document.querySelectorAll('.hotspot-marker');
    const tempV = new THREE.Vector3();

    markers.forEach(el => {
      const x = parseFloat(el.dataset.x);
      const y = parseFloat(el.dataset.y);
      const z = parseFloat(el.dataset.z);

      tempV.set(x, y, z);
      tempV.project(this.camera);

      if (tempV.z > 1) {
        el.classList.remove('visible');
        return;
      }

      const screenX = (tempV.x * 0.5 + 0.5) * window.innerWidth;
      const screenY = (-(tempV.y * 0.5) + 0.5) * window.innerHeight;

      el.style.left = `${screenX}px`;
      el.style.top = `${screenY}px`;
      el.classList.add('visible');
    });
  }

  // =========================================================================
  // UI BINDING
  // =========================================================================
  bindUI() {
    // Chapter Tabs
    document.querySelectorAll('.chapter-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const ch = parseInt(tab.dataset.chapter);
        this.timeline.goToChapter(ch);
      });
    });

    // Next / Prev Chapter
    const nextBtn = document.getElementById('btn-next-chapter');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.timeline.nextChapter();
      });
    }

    // Auto Tour
    const tourBtn = document.getElementById('btn-tour');
    if (tourBtn) {
      tourBtn.addEventListener('click', () => {
        const isRunning = this.timeline.toggleAutoTour();
        tourBtn.classList.toggle('active', isRunning);
        tourBtn.querySelector('span.text').innerText = isRunning ? 'Stop Tour' : 'Auto Tour';
      });
    }

    // Audio
    const audioBtn = document.getElementById('btn-audio');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        const isPlaying = this.audio.toggle();
        audioBtn.classList.toggle('playing', isPlaying);
        audioBtn.classList.toggle('active', isPlaying);
      });
    }

    // Weather Toolbar
    document.querySelectorAll('.weather-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const w = btn.dataset.weather;
        this.timeline.setWeather(w);
      });
    });

    // Time Slider
    const timeSlider = document.getElementById('time-slider');
    if (timeSlider) {
      timeSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        this.timeline.setTimeOfDay(val);
      });
    }

    // Camera View Presets
    document.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const view = btn.dataset.view;
        this.setCameraPreset(view);
      });
    });

    // Photo Capture
    const photoBtn = document.getElementById('btn-photo');
    if (photoBtn) {
      photoBtn.addEventListener('click', () => {
        this.capturePhotoMemory();
      });
    }

    // Photo Modal Buttons
    const closePhotoBtn = document.getElementById('btn-close-photo');
    if (closePhotoBtn) {
      closePhotoBtn.addEventListener('click', () => {
        document.getElementById('photo-modal').classList.remove('open');
      });
    }

    const downloadPhotoBtn = document.getElementById('btn-download-photo');
    if (downloadPhotoBtn) {
      downloadPhotoBtn.addEventListener('click', () => {
        const img = document.getElementById('polaroid-img');
        if (img && img.src) {
          const a = document.createElement('a');
          a.href = img.src;
          a.download = `Mountain_Resort_${this.timeline.coupleNames.partner1}_and_${this.timeline.coupleNames.partner2}.png`;
          a.click();
        }
      });
    }

    // Scrapbook Modal
    const albumBtn = document.getElementById('btn-album');
    const albumModal = document.getElementById('album-modal');
    if (albumBtn && albumModal) {
      albumBtn.addEventListener('click', () => {
        this.renderScrapbookAlbum();
        albumModal.classList.add('open');
      });

      document.getElementById('btn-close-album').addEventListener('click', () => {
        albumModal.classList.remove('open');
      });
    }

    // Custom Names & Outfit Modal
    const customNamesBtn = document.getElementById('btn-names');
    const namesModal = document.getElementById('names-modal');
    if (customNamesBtn && namesModal) {
      customNamesBtn.addEventListener('click', () => {
        namesModal.classList.add('open');
      });

      document.getElementById('btn-save-names').addEventListener('click', () => {
        const p1 = document.getElementById('input-p1').value;
        const p2 = document.getElementById('input-p2').value;
        const outfit = document.querySelector('input[name="outfit"]:checked')?.value || 'coral_navy';
        this.timeline.setCoupleNames(p1, p2);
        this.timeline.setOutfitTheme(outfit);
        namesModal.classList.remove('open');
      });

      document.getElementById('btn-cancel-names').addEventListener('click', () => {
        namesModal.classList.remove('open');
      });
    }

    // Telescope Overlay Close
    const closeTeleBtn = document.getElementById('btn-close-telescope');
    if (closeTeleBtn) {
      closeTeleBtn.addEventListener('click', () => {
        this.timeline.toggleTelescopeOverlay(false);
      });
    }

    // Mobile Drawer Controls
    const bottomPanel = document.getElementById('bottom-panel');
    const mobileExpandBtn = document.getElementById('btn-mobile-expand');
    const closeDrawerBtn = document.getElementById('btn-close-drawer');

    if (mobileExpandBtn && bottomPanel) {
      mobileExpandBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        bottomPanel.classList.toggle('drawer-open');
      });
    }

    if (closeDrawerBtn && bottomPanel) {
      closeDrawerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        bottomPanel.classList.remove('drawer-open');
      });
    }

    // Mobile Mini Bar Action Buttons
    const mobPrev = document.getElementById('btn-mob-prev');
    if (mobPrev) {
      mobPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        this.timeline.prevChapter();
      });
    }

    const mobNext = document.getElementById('btn-mob-next');
    if (mobNext) {
      mobNext.addEventListener('click', (e) => {
        e.stopPropagation();
        this.timeline.nextChapter();
      });
    }

    const mobTour = document.getElementById('btn-mob-tour');
    if (mobTour) {
      mobTour.addEventListener('click', (e) => {
        e.stopPropagation();
        const isRunning = this.timeline.toggleAutoTour();
        mobTour.classList.toggle('active', isRunning);
        if (tourBtn) tourBtn.classList.toggle('active', isRunning);
      });
    }

    const mobZen = document.getElementById('btn-mob-zen');
    if (mobZen) {
      mobZen.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleZenMode();
      });
    }

    const mobNames = document.getElementById('btn-names-mobile');
    if (mobNames && namesModal) {
      mobNames.addEventListener('click', (e) => {
        e.stopPropagation();
        namesModal.classList.add('open');
      });
    }

    // Tap on Canvas Container to toggle Zen Mode / Close Mobile Drawer
    let pointerDownTime = 0;
    this.container.addEventListener('pointerdown', () => {
      pointerDownTime = Date.now();
    });

    this.container.addEventListener('pointerup', (e) => {
      // If was a quick tap (< 250ms) and not a drag
      if (Date.now() - pointerDownTime < 250) {
        if (bottomPanel && bottomPanel.classList.contains('drawer-open')) {
          bottomPanel.classList.remove('drawer-open');
        } else {
          this.toggleZenMode();
        }
      }
    });

    // UI Hide / Fullscreen
    const toggleUiBtn = document.getElementById('btn-toggle-ui');
    if (toggleUiBtn) {
      toggleUiBtn.addEventListener('click', () => {
        this.toggleZenMode();
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'h' || e.key === 'H') {
        this.toggleZenMode();
      }
    });
  }

  toggleZenMode() {
    const overlay = document.getElementById('ui-overlay');
    const hint = document.getElementById('zen-hint');
    const bottomPanel = document.getElementById('bottom-panel');

    if (bottomPanel) bottomPanel.classList.remove('drawer-open');

    if (overlay) {
      const isHidden = overlay.classList.toggle('hidden');
      if (hint && isHidden) {
        hint.classList.add('show');
        setTimeout(() => {
          hint.classList.remove('show');
        }, 2200);
      }
    }
  }

  setCameraPreset(preset) {
    this.timeline.isRidingGondola = false;
    let targetPos, targetLookAt;

    switch(preset) {
      case 'breakfast':
        targetPos = { x: 7.2, y: 3.5, z: 0.8 };
        targetLookAt = { x: 4.0, y: 2.8, z: -1.5 };
        break;
      case 'pool':
        targetPos = { x: 3.0, y: 3.2, z: 12.8 };
        targetLookAt = { x: 1.5, y: 2.0, z: 6.5 };
        break;
      case 'firepit':
        targetPos = { x: 14.5, y: 3.5, z: 13.5 };
        targetLookAt = { x: 10.5, y: 2.0, z: 9.5 };
        break;
      case 'gondola':
        this.timeline.isRidingGondola = true;
        this.timeline.showToast("🚡 Riding the Alpine Cable Car!");
        return;
      case 'summit':
        targetPos = { x: 40.5, y: 61.5, z: -43.0 };
        targetLookAt = { x: 35.0, y: 59.0, z: -53.0 };
        break;
      case 'bedroom':
        targetPos = { x: 17.5, y: 6.4, z: -2.8 };
        targetLookAt = { x: 13.5, y: 5.6, z: -6.0 };
        break;
      case 'drone':
        targetPos = { x: -35.0, y: 45.0, z: 45.0 };
        targetLookAt = { x: 10.0, y: 4.0, z: -2.0 };
        break;
      default:
        const ch = this.timeline.chapters[this.timeline.currentChapter - 1];
        targetPos = ch.camPos;
        targetLookAt = ch.camTarget;
    }

    this.timeline.animateCamera(targetPos, targetLookAt, 2.0);
  }

  capturePhotoMemory() {
    if (this.audio) this.audio.playCameraShutter();

    const flash = document.getElementById('photo-flash');
    flash.classList.add('flash');
    setTimeout(() => {
      flash.classList.remove('flash');
    }, 450);

    const dataURL = this.renderer.domElement.toDataURL('image/png');

    const modal = document.getElementById('photo-modal');
    const polaroidImg = document.getElementById('polaroid-img');
    const polaroidCaption = document.getElementById('polaroid-caption');
    const polaroidMeta = document.getElementById('polaroid-meta');

    const ch = this.timeline.chapters[this.timeline.currentChapter - 1];
    const captionText = `"${ch.title}" — ${this.timeline.coupleNames.partner1} & ${this.timeline.coupleNames.partner2}`;

    if (polaroidImg) polaroidImg.src = dataURL;
    if (polaroidCaption) polaroidCaption.innerText = captionText;
    if (polaroidMeta) polaroidMeta.innerText = `Alpine Luxury Lake Resort · ${ch.timeStr}`;

    // Record into Vacation Scrapbook!
    this.timeline.saveScrapbookMemory(dataURL, ch.title, ch.timeStr);

    setTimeout(() => {
      modal.classList.add('open');
    }, 300);

    if (typeof confetti === 'function') {
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  }

  renderScrapbookAlbum() {
    const grid = document.getElementById('album-grid');
    if (!grid) return;
    grid.innerHTML = '';

    if (this.timeline.memories.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #94a3b8;">
          <p style="font-size: 1.1rem; margin-bottom: 8px;">📷 No memories captured yet!</p>
          <p style="font-size: 0.85rem;">Click the Camera button in the top menu to snap unforgettable photos of Ethan & Maya.</p>
        </div>
      `;
      return;
    }

    this.timeline.memories.forEach((mem, idx) => {
      const card = document.createElement('div');
      card.className = 'album-polaroid';
      card.innerHTML = `
        <img src="${mem.img}" alt="Memory ${idx + 1}">
        <div class="album-caption">${mem.title}</div>
        <div class="album-meta">${mem.time} · Saved at ${mem.timestamp}</div>
      `;
      grid.appendChild(card);
    });
  }

  hideLoader() {
    const loader = document.getElementById('loader-screen');
    const fill = document.querySelector('.loader-bar-fill');
    if (fill) fill.style.width = '100%';

    setTimeout(() => {
      if (loader) loader.classList.add('fade-out');
    }, 700);
  }

  setupResize() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.app = new AlpineApp();
  window.app.init();
});
