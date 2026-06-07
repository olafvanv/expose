import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
})
export class ShellComponent {
  readonly navItems: NavItem[] = [
    { path: '/', label: 'Sessies', icon: 'camera' },
    { path: '/rolls', label: 'Rollen', icon: 'film' },
    { path: '/settings', label: 'Instellingen', icon: 'settings' },
  ];
}
