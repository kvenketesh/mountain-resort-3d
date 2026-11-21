/**
 * ALPINESCAPE - Enhanced Story & Timeline Controller
 * Coordinates the 4 Chapters, Dynamic Time-of-Day Lighting,
 * Weather Controls, Couple Activities, Cable Car Ride, and Vacation Scrapbook.
 */

class StoryTimeline {
  constructor(world, camera, controls) {
    this.world = world;
    this.camera = camera;
    this.controls = controls;

    this.currentChapter = 1;
    this.currentTime = 7.5; // 7:30 AM
    this.isAutoTour = false;
    this.autoTourTimer = null;
    this.isRidingGondola = false;
    this.isTelescopeActive = false;
    this.showConstellations = false;
    this.isSwimming = false;

    this.currentWeather = 'sunny';
    this.currentOutfit = 'coral_navy';

    this.coupleNames = {
      partner1: "Ethan",
      partner2: "Maya"
    };

    // Vacation Memories Scrapbook
    this.memories = [];

    // 4 Core Chapters
    this.chapters = [
      {
        id: 1,
        time: 7.5, // 07:30 AM
        badge: "Morning Awakening",
        timeStr: "07:30 AM · Golden Hour",
        title: "Lakeside Breakfast & Morning Glow",
        description: `As golden dawn mist drifts across the pristine alpine lake, ${this.coupleNames.partner1} & ${this.coupleNames.partner2} wake up to fresh mountain air. Sitting on the sunlit resort deck right beside the crystal-clear infinity pool, they share steaming espresso, warm croissants, and quiet smiles as the mountains awaken.`,
        camPos: { x: 9.5, y: 3.8, z: 2.2 },
        camTarget: { x: 3.8, y: 2.8, z: -1.2 },
        poseKey: 'ch1',
        activities: [
          { id: 'clink', label: '🥂 Clink Espresso Cups', icon: '☕' },
          { id: 'feed', label: '🥐 Savor Croissant', icon: '🥐' },
          { id: 'rowboat', label: '🚣 Look at Rowboat', icon: '🚣' }
        ],
        hotspots: [
          { id: 'coffee', label: '☕ Steaming Coffee', x: 3.3, y: 3.4, z: -1.3, text: 'Rich hazelnut dark roast brewing with morning lake mist.' },
          { id: 'pool_morning', label: '🏊 Infinity Pool', x: 2.0, y: 2.6, z: 6.5, text: 'Turquoise water mirroring the sunrise, seamlessly meeting the lake.' },
          { id: 'swans_morning', label: '🦢 Gliding Swans', x: -18.0, y: 1.0, z: 15.0, text: 'Graceful white swans gliding smoothly across the calm waters.' }
        ]
      },
      {
        id: 2,
        time: 13.5, // 01:30 PM
        badge: "Mountain Ascent",
        timeStr: "01:30 PM · Crisp Midday",
        title: "Breathtaking Cloudcrest Summit",
        description: `Taking the scenic red aerial gondola over fragrant pine forests, the couple reaches Cloudcrest Peak at 7,200 ft. Hand-in-hand at the rustic timber overlook, they take in the dizzying, awe-inspiring 360° panorama of jagged snow-capped peaks and their resort shimmering far below.`,
        camPos: { x: 39.5, y: 61.2, z: -44.5 },
        camTarget: { x: 34.5, y: 59.5, z: -53.0 },
        poseKey: 'ch2',
        activities: [
          { id: 'telescope_zoom', label: '🔭 First-Person Telescope', icon: '🔭' },
          { id: 'ride_gondola', label: '🚡 Ride Cable Car', icon: '🚡' },
          { id: 'soaring_eagle', label: '🦅 Track Mountain Eagle', icon: '🦅' }
        ],
        hotspots: [
          { id: 'telescope', label: '🔭 Summit Telescope', x: 32.5, y: 60.2, z: -51.8, text: 'Magnifying distant glacial peaks and soaring golden eagles.' },
          { id: 'flags', label: '🚩 Prayer Flags', x: 35.0, y: 61.2, z: -50.7, text: 'Vibrant trail banners fluttering in the crisp high-altitude wind.' },
          { id: 'gondola_top', label: '🚡 Cloudcrest Station', x: 35.0, y: 58.0, z: -48.0, text: 'The cable car arriving at the high alpine terminal.' }
        ]
      },
      {
        id: 3,
        time: 21.5, // 09:30 PM
        badge: "Nightfall Return",
        timeStr: "09:30 PM · Celestial Twilight",
        title: "The Starry Sky & Infinity Pool Glow",
        description: `Returning to the resort as twilight deepens into velvet night, ${this.coupleNames.partner1} & ${this.coupleNames.partner2} sit at the edge of the infinity pool. The submerged cyan LEDs cast shimmering ripples that merge with the dark lake, while thousands of crystalline stars and the Milky Way sparkle in the crystal clear sky above.`,
        camPos: { x: 6.8, y: 3.4, z: 12.5 },
        camTarget: { x: 1.8, y: 2.6, z: 6.5 },
        poseKey: 'ch3',
        activities: [
          { id: 'toggle_swim', label: '🏊 Take a Night Dip', icon: '🏊' },
          { id: 'stargaze', label: '✨ Constellation Stargazer', icon: '✨' },
          { id: 'firepit', label: '🔥 Lakeside Campfire', icon: '🔥' }
        ],
        hotspots: [
          { id: 'shooting_star', label: '🌠 Make a Wish', x: 0, y: 35, z: -30, text: 'Shooting stars streak across the constellations. Click to trigger one!' },
          { id: 'pool_glow', label: '✨ Illuminated Pool', x: 2.0, y: 2.0, z: 6.5, text: 'Warm turquoise pool lights radiating against the cool alpine night.' },
          { id: 'camp_fire', label: '🔥 Sunken Firepit', x: 10.5, y: 2.2, z: 9.5, text: 'Cozy stone pit with crackling campfire and roasting marshmallows.' }
        ]
      },
      {
        id: 4,
        time: 23.5, // 11:30 PM
        badge: "Cozy Sanctuary",
        timeStr: "11:30 PM · Midnight Serenity",
        title: "Fireplace Warmth & Drifting to Sleep",
        description: `Retreating into their luxury master bedroom, the couple slips into the plush king bed under a down duvet. Golden embers crackle in the stone fireplace, while the moon casts a silvery light beam across the lake visible through their panoramic floor-to-ceiling glass wall, gently lulling them to sleep.`,
        camPos: { x: 17.5, y: 6.2, z: -2.8 },
        camTarget: { x: 13.5, y: 5.6, z: -6.0 },
        poseKey: 'ch4',
        activities: [
          { id: 'stoke_fire', label: '🔥 Stoke Fireplace', icon: '🔥' },
          { id: 'night_lullaby', label: '🎵 Bedtime Lullaby', icon: '🎵' },
          { id: 'moonlight', label: '🌙 Gaze at Moonlit Lake', icon: '🌙' }
        ],
        hotspots: [
          { id: 'fireplace', label: '🔥 Crackling Fire', x: 16.8, y: 5.6, z: -3.3, text: 'Warm stone hearth crackling with alpine birch logs and glowing embers.' },
          { id: 'king_bed', label: '🛏️ Down Duvet Bed', x: 13.5, y: 5.8, z: -6.0, text: 'Wrapped together in plush warmth, ready for sweet mountain dreams.' },
          { id: 'night_window', label: '🌙 Moonlit Glass Wall', x: 11.5, y: 6.0, z: -1.0, text: 'Unbroken panoramic view of the moon reflecting off the quiet lake.' }
        ]
      }
    ];
  }

