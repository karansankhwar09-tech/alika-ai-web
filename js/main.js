/**
 * ALIKA AI — Core Interactive Engine
 * Lightweight, vanilla JavaScript powering smooth interactions, 3D tilt, and image lightbox.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  if (typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }

  // 2. Responsive Mobile Hamburger Menu Logic
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuOpenIcon = document.getElementById('menuOpenIcon');
  const menuCloseIcon = document.getElementById('menuCloseIcon');

  if (mobileMenuBtn && mobileMenu) {
    function toggleMobileMenu(forceState) {
      const isHidden = mobileMenu.classList.contains('hidden');
      const shouldOpen = typeof forceState === 'boolean' ? forceState : isHidden;
      mobileMenu.classList.toggle('hidden', !shouldOpen);
      mobileMenuBtn.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
      if (menuOpenIcon) menuOpenIcon.classList.toggle('hidden', shouldOpen);
      if (menuCloseIcon) menuCloseIcon.classList.toggle('hidden', !shouldOpen);
    }

    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });

    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => toggleMobileMenu(false));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
        toggleMobileMenu(false);
      }
    });

    document.addEventListener('click', (e) => {
      if (!mobileMenu.classList.contains('hidden') && !mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        toggleMobileMenu(false);
      }
    });
  }

  // 3. 3D Card Tilt Effect on Mouse Move (Desktop Only, Respects Reduced Motion)
  const tiltCard = document.getElementById('tiltCard');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (tiltCard && window.innerWidth > 768 && !prefersReducedMotion) {
    document.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      const xOffset = (clientX / innerWidth - 0.5) * 14;
      const yOffset = (clientY / innerHeight - 0.5) * -14;

      tiltCard.style.transform = `perspective(1000px) rotateX(${yOffset}deg) rotateY(${xOffset}deg)`;
    });

    document.addEventListener('mouseleave', () => {
      tiltCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
  }

  // 4. Image Lightbox Modal Interaction
  const lightboxModal = document.getElementById('imageLightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');

  if (lightboxModal && lightboxImg) {
    function openLightbox(src, alt) {
      lightboxImg.src = src;
      lightboxImg.alt = alt || 'Enlarged Image Preview';
      if (lightboxCaption) {
        lightboxCaption.textContent = alt || 'ALIKA AI Desktop Interface Preview';
      }
      lightboxModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightboxModal.classList.remove('open');
      document.body.style.overflow = '';
      setTimeout(() => {
        lightboxImg.src = '';
      }, 250);
    }

    document.querySelectorAll('.zoomable-img').forEach(img => {
      img.addEventListener('click', () => {
        const resolvedSrc = img.getAttribute('data-full-src') || img.src || img.currentSrc;
        openLightbox(resolvedSrc, img.alt);
      });
    });

    if (lightboxCloseBtn) {
      lightboxCloseBtn.addEventListener('click', closeLightbox);
    }

    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightboxModal.classList.contains('open')) {
        closeLightbox();
      }
    });
  }

  // 5. Hero View Tabs Switcher (Genuine Dashboard Screenshot vs Video Demo)
  const tabScreenshotBtn = document.getElementById('tabScreenshotBtn');
  const tabVideoBtn = document.getElementById('tabVideoBtn');
  const heroScreenshotView = document.getElementById('heroScreenshotView');
  const heroVideoView = document.getElementById('heroVideoView');
  const heroVideo = document.getElementById('heroVideo');

  if (tabScreenshotBtn && tabVideoBtn && heroScreenshotView && heroVideoView) {
    tabScreenshotBtn.addEventListener('click', () => {
      tabScreenshotBtn.classList.add('active');
      tabVideoBtn.classList.remove('active');
      heroScreenshotView.classList.remove('hidden');
      heroVideoView.classList.add('hidden');
      if (heroVideo && !heroVideo.paused) {
        heroVideo.pause();
      }
    });

    tabVideoBtn.addEventListener('click', () => {
      tabVideoBtn.classList.add('active');
      tabScreenshotBtn.classList.remove('active');
      heroVideoView.classList.remove('hidden');
      heroScreenshotView.classList.add('hidden');
      if (heroVideo) {
        heroVideo.play().catch(() => {});
      }
    });
  }

  // 6. Phase 2: Neural Orb & Character Persona State Controller (Lab Demo)
  const orbStateBtns = document.querySelectorAll('.orb-state-btn');
  const interactiveNeuralOrb = document.getElementById('interactiveNeuralOrb');
  const orbStateDescription = document.getElementById('orbStateDescription');
  const orbStateBadge = document.getElementById('orbStateBadge');
  const personaCharacterVideo = document.getElementById('personaCharacterVideo');
  const personaVideoSource = document.getElementById('personaVideoSource');

  const personaClips = {
    idle: 'assets/idle.mp4',
    listening: 'assets/listening.mp4',
    thinking: 'assets/thinking.mp4',
    speaking: 'assets/speaking.mp4',
    seeing: 'assets/seeing.mp4',
    acting: 'assets/acting.mp4'
  };

  const orbStateData = {
    idle: {
      badge: 'State: Idle (Passive Baseline)',
      desc: 'Dedicated idle loop (assets/idle.mp4). Natural resting posture and breathing baseline. Minimal background power draw. Local hotkey listener (Alt + M) active.',
      color: 'text-cyan-400'
    },
    listening: {
      badge: 'State: Listening (Microphone Active)',
      desc: 'Dedicated listening clip (assets/listening.mp4, trimmed 0.0s–2.8s from idle footage). Attentive expression and gaze. Real-time Voice Activity Detection (VAD) active.',
      color: 'text-emerald-400'
    },
    thinking: {
      badge: 'State: Thinking (Gemini Live Reasoning)',
      desc: 'Dedicated thinking footage (assets/thinking.mp4). Thoughtful, hand-to-chin gesture during multimodal inference. Connecting speech tokens and screen context.',
      color: 'text-indigo-400'
    },
    speaking: {
      badge: 'State: Speaking (Voice Synthesized)',
      desc: 'Dedicated speaking clip (assets/speaking.mp4, from talking footage). Natural talking movement and gestures. Streaming low-latency voice packets with interrupt capability.',
      color: 'text-amber-400'
    },
    seeing: {
      badge: 'State: Seeing (Screen Vision Active)',
      desc: 'Dedicated seeing clip (assets/seeing.mp4, trimmed 2.2s–5.0s from idle footage). Attentive observing gaze and subtle blink. Capturing desktop frames via Win32 MSS API (Alt + Q).',
      color: 'text-cyan-300'
    },
    acting: {
      badge: 'State: Acting (Windows System Automation)',
      desc: 'Dedicated acting clip (assets/acting.mp4, trimmed 1.5s–4.5s from talking footage). Expressive dynamic movement. Executing authorized local system actions via FastAPI agent (:8765).',
      color: 'text-rose-400'
    }
  };

  if (orbStateBtns.length > 0 && interactiveNeuralOrb) {
    orbStateBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetState = btn.getAttribute('data-target-state');
        if (!targetState || !orbStateData[targetState]) return;

        orbStateBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        interactiveNeuralOrb.setAttribute('data-state', targetState);

        if (orbStateBadge) {
          orbStateBadge.textContent = orbStateData[targetState].badge;
          orbStateBadge.className = `font-mono text-xs font-bold ${orbStateData[targetState].color}`;
        }
        if (orbStateDescription) {
          orbStateDescription.textContent = orbStateData[targetState].desc;
        }

        if (personaCharacterVideo && personaVideoSource && personaClips[targetState]) {
          const newSrc = personaClips[targetState];
          const currentSrcAttr = personaVideoSource.getAttribute('src');
          if (currentSrcAttr !== newSrc) {
            personaCharacterVideo.classList.add('switching');
            setTimeout(() => {
              personaVideoSource.setAttribute('src', newSrc);
              personaCharacterVideo.load();
              personaCharacterVideo.play().catch(() => {});
              personaCharacterVideo.classList.remove('switching');
            }, 150);
          }
        }
      });
    });
  }

  // Hero Character State Selector (Idle, Listening, Thinking)
  const heroStateTabs = document.querySelectorAll('.hero-state-tab');
  const heroCharacterVideo = document.getElementById('heroCharacterVideo');
  const heroVideoSource = document.getElementById('heroVideoSource');

  if (heroStateTabs.length > 0 && heroCharacterVideo && heroVideoSource) {
    heroStateTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetState = tab.getAttribute('data-hero-state');
        if (!targetState || !personaClips[targetState]) return;

        heroStateTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const newSrc = personaClips[targetState];
        const currentSrc = heroVideoSource.getAttribute('src');
        if (currentSrc !== newSrc) {
          heroCharacterVideo.classList.add('switching');
          setTimeout(() => {
            heroVideoSource.setAttribute('src', newSrc);
            heroCharacterVideo.load();
            heroCharacterVideo.play().catch(() => {});
            heroCharacterVideo.classList.remove('switching');
          }, 150);
        }
      });
    });
  }

  // 7. Phase 2: Interrupt-Me Interactive Simulation
  const interruptActionBtn = document.getElementById('interruptActionBtn');
  const interruptChatContainer = document.getElementById('interruptChatContainer');
  const interruptStatusBadge = document.getElementById('interruptStatusBadge');
  const interruptAlikaSpeech = document.getElementById('interruptAlikaSpeech');
  const interruptWaveform = document.getElementById('interruptWaveform');

  let interruptDemoStep = 'initial'; // 'initial' -> 'speaking' -> 'interrupted'

  if (interruptActionBtn && interruptAlikaSpeech && interruptStatusBadge) {
    interruptActionBtn.addEventListener('click', () => {
      if (interruptDemoStep === 'initial') {
        // Step 1: Start speaking
        interruptDemoStep = 'speaking';
        interruptStatusBadge.textContent = 'Alika Speaking (Low-Latency Stream)';
        interruptStatusBadge.className = 'px-3 py-1 rounded-full text-xs font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30';
        interruptAlikaSpeech.innerHTML = '<span class="text-white font-medium">"Zaroor! Aapke code me line 42 par ek asynchronous lock issue hai, jisme background worker thread main loop ko block kar raha hai aur connection timeout throw..."</span>';
        if (interruptWaveform) interruptWaveform.classList.remove('hidden');

        interruptActionBtn.innerHTML = '<i data-lucide="hand" class="w-4 h-4"></i><span>Interrupt Alika: "Ruko! Database port 5432 ke baare me batao"</span>';
        interruptActionBtn.className = 'w-full sm:w-auto px-6 py-3 rounded-xl interrupt-pulse-btn text-xs font-bold flex items-center justify-center gap-2';
        if (typeof lucide !== 'undefined') lucide.createIcons();

      } else if (interruptDemoStep === 'speaking') {
        // Step 2: Trigger Interruption
        interruptDemoStep = 'interrupted';
        if (interruptWaveform) interruptWaveform.classList.add('hidden');
        interruptStatusBadge.textContent = '⚡ Interrupt Event Handled (Low-Latency Hand-off)';
        interruptStatusBadge.className = 'px-3 py-1 rounded-full text-xs font-mono bg-rose-500/10 text-rose-300 border border-rose-500/30';

        // Add interrupted conversation thread
        const interruptBubble = document.createElement('div');
        interruptBubble.className = 'chat-bubble-user text-xs sm:text-sm mt-3 animate-fade-in';
        interruptBubble.innerHTML = '<strong class="text-cyan-300 block mb-1">User (Interrupted mid-speech):</strong> "Ruko! Database port 5432 ke baare me batao"';
        interruptChatContainer.appendChild(interruptBubble);

        const immediateAlikaReply = document.createElement('div');
        immediateAlikaReply.className = 'chat-bubble-alika text-xs sm:text-sm mt-3 border border-emerald-500/30 bg-emerald-950/20';
        immediateAlikaReply.innerHTML = '<strong class="text-emerald-400 block mb-1">ALIKA AI (Immediate Shift):</strong> "Bilkul! Database port 5432 Postgres server ka hai. Aapka PostgreSQL service stopped hai; maine local agent ko alert kar diya hai."';
        interruptChatContainer.appendChild(immediateAlikaReply);

        interruptActionBtn.innerHTML = '<i data-lucide="rotate-ccw" class="w-4 h-4"></i><span>Replay Interrupt Demo</span>';
        interruptActionBtn.className = 'w-full sm:w-auto px-6 py-3 rounded-xl glow-btn text-xs font-bold flex items-center justify-center gap-2';
        if (typeof lucide !== 'undefined') lucide.createIcons();

      } else {
        // Reset Demo
        interruptDemoStep = 'initial';
        interruptChatContainer.innerHTML = `
          <div class="chat-bubble-user text-xs sm:text-sm">
            <strong class="text-cyan-300 block mb-1">User:</strong>
            "Alika, meri screen par yeh error code dekho aur samjhao kya dikkat hai."
          </div>
          <div id="interruptAlikaSpeech" class="chat-bubble-alika text-xs sm:text-sm mt-3">
            <strong class="text-amber-400 block mb-1">ALIKA AI (Ready):</strong>
            <span class="text-slate-300">"Press start to begin the voice interaction simulation..."</span>
          </div>
        `;
        interruptStatusBadge.textContent = 'Simulated Voice Protocol (No Mic Needed)';
        interruptStatusBadge.className = 'px-3 py-1 rounded-full text-xs font-mono bg-white/5 text-slate-400 border border-white/10';
        interruptActionBtn.innerHTML = '<i data-lucide="play" class="w-4 h-4"></i><span>Start Conversation Demo</span>';
        interruptActionBtn.className = 'w-full sm:w-auto px-6 py-3 rounded-xl glow-btn text-xs font-bold flex items-center justify-center gap-2';
        if (typeof lucide !== 'undefined') lucide.createIcons();
      }
    });
  }

  // 8. Phase 2: Through ALIKA's Eyes (Vision Lens Toggle)
  const toggleVisionOverlayBtn = document.getElementById('toggleVisionOverlayBtn');
  const toggleRawScreenBtn = document.getElementById('toggleRawScreenBtn');
  const visionOverlays = document.querySelectorAll('.vision-tag-box');
  const visionStatusLabel = document.getElementById('visionStatusLabel');

  if (toggleVisionOverlayBtn && toggleRawScreenBtn) {
    toggleVisionOverlayBtn.addEventListener('click', () => {
      toggleVisionOverlayBtn.classList.add('active');
      toggleRawScreenBtn.classList.remove('active');
      visionOverlays.forEach(box => { box.style.opacity = '1'; });
      if (visionStatusLabel) {
        visionStatusLabel.textContent = 'Mode: Active Perception Layer (RAM Volatile)';
        visionStatusLabel.className = 'text-cyan-300 font-mono text-xs';
      }
    });

    toggleRawScreenBtn.addEventListener('click', () => {
      toggleRawScreenBtn.classList.add('active');
      toggleVisionOverlayBtn.classList.remove('active');
      visionOverlays.forEach(box => { box.style.opacity = '0'; });
      if (visionStatusLabel) {
        visionStatusLabel.textContent = 'Mode: Raw Desktop Output (Zero Overlays)';
        visionStatusLabel.className = 'text-slate-400 font-mono text-xs';
      }
    });
  }

  // 9. Phase 2: Before & After Capability Showcase Tabs
  const capabilityTabs = document.querySelectorAll('.capability-tab-btn');
  const capabilityCards = document.querySelectorAll('.capability-card-panel');

  if (capabilityTabs.length > 0) {
    capabilityTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetDomain = tab.getAttribute('data-domain');
        capabilityTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        capabilityCards.forEach(card => {
          if (card.getAttribute('data-domain') === targetDomain) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });
  }

  // 10. Phase 2: Dynamic Notch Showcase Tabs
  const notchTabs = document.querySelectorAll('.notch-tab-btn');
  const notchPanels = document.querySelectorAll('.notch-panel');

  if (notchTabs.length > 0) {
    notchTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetView = tab.getAttribute('data-notch-view');
        notchTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        notchPanels.forEach(panel => {
          if (panel.getAttribute('data-notch-view') === targetView) {
            panel.classList.remove('hidden');
          } else {
            panel.classList.add('hidden');
          }
        });
      });
    });
  }

  // 11. Phase 2: Screening Room Gallery Filter & On-Demand Video Loader
  const galleryFilterBtns = document.querySelectorAll('.gallery-filter-pill');
  const galleryItems = document.querySelectorAll('.gallery-grid-item');

  if (galleryFilterBtns.length > 0) {
    galleryFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');
        galleryFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        galleryItems.forEach(item => {
          const category = item.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            item.classList.remove('hidden');
          } else {
            item.classList.add('hidden');
          }
        });
      });
    });
  }

  // On-Demand Video Loader in Screening Room
  const loadGalleryVideoBtn = document.getElementById('loadGalleryVideoBtn');
  const galleryVideoPlaceholder = document.getElementById('galleryVideoPlaceholder');
  const galleryVideoPlayer = document.getElementById('galleryVideoPlayer');

  if (loadGalleryVideoBtn && galleryVideoPlaceholder && galleryVideoPlayer) {
    loadGalleryVideoBtn.addEventListener('click', () => {
      galleryVideoPlaceholder.classList.add('hidden');
      galleryVideoPlayer.classList.remove('hidden');
      galleryVideoPlayer.play().catch(() => {});
    });
  }

  // 12. Phase 3: Interactive Architecture Node Explorer
  const archNodes = document.querySelectorAll('.arch-node-card');
  const archDetailTitle = document.getElementById('archDetailTitle');
  const archDetailBoundary = document.getElementById('archDetailBoundary');
  const archDetailDesc = document.getElementById('archDetailDesc');
  const archDetailSecurity = document.getElementById('archDetailSecurity');

  const archNodeData = {
    user: {
      title: 'Actor: User Interaction (Voice & Vision)',
      boundary: 'Local Input Boundary',
      desc: 'Speech captures via local microphone (PyAudio/VAD). Screen queries triggered on-demand via Alt + Q (Win32 MSS frame). No background surveillance.',
      security: 'User initiates all screen captures. Microphone active only when unmuted or wake word listener is enabled.'
    },
    desktop: {
      title: 'ALIKA Desktop Application Core',
      boundary: 'Local Windows Process',
      desc: 'Standalone Windows desktop executable providing the companion UI, Dynamic Notch floating island, hotkey routing, and local state management.',
      security: 'Runs locally as a non-elevated user process. Stores BYOK credentials in local secrets.json.'
    },
    orchestrator: {
      title: 'Session Orchestrator & Protocol Bridge',
      boundary: 'Local Session Dispatcher',
      desc: 'Coordinates real-time bi-directional WebSocket streaming, speech barge-in interrupt handling, and tool-call payload routing between AI and Windows.',
      security: 'Maintains transient runtime state in volatile memory. Dispatches tool execution requests only to authorized local handlers.'
    },
    gemini: {
      title: 'Google Gemini Live API (Multimodal Engine)',
      boundary: 'External TLS WebSocket (wss://)',
      desc: 'Remote multimodal reasoning engine provided by Google. Receives PCM audio packets and on-demand screen frames. Returns low-latency synthesized audio stream and structured tool calls.',
      security: 'Direct TLS 1.3 encrypted connection using personal Google AI Studio key. Governed by Google Cloud API terms.'
    },
    agent: {
      title: 'Windows Desktop Automation Agent (:8765)',
      boundary: 'Localhost Loopback Only (127.0.0.1)',
      desc: 'Lightweight FastAPI service running on port 8765. Translates structured tool instructions into native Windows UI Automation (UIA) and hardware calls (brightness, volume, media, app launches).',
      security: 'Bound strictly to localhost loopback. Zero external network port exposure. Executes only upon explicit user instruction.'
    },
    memory: {
      title: 'Local SQLite Memory & System Doctor',
      boundary: 'Local Storage & Subsystem Vitals',
      desc: 'Stores daily targets and study chronicle locally in alika_daily_memory.sqlite. System Doctor continuously runs 5 subsystem vitals checks with 2-attempt circuit-breaker self-healing.',
      security: 'Zero cloud synchronization of memory database. User retains full ownership and can delete memory files at any time.'
    }
  };

  if (archNodes.length > 0 && archDetailTitle) {
    archNodes.forEach(node => {
      node.addEventListener('click', () => {
        const nodeId = node.getAttribute('data-node');
        if (!nodeId || !archNodeData[nodeId]) return;

        archNodes.forEach(n => n.classList.remove('active'));
        node.classList.add('active');

        archDetailTitle.textContent = archNodeData[nodeId].title;
        archDetailBoundary.textContent = archNodeData[nodeId].boundary;
        archDetailDesc.textContent = archNodeData[nodeId].desc;
        archDetailSecurity.textContent = archNodeData[nodeId].security;
      });
    });
  }

  // 13. Phase 3: Packet Path Tab Switcher
  const packetPathTabs = document.querySelectorAll('.packet-path-tab-btn');
  const packetPathPanels = document.querySelectorAll('.packet-path-panel');

  if (packetPathTabs.length > 0) {
    packetPathTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetView = tab.getAttribute('data-packet-view');
        packetPathTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        packetPathPanels.forEach(panel => {
          if (panel.getAttribute('data-packet-view') === targetView) {
            panel.classList.remove('hidden');
          } else {
            panel.classList.add('hidden');
          }
        });
      });
    });
  }

  // Troubleshooting Accordion in Setup Ritual
  const troubleshootTriggers = document.querySelectorAll('.troubleshoot-trigger');
  troubleshootTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.troubleshoot-item');
      if (!item) return;
      const content = item.querySelector('.troubleshoot-content');
      if (!content) return;
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

      if (isExpanded) {
        trigger.setAttribute('aria-expanded', 'false');
        item.classList.remove('open');
        content.style.maxHeight = null;
      } else {
        trigger.setAttribute('aria-expanded', 'true');
        item.classList.add('open');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
});
