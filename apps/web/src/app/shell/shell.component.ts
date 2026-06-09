import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

type NavItem = {
  path: string;
  label: string;
  icon: string;
};

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
})
export class ShellComponent {
  public readonly navItems: NavItem[] = [
    { path: '/', label: 'Sessions', icon: 'camera' },
    { path: '/rolls', label: 'Rolls', icon: 'film' },
    { path: '/settings', label: 'Settings', icon: 'settings' },
  ];
}