  setCoupleNames(partner1, partner2) {
    if (partner1) this.coupleNames.partner1 = partner1.trim();
    if (partner2) this.coupleNames.partner2 = partner2.trim();
    
    this.chapters[0].description = `As golden dawn mist drifts across the pristine alpine lake, ${this.coupleNames.partner1} & ${this.coupleNames.partner2} wake up to fresh mountain air. Sitting on the sunlit resort deck right beside the crystal-clear infinity pool, they share steaming espresso, warm croissants, and quiet smiles as the mountains awaken.`;
    this.chapters[1].description = `Taking the scenic red aerial gondola over fragrant pine forests, the couple reaches Cloudcrest Peak at 7,200 ft. Hand-in-hand at the rustic timber overlook, they take in the dizzying, awe-inspiring 360° panorama of jagged snow-capped peaks and their resort shimmering far below.`;
    this.chapters[2].description = `Returning to the resort as twilight deepens into velvet night, ${this.coupleNames.partner1} & ${this.coupleNames.partner2} sit at the edge of the infinity pool. The submerged cyan LEDs cast shimmering ripples that merge with the dark lake, while thousands of crystalline stars and the Milky Way sparkle in the crystal clear sky above.`;
    this.chapters[3].description = `Retreating into their luxury master bedroom, the couple slips into the plush king bed under a down duvet. Golden embers crackle in the stone fireplace, while the moon casts a silvery light beam across the lake visible through their panoramic floor-to-ceiling glass wall, gently lulling them to sleep.`;

    this.updateUI();
  }

