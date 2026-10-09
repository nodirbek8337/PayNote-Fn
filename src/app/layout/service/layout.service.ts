import { Injectable, effect, signal, computed } from '@angular/core';
import { Subject } from 'rxjs';

export interface LayoutConfig {
  preset: string;
  primary: string;
  surface: string;
  darkTheme: boolean;
  menuMode: string;
}

interface LayoutState {
  staticMenuDesktopInactive: boolean;
  overlayMenuActive: boolean;
  configSidebarVisible: boolean;
  staticMenuMobileActive: boolean;
  menuHoverActive: boolean;
}

const THEME_STORAGE_KEY = 'esesucTheme';

function initialDarkTheme(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'dark') return true;
    if (saved === 'light') return false;
  } catch { /* Browser storage may be unavailable in private/restricted contexts. */ }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
}

export const DEFAULT_LAYOUT_CONFIG: LayoutConfig = {
  preset: 'Lara',
  primary: 'blue',
  surface: 'slate',
  darkTheme: initialDarkTheme(),
  menuMode: 'overlay'
};

@Injectable({ providedIn: 'root' })
export class LayoutService {
  layoutConfig = signal<LayoutConfig>({ ...DEFAULT_LAYOUT_CONFIG });

  layoutState = signal<LayoutState>({
    staticMenuDesktopInactive: false,
    overlayMenuActive: false,
    configSidebarVisible: false,
    staticMenuMobileActive: false,
    menuHoverActive: false
  });

  sidebarCollapsed = signal(false);

  private configUpdate = new Subject<LayoutConfig>();
  configUpdate$ = this.configUpdate.asObservable();

  theme       = computed(() => (this.layoutConfig().darkTheme ? 'dark' : 'light'));
  isDarkTheme = computed(() => this.layoutConfig().darkTheme);
  getPrimary  = computed(() => this.layoutConfig().primary);
  getSurface  = computed(() => this.layoutConfig().surface);

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

  toggleDarkMode(config?: LayoutConfig): void {
    const _config = config || this.layoutConfig();
    if (_config.darkTheme) {
      document.documentElement.classList.add('app-dark');
    } else {
      document.documentElement.classList.remove('app-dark');
    }
  }

  setDarkTheme(darkTheme: boolean): void {
    this.layoutConfig.update(config => ({ ...config, darkTheme }));
    if (typeof window !== 'undefined') {
      try { window.localStorage.setItem(THEME_STORAGE_KEY, darkTheme ? 'dark' : 'light'); } catch { /* Keep theme in memory. */ }
    }
  }

  toggleTheme(): void {
    this.setDarkTheme(!this.layoutConfig().darkTheme);
  }

  setSidebarCollapsed(collapsed: boolean): void {
    this.sidebarCollapsed.set(collapsed);
  }

  toggleSidebar(): void {
    this.sidebarCollapsed.update((collapsed) => !collapsed);
  }

  onConfigUpdate() {
    this.configUpdate.next(this.layoutConfig());
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
