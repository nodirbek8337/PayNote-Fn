import { Injectable, effect, signal, computed } from '@angular/core';
import { Subject } from 'rxjs';

export interface layoutConfig {
  preset?: string;
  primary?: string;
  surface?: string | undefined | null;
  darkTheme?: boolean;
  menuMode?: string;
}

interface LayoutState {
  staticMenuDesktopInactive?: boolean;
  overlayMenuActive?: boolean;
  configSidebarVisible?: boolean;
  staticMenuMobileActive?: boolean;
  menuHoverActive?: boolean;
}

export const DEFAULT_LAYOUT_CONFIG: layoutConfig = {
  preset: 'Lara',
  primary: 'noir',
  surface: 'slate',
  darkTheme: false,
  menuMode: 'static'
};

@Injectable({ providedIn: 'root' })
export class LayoutService {
  layoutConfig = signal<layoutConfig>({ ...DEFAULT_LAYOUT_CONFIG });

  layoutState = signal<LayoutState>({
    staticMenuDesktopInactive: false,
    overlayMenuActive: false,
    configSidebarVisible: false,
    staticMenuMobileActive: false,
    menuHoverActive: false
  });

  private configUpdate = new Subject<layoutConfig>();

  configUpdate$ = this.configUpdate.asObservable();

  theme            = computed(() => (this.layoutConfig()?.darkTheme ? 'light' : 'dark'));
  isDarkTheme      = computed(() => this.layoutConfig().darkTheme);
  getPrimary       = computed(() => this.layoutConfig().primary);
  getSurface       = computed(() => this.layoutConfig().surface);

  isSidebarActive  = computed(() => false);
  isOverlay        = computed(() => false);

  transitionComplete = signal<boolean>(false);

  constructor() {
    effect(() => {
      const config = this.layoutConfig();
      if (config) {
        this.toggleDarkMode(config);
        this.onConfigUpdate();
      }
    });
  }

  toggleDarkMode(config?: layoutConfig): void {
    const _config = config || this.layoutConfig();
    if (_config.darkTheme) {
      document.documentElement.classList.add('app-dark');
    } else {
      document.documentElement.classList.remove('app-dark');
    }
  }

  onConfigUpdate() {
    this.configUpdate.next(this.layoutConfig());
  }

  onMenuToggle() {
    return;
  }

  isDesktop() {
    return window.innerWidth > 991;
  }

  isMobile() {
    return !this.isDesktop();
  }

  reset() {
    this.layoutConfig.set({ ...DEFAULT_LAYOUT_CONFIG });
  }
}