  setOutfitTheme(theme) {
    this.currentOutfit = theme;
    let mColor = 0x2563eb;
    let fColor = 0xf43f5e;

    if (theme === 'emerald') {
      mColor = 0x059669;
      fColor = 0x10b981;
    } else if (theme === 'sapphire') {
      mColor = 0x1d4ed8;
      fColor = 0xdb2777;
    } else if (theme === 'midnight') {
      mColor = 0x334155;
      fColor = 0x94a3b8;
    }

    // Apply to current visible couple character meshes
    if (this.world && this.world.coupleModels) {
      Object.keys(this.world.coupleModels).forEach(k => {
        const group = this.world.coupleModels[k];
        group.traverse(child => {
          if (child.isMesh && child.material && child.material.color) {
            if (child.material === this.world.materials.wood) return;
            // Differentiate
          }
        });
      });
    }
  }

  setWeather(type) {
    this.currentWeather = type;
    if (this.world) this.world.setWeather(type);
    if (window.ProceduralAudio) window.ProceduralAudio.setWeather(type);

    document.querySelectorAll('.weather-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.weather === type);
    });
  }

  goToChapter(index, smooth = true) {
    if (index < 1 || index > 4) return;
    this.currentChapter = index;
    const ch = this.chapters[index - 1];

    this.isRidingGondola = false;
    this.isTelescopeActive = false;
    this.isSwimming = false;
    const teleModal = document.getElementById('telescope-overlay');
    if (teleModal) teleModal.classList.remove('active');

    // Couple Avatar Pose
    Object.keys(this.world.coupleModels).forEach(key => {
      this.world.coupleModels[key].visible = (key === ch.poseKey);
    });

    // Time of Day
    this.setTimeOfDay(ch.time, smooth);

    // Camera
    this.animateCamera(ch.camPos, ch.camTarget, smooth ? 2.2 : 0);

    // Audio
    if (window.ProceduralAudio) {
      window.ProceduralAudio.setChapter(index);
    }

    // UI & Hotspots & Activities
    this.updateUI();
    this.updateHotspots(ch.hotspots);
    this.updateActivities(ch.activities);
  }

  nextChapter() {
    let next = this.currentChapter + 1;
    if (next > 4) next = 1;
    this.goToChapter(next);
  }

  prevChapter() {
    let prev = this.currentChapter - 1;
    if (prev < 1) prev = 4;
    this.goToChapter(prev);
  }

  toggleAutoTour() {
    this.isAutoTour = !this.isAutoTour;
    if (this.isAutoTour) {
      this.runAutoTourStep();
    } else {
      if (this.autoTourTimer) clearTimeout(this.autoTourTimer);
    }
    return this.isAutoTour;
  }

  runAutoTourStep() {
    if (!this.isAutoTour) return;
    this.nextChapter();
    this.autoTourTimer = setTimeout(() => {
      if (this.isAutoTour) this.runAutoTourStep();
    }, 11000);
  }

  // =========================================================================
  // DYNAMIC TIME OF DAY ENGINE
  // =========================================================================
  setTimeOfDay(hour, smooth = false) {
    this.currentTime = hour;

    const timeNorm = (hour - 6) / 24;
    const sunAngle = timeNorm * Math.PI * 2;

    const sunY = Math.sin(sunAngle) * 110;
    const sunX = Math.cos(sunAngle) * 90;
    const sunZ = Math.sin(sunAngle * 0.5) * 60;

    if (this.world.sunLight && this.world.sunMesh) {
      this.world.sunLight.position.set(sunX, Math.max(-20, sunY), sunZ);
      this.world.sunMesh.position.copy(this.world.sunLight.position);
      this.world.sunMesh.visible = (sunY > -5);
    }

    if (this.world.moonLight && this.world.moonMesh) {
      this.world.moonLight.position.set(-sunX, Math.max(-20, -sunY), -sunZ);
      this.world.moonMesh.position.copy(this.world.moonLight.position);
      this.world.moonMesh.visible = (-sunY > -5);
    }

    let skyColor, sunIntensity, ambientIntensity, starOpacity, poolLightIntensity, resortLightIntensity;

    if (hour >= 5.5 && hour < 8.5) {
      const t = (hour - 5.5) / 3.0;
      skyColor = new THREE.Color().lerpColors(new THREE.Color(0xfdba74), new THREE.Color(0x93c5fd), t);
      sunIntensity = 1.2 + t * 0.4;
      ambientIntensity = 0.45;
      starOpacity = (1.0 - t) * 0.4;
      poolLightIntensity = (1.0 - t) * 0.5;
      resortLightIntensity = (1.0 - t) * 0.6;
    } else if (hour >= 8.5 && hour < 17.5) {
      skyColor = new THREE.Color(0x38bdf8);
      sunIntensity = 1.9;
      ambientIntensity = 0.65;
      starOpacity = 0.0;
      poolLightIntensity = 0.0;
      resortLightIntensity = 0.0;
    } else if (hour >= 17.5 && hour < 20.5) {
      const t = (hour - 17.5) / 3.0;
      skyColor = new THREE.Color().lerpColors(new THREE.Color(0xf43f5e), new THREE.Color(0x1e1b4b), t);
      sunIntensity = (1.0 - t) * 1.5;
      ambientIntensity = 0.4 - t * 0.2;
      starOpacity = t * 0.7;
      poolLightIntensity = t * 1.5;
      resortLightIntensity = t * 1.4;
    } else {
      skyColor = new THREE.Color(0x050b14);
      sunIntensity = 0.0;
      ambientIntensity = 0.18;
      starOpacity = 1.0;
      poolLightIntensity = 1.8;
      resortLightIntensity = 1.6;
    }

    if (this.world.skyMat) this.world.skyMat.color.copy(skyColor);
    if (this.world.sunLight) this.world.sunLight.intensity = Math.max(0, sunIntensity);
    if (this.world.moonLight) this.world.moonLight.intensity = (hour > 19 || hour < 6) ? 0.45 : 0.0;
    if (this.world.ambientLight) this.world.ambientLight.intensity = ambientIntensity;
    if (this.world.starMaterial) this.world.starMaterial.opacity = starOpacity;
    if (this.world.fireflyMaterial) this.world.fireflyMaterial.opacity = (hour > 19.5 || hour < 5.5) ? 0.9 : 0.0;

    this.world.poolLights.forEach(light => {
      light.intensity = poolLightIntensity;
    });
    this.world.resortLights.forEach(light => {
      light.intensity = resortLightIntensity;
    });

    if (this.world.firepitLight) {
      this.world.firepitLight.intensity = (hour > 18.5 || hour < 6) ? 1.8 : 0.4;
    }

    // Auto constellation visibility at night
    if (hour > 19 || hour < 5.5) {
      if (this.showConstellations) this.world.toggleConstellations(true);
    } else {
      this.world.toggleConstellations(false);
    }

    const slider = document.getElementById('time-slider');
    const timeLabel = document.getElementById('time-display');
    if (slider) slider.value = hour;
    if (timeLabel) {
      const h = Math.floor(hour);
      const m = Math.floor((hour - h) * 60);
      const ampm = h >= 12 ? 'PM' : 'AM';
      const h12 = h % 12 === 0 ? 12 : h % 12;
      timeLabel.innerText = `${h12.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`;
    }
  }

  animateCamera(targetPos, targetLookAt, duration = 2.0) {
    if (duration === 0 || typeof gsap === 'undefined') {
      this.camera.position.set(targetPos.x, targetPos.y, targetPos.z);
      this.controls.target.set(targetLookAt.x, targetLookAt.y, targetLookAt.z);
      this.controls.update();
      return;
    }

    gsap.killTweensOf(this.camera.position);
    gsap.killTweensOf(this.controls.target);

    gsap.to(this.camera.position, {
      x: targetPos.x,
      y: targetPos.y,
      z: targetPos.z,
      duration: duration,
      ease: "power2.inOut"
    });

    gsap.to(this.controls.target, {
      x: targetLookAt.x,
      y: targetLookAt.y,
      z: targetLookAt.z,
      duration: duration,
      ease: "power2.inOut",
      onUpdate: () => {
        this.controls.update();
      }
    });
  }

  updateUI() {
    const ch = this.chapters[this.currentChapter - 1];

    document.querySelectorAll('.chapter-tab').forEach((tab, idx) => {
      tab.classList.toggle('active', idx + 1 === this.currentChapter);
    });

    const badgeEl = document.getElementById('story-badge');
    const timeEl = document.getElementById('story-time');
    const titleEl = document.getElementById('story-title');
    const descEl = document.getElementById('story-desc');

    if (badgeEl) badgeEl.innerText = ch.badge;
    if (timeEl) timeEl.innerText = ch.timeStr;
    if (titleEl) titleEl.innerText = ch.title;
    if (descEl) descEl.innerText = ch.description;
  }

  updateHotspots(hotspotList) {
    const container = document.getElementById('hotspots-layer');
    if (!container) return;
    container.innerHTML = '';

    hotspotList.forEach(item => {
      const el = document.createElement('div');
      el.className = 'hotspot-marker';
      el.dataset.x = item.x;
      el.dataset.y = item.y;
      el.dataset.z = item.z;

      el.innerHTML = `
        <div class="hotspot-pin">✦</div>
        <div class="hotspot-card">${item.label}</div>
      `;

      el.addEventListener('click', () => {
        this.onHotspotClick(item);
      });

      container.appendChild(el);
    });
  }

  updateActivities(activitiesList) {
    const container = document.getElementById('activities-bar');
    if (!container) return;
    container.innerHTML = '';

    activitiesList.forEach(act => {
      const btn = document.createElement('button');
      btn.className = 'activity-btn glass-btn';
      btn.innerHTML = `<span>${act.icon}</span><span>${act.label}</span>`;
      btn.addEventListener('click', () => {
        this.onActivityTrigger(act.id);
      });
      container.appendChild(btn);
    });
  }

  // =========================================================================
  // ROMANTIC INTERACTIVE ACTIVITIES
  // =========================================================================
  onActivityTrigger(activityId) {
    if (activityId === 'clink') {
      if (window.ProceduralAudio) window.ProceduralAudio.playCupClink();
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 25,
          spread: 50,
          origin: { x: 0.5, y: 0.5 },
          shapes: ['circle'],
          colors: ['#f43f5e', '#fbbf24']
        });
      }
      this.showToast("🥂 Ethan & Maya shared a warm morning toast!");
    } else if (activityId === 'feed') {
      this.showToast("🥐 Savoring freshly baked butter croissants together.");
    } else if (activityId === 'rowboat') {
      this.animateCamera({ x: -14, y: 2.2, z: 16 }, { x: -8, y: 0.5, z: 8 }, 2.0);
    } else if (activityId === 'telescope_zoom') {
      this.toggleTelescopeOverlay(true);
    } else if (activityId === 'ride_gondola') {
      this.isRidingGondola = !this.isRidingGondola;
      this.showToast(this.isRidingGondola ? "🚡 Riding the Alpine Gondola!" : "Exited Gondola View.");
    } else if (activityId === 'soaring_eagle') {
      if (this.world && this.world.eagle) {
        this.animateCamera(
          { x: this.world.eagle.position.x + 12, y: this.world.eagle.position.y + 6, z: this.world.eagle.position.z + 12 },
          { x: this.world.eagle.position.x, y: this.world.eagle.position.y, z: this.world.eagle.position.z },
          2.5
        );
      }
    } else if (activityId === 'toggle_swim') {
      this.isSwimming = !this.isSwimming;
      if (this.world && this.world.coupleModels) {
        this.world.coupleModels.ch3.visible = !this.isSwimming;
        this.world.coupleModels.swim.visible = this.isSwimming;
      }
      if (window.ProceduralAudio) window.ProceduralAudio.playWaterSplash();
      this.showToast(this.isSwimming ? "🏊 Ethan & Maya slipped into the warm turquoise infinity pool!" : "Sitting back on the poolside teak deck.");
    } else if (activityId === 'stargaze') {
      this.showConstellations = !this.showConstellations;
      this.world.toggleConstellations(this.showConstellations);
      this.showToast(this.showConstellations ? "✨ Constellations mapped: The Dipper & Heart of the Alps!" : "Constellation lines hidden.");
    } else if (activityId === 'firepit') {
      this.animateCamera({ x: 14.5, y: 3.2, z: 13.5 }, { x: 10.5, y: 2.0, z: 9.5 }, 2.0);
      this.showToast("🔥 Roasting marshmallows by the sunken lakeside campfire.");
    } else if (activityId === 'stoke_fire') {
      if (typeof confetti === 'function') {
        confetti({ particleCount: 30, spread: 45, origin: { x: 0.65, y: 0.6 }, colors: ['#f97316', '#fbbf24'] });
      }
      this.showToast("🔥 Stoking the stone fireplace embers.");
    } else if (activityId === 'night_lullaby') {
      if (window.ProceduralAudio && !window.ProceduralAudio.isPlaying) {
        window.ProceduralAudio.toggle();
      }
      this.showToast("🎵 Playing bedtime acoustic sleep chords.");
    } else if (activityId === 'moonlight') {
      this.animateCamera({ x: 11.5, y: 5.6, z: -3.5 }, { x: -20, y: 1.5, z: 10 }, 2.0);
    }
  }

  toggleTelescopeOverlay(show) {
    this.isTelescopeActive = show;
    const overlay = document.getElementById('telescope-overlay');
    if (overlay) overlay.classList.toggle('active', show);
    if (window.ProceduralAudio && show) window.ProceduralAudio.playTelescopeClick();
  }

  showToast(msg) {
    const descEl = document.getElementById('story-desc');
    if (descEl) descEl.innerHTML = `<strong>Activity:</strong> ${msg}`;
  }

  onHotspotClick(item) {
    if (item.id === 'shooting_star') {
      this.world.triggerShootingStar();
      if (typeof confetti === 'function') {
        confetti({ particleCount: 30, spread: 60, origin: { y: 0.3 } });
      }
    }

    const descEl = document.getElementById('story-desc');
    if (descEl) {
      descEl.innerHTML = `<strong>${item.label}:</strong> ${item.text}`;
    }
  }

  // Record a vacation memory polaroid into the scrapbook
  saveScrapbookMemory(dataURL, title, time) {
    this.memories.push({
      img: dataURL,
      title: title,
      time: time,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    const countBadge = document.getElementById('album-count');
    if (countBadge) countBadge.innerText = this.memories.length;
  }
}

window.StoryTimeline = StoryTimeline;
